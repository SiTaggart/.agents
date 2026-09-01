import path from "path";
import { copyDirectory, resetDir } from "../fs";
import type { SourceSkill } from "../types";
import { sanitizePathName, transformContentForOpenCode } from "./content";
import { loadSkillSources } from "./source";

export async function renderOpenCode(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "opencode");
  await resetDir(outputRoot);

  const skills = await loadSkillSources(root);
  await Promise.all(skills.map((skill) => renderOpenCodeSkill(outputRoot, skill)));
}

async function renderOpenCodeSkill(outputRoot: string, skill: SourceSkill): Promise<void> {
  await copyDirectory({
    source: skill.sourceDir,
    target: path.join(outputRoot, "skills", sanitizePathName(skill.name)),
    transformText: (content) => transformContentForOpenCode(content),
  });
}
