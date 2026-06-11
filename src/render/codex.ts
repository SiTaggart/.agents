import path from "path";
import { rm } from "fs/promises";

export async function renderCodex(root: string): Promise<void> {
  await rm(path.join(root, ".generated", "codex"), { recursive: true, force: true });
}
