import { renderCodex } from "./codex";
import { renderOpenCode } from "./opencode";
import type { RenderTargetOptions, Target } from "../types";

export const RENDER_TARGETS: readonly Target[] = ["opencode", "codex"];

export async function renderTarget(options: RenderTargetOptions): Promise<void> {
  if (options.target === "opencode") {
    await renderOpenCode(options.root);
    return;
  }

  await renderCodex(options.root);
}

export async function renderTargets(root: string, targets: readonly Target[]): Promise<void> {
  await Promise.all(targets.map((target) => renderTarget({ root, target })));
}
