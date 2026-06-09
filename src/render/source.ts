import path from "path";
import { parseFrontmatter, readStringField } from "../frontmatter";
import { listFiles, readText } from "../fs";
import type { SourceMarkdownFile, SourceSkill } from "../types";
import { deriveMarkdownName } from "./content";

export async function loadMarkdownSources(root: string, directoryName: string): Promise<readonly SourceMarkdownFile[]> {
  const sourceRoot = path.join(root, directoryName);
  const files = await listFiles(sourceRoot, (filePath) => filePath.endsWith(".md"));
  const sources = await Promise.all(files.map(loadMarkdownSource));
  return sources.sort((left, right) => left.name.localeCompare(right.name));
}

export async function loadSkillSources(root: string): Promise<readonly SourceSkill[]> {
  const skillsRoot = path.join(root, "skills");
  const skillFiles = await listFiles(
    skillsRoot,
    (filePath) => path.basename(filePath) === "SKILL.md" && !hasHiddenPathSegment(skillsRoot, filePath),
  );
  const skills = await Promise.all(skillFiles.map(loadSkillSource));
  return skills.sort((left, right) => left.name.localeCompare(right.name));
}

async function loadMarkdownSource(sourcePath: string): Promise<SourceMarkdownFile> {
  const raw = await readText(sourcePath);
  const parsed = parseFrontmatter(raw);
  return {
    ...parsed,
    name: readStringField(parsed.frontmatter, "name") ?? deriveMarkdownName(sourcePath),
    sourcePath,
  };
}

async function loadSkillSource(skillPath: string): Promise<SourceSkill> {
  const raw = await readText(skillPath);
  const parsed = parseFrontmatter(raw);
  return {
    name: readStringField(parsed.frontmatter, "name") ?? path.basename(path.dirname(skillPath)),
    sourceDir: path.dirname(skillPath),
    skillPath,
  };
}

function hasHiddenPathSegment(root: string, filePath: string): boolean {
  const relativePath = path.relative(root, filePath);
  return relativePath.split(path.sep).some((segment) => segment.startsWith("."));
}
