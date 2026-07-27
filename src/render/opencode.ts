import path from "path";
import { copyDirectory, ensureDirs, resetDir, writeText } from "../fs";
import type { SourceSkill } from "../types";
import { sanitizePathName, transformContentForOpenCode } from "./content";
import { loadSkillSources } from "./source";

export async function renderOpenCode(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "opencode");
  await resetDir(outputRoot);
  await ensureDirs([
    path.join(outputRoot, "hooks"),
    path.join(outputRoot, "plugins"),
    path.join(outputRoot, "skills"),
  ]);

  const skills = await loadSkillSources(root);

  await Promise.all([
    ...skills.map((skill) => renderOpenCodeSkill(outputRoot, skill)),
    copyDirectory({
      source: path.join(root, "hooks", "scripts"),
      target: path.join(outputRoot, "hooks"),
    }),
    writeText(path.join(outputRoot, "plugins", "dotagents-hooks.js"), buildOpenCodeHookPlugin()),
  ]);
}

async function renderOpenCodeSkill(outputRoot: string, skill: SourceSkill): Promise<void> {
  await copyDirectory({
    source: skill.sourceDir,
    target: path.join(outputRoot, "skills", sanitizePathName(skill.name)),
    transformText: (content) => transformContentForOpenCode(content),
  });
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
