import path from "path";
import { formatFrontmatter, readStringField } from "../frontmatter";
import { copyDirectory, ensureDirs, resetDir, writeText } from "../fs";
import type { FrontmatterRecord, FrontmatterValue, SourceMarkdownFile, SourceSkill } from "../types";
import { parseToolNames, sanitizePathName, transformContentForOpenCode } from "./content";
import { loadMarkdownSources, loadSkillSources } from "./source";

export async function renderOpenCode(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "opencode");
  await resetDir(outputRoot);
  await ensureDirs([
    path.join(outputRoot, "agents"),
    path.join(outputRoot, "commands"),
    path.join(outputRoot, "skills"),
  ]);

  const [agents, commands, skills] = await Promise.all([
    loadMarkdownSources(root, "agents"),
    loadMarkdownSources(root, "commands"),
    loadSkillSources(root),
  ]);

  await Promise.all([
    ...agents.map((agent) => renderOpenCodeAgent(outputRoot, agent)),
    ...commands.map((command) => renderOpenCodeCommand(outputRoot, command)),
    ...skills.map((skill) => renderOpenCodeSkill(outputRoot, skill)),
  ]);
}

async function renderOpenCodeAgent(outputRoot: string, agent: SourceMarkdownFile): Promise<void> {
  const content = formatFrontmatter(
    buildOpenCodeAgentFrontmatter(agent),
    transformContentForOpenCode(agent.body.trim()),
  );
  await writeText(path.join(outputRoot, "agents", `${sanitizePathName(agent.name)}.md`), `${content}\n`);
}

async function renderOpenCodeCommand(outputRoot: string, command: SourceMarkdownFile): Promise<void> {
  const content = formatFrontmatter(
    buildOpenCodeCommandFrontmatter(command),
    transformContentForOpenCode(command.body.trim()),
  );
  await writeText(path.join(outputRoot, "commands", `${sanitizePathName(command.name)}.md`), `${content}\n`);
}

async function renderOpenCodeSkill(outputRoot: string, skill: SourceSkill): Promise<void> {
  await copyDirectory({
    source: skill.sourceDir,
    target: path.join(outputRoot, "skills", sanitizePathName(skill.name)),
    transformText: (content) => transformContentForOpenCode(content),
  });
}

function buildOpenCodeAgentFrontmatter(agent: SourceMarkdownFile): FrontmatterRecord {
  const description = readStringField(agent.frontmatter, "description");
  const permission = buildOpenCodePermission(agent.frontmatter.tools);
  const base: FrontmatterRecord = description
    ? { description, mode: "subagent" }
    : { mode: "subagent" };

  return permission ? { ...base, permission } : base;
}

function buildOpenCodeCommandFrontmatter(command: SourceMarkdownFile): FrontmatterRecord {
  const description = readStringField(command.frontmatter, "description");
  const model = readStringField(command.frontmatter, "model");
  const base: FrontmatterRecord = description ? { description } : {};
  return model && model !== "inherit" ? { ...base, model } : base;
}

function buildOpenCodePermission(value: FrontmatterValue | undefined): FrontmatterRecord | undefined {
  const tools = parseToolNames(value);
  if (tools.length === 0) {
    return undefined;
  }

  return tools.reduce<FrontmatterRecord>(
    (permission, tool) => ({
      ...permission,
      [tool]: "allow",
    }),
    {},
  );
}
