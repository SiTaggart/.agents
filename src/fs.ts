import { lstat, readFile } from "fs/promises";
import type { Stats } from "fs";

export async function pathExists(filePath: string): Promise<boolean> {
  return (await statSafe(filePath)) !== null;
}

export async function readText(filePath: string): Promise<string> {
  return await readFile(filePath, "utf8");
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

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}
