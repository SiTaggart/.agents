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
    path.join(outputRoot, "hooks"),
    path.join(outputRoot, "plugins"),
    path.join(outputRoot, "skills"),
  ]);

  const [agents, skills] = await Promise.all([
    loadMarkdownSources(root, "agents"),
    loadSkillSources(root),
  ]);

  await Promise.all([
    ...agents.map((agent) => renderOpenCodeAgent(outputRoot, agent)),
    ...skills.map((skill) => renderOpenCodeSkill(outputRoot, skill)),
    copyDirectory({
      source: path.join(root, "hooks", "scripts"),
      target: path.join(outputRoot, "hooks"),
    }),
    writeText(path.join(outputRoot, "plugins", "dotagents-hooks.js"), buildOpenCodeHookPlugin()),
  ]);
}

async function renderOpenCodeAgent(outputRoot: string, agent: SourceMarkdownFile): Promise<void> {
  const content = formatFrontmatter(
    buildOpenCodeAgentFrontmatter(agent),
    transformContentForOpenCode(agent.body.trim()),
  );
  await writeText(path.join(outputRoot, "agents", `${sanitizePathName(agent.name)}.md`), `${content}\n`);
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

function buildOpenCodeHookPlugin(): string {
  return [
    'import { spawnSync } from "node:child_process";',
    'import path from "node:path";',
    'import { fileURLToPath } from "node:url";',
    "",
    "const pluginDir = path.dirname(fileURLToPath(import.meta.url));",
    "const hookPath = path.resolve(pluginDir, '..', 'hooks', 'prevent-main-commit.sh');",
    "",
    "export const DotAgentsHooks = async ({ directory, worktree }) => {",
    "  const hookCwd = typeof worktree === 'string' && worktree.length > 0",
    "    ? worktree",
    "    : typeof directory === 'string' && directory.length > 0 ? directory : undefined;",
    "  return {",
    "    'tool.execute.before': async (input, output) => {",
    "      if (input.tool !== 'bash') return;",
    "      const command = output.args?.command;",
    "      if (typeof command !== 'string') return;",
    "      const result = spawnSync('/bin/bash', [hookPath], {",
    "        input: JSON.stringify({",
    "          hook_event_name: 'PreToolUse',",
    "          tool_name: 'bash',",
    "          tool_input: { command },",
    "        }),",
    "        encoding: 'utf8',",
    "        cwd: hookCwd,",
    "      });",
    "      const hookFailure = result.stderr?.trim() || result.error?.message || 'dot-agents hook failed';",
    "      if (result.error) {",
    "        throw new Error(hookFailure);",
    "      }",
    "      if (result.signal) {",
    "        throw new Error(`${hookFailure}: terminated by ${result.signal}`);",
    "      }",
    "      if (result.status === 2) {",
    "        throw new Error(result.stderr?.trim() || 'Blocked by dot-agents hook');",
    "      }",
    "      if (result.status !== 0) {",
    "        throw new Error(hookFailure);",
    "      }",
    "    },",
    "  };",
    "};",
    "",
  ].join("\n");
}
