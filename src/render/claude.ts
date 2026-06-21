import path from "path";
import { formatFrontmatter } from "../frontmatter";
import { copyDirectory, ensureDirs, resetDir, writeText } from "../fs";
import type { SourceMarkdownFile, SourceSkill } from "../types";
import { sanitizePathName } from "./content";
import { loadMarkdownSources, loadSkillSources } from "./source";

export async function renderClaude(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "claude");
  await resetDir(outputRoot);
  await ensureDirs([
    path.join(outputRoot, "agents"),
    path.join(outputRoot, "hooks"),
    path.join(outputRoot, "skills"),
  ]);

  const [agents, skills] = await Promise.all([
    loadMarkdownSources(root, "agents"),
    loadSkillSources(root),
  ]);

  await Promise.all([
    ...agents.map((agent) => renderClaudeMarkdown(outputRoot, "agents", agent)),
    ...skills.map((skill) => renderClaudeSkill(outputRoot, skill)),
    copyDirectory({
      source: path.join(root, "hooks", "scripts"),
      target: path.join(outputRoot, "hooks"),
    }),
  ]);
}

async function renderClaudeMarkdown(
  outputRoot: string,
  section: "agents",
  source: SourceMarkdownFile,
): Promise<void> {
  const content = formatFrontmatter(source.frontmatter, source.body.trim());
  await writeText(path.join(outputRoot, section, `${sanitizePathName(source.name)}.md`), `${content}\n`);
}

async function renderClaudeSkill(outputRoot: string, skill: SourceSkill): Promise<void> {
  await copyDirectory({
    source: skill.sourceDir,
    target: path.join(outputRoot, "skills", sanitizePathName(skill.name)),
  });
}
