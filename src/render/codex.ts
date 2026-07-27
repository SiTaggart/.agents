import path from "path";
import { copyDirectory, resetDir } from "../fs";

export async function renderCodex(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "codex");
  await resetDir(outputRoot);

  await copyDirectory({
    source: path.join(root, "hooks", "scripts"),
    target: path.join(outputRoot, "hooks"),
  });
}
