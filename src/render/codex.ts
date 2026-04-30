import path from "path";
import { formatFrontmatter, readStringField } from "../frontmatter";
import { copyDirectory, ensureDirs, resetDir, writeText } from "../fs";
import type { FrontmatterRecord, SourceMarkdownFile, SourceSkill } from "../types";
import { sanitizePathName, transformContentForCodex } from "./content";
import { loadMarkdownSources, loadSkillSources } from "./source";

export async function renderCodex(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "codex");
  await resetDir(outputRoot);
  await ensureDirs([
    path.join(outputRoot, "agents"),
    path.join(outputRoot, "prompts"),
    path.join(outputRoot, "skills"),
  ]);

  const [agents, commands, skills] = await Promise.all([
    loadMarkdownSources(root, "agents"),
    loadMarkdownSources(root, "commands"),
    loadSkillSources(root),
  ]);

  await Promise.all([
    ...agents.map((agent) => renderCodexAgent(outputRoot, agent)),
    ...commands.map((command) => renderCodexPrompt(outputRoot, command)),
    ...skills.map((skill) => renderCodexSkill(outputRoot, skill)),
  ]);
}

async function renderCodexAgent(outputRoot: string, agent: SourceMarkdownFile): Promise<void> {
  const description = readStringField(agent.frontmatter, "description") ?? `Converted from ${agent.name}`;
  const instructions = transformContentForCodex(agent.body.trim());
  const content = [
    `name = ${formatTomlString(sanitizePathName(agent.name))}`,
    `description = ${formatTomlString(description)}`,
    `developer_instructions = ${formatTomlString(instructions)}`,
  ].join("\n");

  await writeText(path.join(outputRoot, "agents", `${sanitizePathName(agent.name)}.toml`), `${content}\n`);
}

async function renderCodexPrompt(outputRoot: string, command: SourceMarkdownFile): Promise<void> {
  const frontmatter = buildCodexPromptFrontmatter(command);
  const content = formatFrontmatter(frontmatter, transformContentForCodex(command.body.trim()));
  await writeText(path.join(outputRoot, "prompts", `${sanitizePathName(command.name)}.md`), `${content}\n`);
}

async function renderCodexSkill(outputRoot: string, skill: SourceSkill): Promise<void> {
  await copyDirectory({
    source: skill.sourceDir,
    target: path.join(outputRoot, "skills", sanitizePathName(skill.name)),
    transformText: (content) => transformContentForCodex(content),
  });
}

function buildCodexPromptFrontmatter(command: SourceMarkdownFile): FrontmatterRecord {
  const description = readStringField(command.frontmatter, "description");
  return description ? { description } : {};
}

function formatTomlString(value: string): string {
  const serialized = JSON.stringify(value);
  return serialized ?? "\"\"";
}
