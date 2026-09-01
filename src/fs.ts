import { copyFile, lstat, mkdir, readFile, readdir, rm, writeFile } from "fs/promises";
import type { Dirent, Stats } from "fs";
import path from "path";

interface CopyDirectoryOptions {
  source: string;
  target: string;
  transformText?: (content: string, sourcePath: string) => string;
}

export async function pathExists(filePath: string): Promise<boolean> {
  return (await statSafe(filePath)) !== null;
}

export async function readText(filePath: string): Promise<string> {
  return await readFile(filePath, "utf8");
}

export async function writeText(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

export async function resetDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
}

export async function listFiles(dir: string, predicate?: (filePath: string) => boolean): Promise<readonly string[]> {
  const entries = await readDirSafe(dir);
  const files = await Promise.all(entries.map((entry) => listEntryFiles(dir, entry, predicate)));
  return files.flat().sort((left, right) => left.localeCompare(right));
}

export async function copyDirectory(options: CopyDirectoryOptions): Promise<void> {
  const entries = await readDirSafe(options.source);
  await mkdir(options.target, { recursive: true });
  await Promise.all(entries.map((entry) => copyDirectoryEntry(options, entry)));
}

export async function statSafe(filePath: string): Promise<Stats | null> {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function listEntryFiles(
  dir: string,
  entry: Dirent,
  predicate?: (filePath: string) => boolean,
): Promise<readonly string[]> {
  const entryPath = path.join(dir, entry.name);
  if (entry.isDirectory()) {
    return await listFiles(entryPath, predicate);
  }

  if (!entry.isFile()) {
    return [];
  }

  return !predicate || predicate(entryPath) ? [entryPath] : [];
}

async function copyDirectoryEntry(options: CopyDirectoryOptions, entry: Dirent): Promise<void> {
  const sourcePath = path.join(options.source, entry.name);
  const targetPath = path.join(options.target, entry.name);

  if (entry.isDirectory()) {
    await copyDirectory({ ...options, source: sourcePath, target: targetPath });
    return;
  }

  if (!entry.isFile()) {
    return;
  }

  if (options.transformText && isTextPath(sourcePath)) {
    const content = await readText(sourcePath);
    await writeText(targetPath, options.transformText(content, sourcePath));
    return;
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourcePath, targetPath);
}

async function readDirSafe(dir: string): Promise<readonly Dirent[]> {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function isTextPath(filePath: string): boolean {
  return /\.(cjs|css|js|json|md|mjs|py|sh|toml|ts|tsx|txt|yaml|yml)$/i.test(filePath);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}
