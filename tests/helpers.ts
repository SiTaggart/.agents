import { mkdtemp, readFile, readlink, rm, writeFile, mkdir } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

export async function makeTempRoot(prefix: string): Promise<string> {
  return await mkdtemp(path.join(tmpdir(), prefix));
}

export async function removeTempRoot(root: string): Promise<void> {
  await rm(root, { recursive: true, force: true });
}

export async function writeText(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

export async function readText(filePath: string): Promise<string> {
  return await readFile(filePath, "utf8");
}

export async function readSymlinkTarget(linkPath: string): Promise<string> {
  const target = await readlink(linkPath);
  return path.isAbsolute(target) ? target : path.resolve(path.dirname(linkPath), target);
}
