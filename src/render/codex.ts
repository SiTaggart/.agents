import path from "path";
import { copyDirectory, ensureDirs, resetDir } from "../fs";

export async function renderCodex(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "codex");
  await resetDir(outputRoot);
  await ensureDirs([path.join(outputRoot, "hooks")]);

  await copyDirectory({
    source: path.join(root, "hooks", "scripts"),
    target: path.join(outputRoot, "hooks"),
  });
}
