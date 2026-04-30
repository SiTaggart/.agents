import { copyFile, lstat, mkdir, readFile, readdir, readlink, rm, symlink, unlink, writeFile } from "fs/promises";
import type { Dirent, Stats } from "fs";
import path from "path";
import type { SourceKind } from "./types";

interface CopyDirectoryOptions {
  source: string;
  target: string;
  transformText?: (content: string, sourcePath: string) => string;
}

interface LinkOptions {
  source: string;
  target: string;
  kind: SourceKind;
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

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function ensureDirs(dirs: readonly string[]): Promise<void> {
  await Promise.all(dirs.map(ensureDir));
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

export async function replaceSymlink(options: LinkOptions): Promise<void> {
  await validateSymlink(options);

  await mkdir(path.dirname(options.target), { recursive: true });

  const existing = await statSafe(options.target);
  if (existing?.isSymbolicLink()) {
    const existingTarget = await resolveSymlink(options.target);
    if (existingTarget === path.resolve(options.source)) {
      return;
    }
    await unlink(options.target);
  } else if (existing) {
    throw new Error(`Refusing to replace non-symlink target: ${options.target}`);
  }

  const link = path.relative(path.dirname(options.target), options.source) || ".";
  await symlink(link, options.target, options.kind);
}

export async function validateSymlink(options: LinkOptions): Promise<void> {
  const sourceStat = await statSafe(options.source);
  if (!sourceStat) {
    throw new Error(`Cannot link missing source: ${options.source}`);
  }

  validateSourceKind(options, sourceStat);

  const existing = await statSafe(options.target);
  if (existing && !existing.isSymbolicLink()) {
    throw new Error(`Refusing to replace non-symlink target: ${options.target}`);
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

async function statSafe(filePath: string): Promise<Stats | null> {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function resolveSymlink(linkPath: string): Promise<string | null> {
  try {
    const linkTarget = await readlink(linkPath);
    return path.resolve(path.dirname(linkPath), linkTarget);
  } catch {
    return null;
  }
}

function isTextPath(filePath: string): boolean {
  return /\.(cjs|css|js|json|md|mjs|py|sh|toml|ts|tsx|txt|yaml|yml)$/i.test(filePath);
}

function validateSourceKind(options: LinkOptions, sourceStat: Stats): void {
  if (options.kind === "dir" && !sourceStat.isDirectory()) {
    throw new Error(`Expected directory source for ${options.target}: ${options.source}`);
  }

  if (options.kind === "file" && !sourceStat.isFile()) {
    throw new Error(`Expected file source for ${options.target}: ${options.source}`);
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}
