import path from "path";
import { parseFrontmatter, readStringField } from "../frontmatter";
import { listFiles, readText } from "../fs";
import type { SourceSkill } from "../types";

export async function loadSkillSources(root: string): Promise<readonly SourceSkill[]> {
  const skillsRoot = path.join(root, "skills");
  const skillFiles = await listFiles(
    skillsRoot,
    (filePath) => path.basename(filePath) === "SKILL.md" && !hasHiddenPathSegment(skillsRoot, filePath),
  );
  const skills = await Promise.all(skillFiles.map(loadSkillSource));
  return skills.sort((left, right) => left.name.localeCompare(right.name));
}

async function loadSkillSource(skillPath: string): Promise<SourceSkill> {
  const raw = await readText(skillPath);
  const parsed = parseFrontmatter(raw);
  return {
    name: readStringField(parsed.frontmatter, "name") ?? path.basename(path.dirname(skillPath)),
    sourceDir: path.dirname(skillPath),
  };
}

function hasHiddenPathSegment(root: string, filePath: string): boolean {
  const relativePath = path.relative(root, filePath);
  return relativePath.split(path.sep).some((segment) => segment.startsWith("."));
}
