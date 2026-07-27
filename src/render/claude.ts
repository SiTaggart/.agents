import path from "path";
import { copyDirectory, ensureDirs, resetDir } from "../fs";
import type { SourceSkill } from "../types";
import { sanitizePathName } from "./content";
import { loadSkillSources } from "./source";

export async function renderClaude(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "claude");
  await resetDir(outputRoot);
  await ensureDirs([
    path.join(outputRoot, "hooks"),
    path.join(outputRoot, "skills"),
  ]);

  const skills = await loadSkillSources(root);

  await Promise.all([
    ...skills.map((skill) => renderClaudeSkill(outputRoot, skill)),
    copyDirectory({
      source: path.join(root, "hooks", "scripts"),
      target: path.join(outputRoot, "hooks"),
    }),
  ]);
}

async function renderClaudeSkill(outputRoot: string, skill: SourceSkill): Promise<void> {
  await copyDirectory({
    source: skill.sourceDir,
    target: path.join(outputRoot, "skills", sanitizePathName(skill.name)),
  });
}
