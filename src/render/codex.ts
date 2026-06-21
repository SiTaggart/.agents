import path from "path";
import { copyDirectory, ensureDirs, resetDir, writeText } from "../fs";
import { readStringField } from "../frontmatter";
import type { SourceMarkdownFile } from "../types";
import { parseToolNames, sanitizePathName } from "./content";
import { loadMarkdownSources } from "./source";

const CODEX_WRITE_TOOLS = new Set(["edit", "patch", "write"]);

export async function renderCodex(root: string): Promise<void> {
  const outputRoot = path.join(root, ".generated", "codex");
  await resetDir(outputRoot);
  await ensureDirs([
    path.join(outputRoot, "agents"),
    path.join(outputRoot, "hooks"),
  ]);

  const agents = await loadMarkdownSources(root, "agents");
  await Promise.all([
    ...agents.map((agent) => renderCodexAgent(outputRoot, agent)),
    copyDirectory({
      source: path.join(root, "hooks", "scripts"),
      target: path.join(outputRoot, "hooks"),
    }),
  ]);
}

async function renderCodexAgent(outputRoot: string, agent: SourceMarkdownFile): Promise<void> {
  const content = [
    `name = ${formatTomlString(agent.name)}`,
    `description = ${formatTomlString(readStringField(agent.frontmatter, "description") ?? agent.name)}`,
    `developer_instructions = ${formatTomlString(agent.body.trim())}`,
    ...codexOptionalModelLines(agent),
    ...codexSandboxLines(agent),
    "",
  ].join("\n");

  await writeText(path.join(outputRoot, "agents", `${sanitizePathName(agent.name)}.toml`), content);
}

function codexOptionalModelLines(agent: SourceMarkdownFile): readonly string[] {
  const model = readStringField(agent.frontmatter, "codex_model");
  return model && model !== "inherit" ? [`model = ${formatTomlString(model)}`] : [];
}

function codexSandboxLines(agent: SourceMarkdownFile): readonly string[] {
  if (agent.frontmatter.tools === undefined) {
    return [];
  }

  const tools = parseToolNames(agent.frontmatter.tools);
  return tools.some((tool) => CODEX_WRITE_TOOLS.has(tool)) ? [] : ['sandbox_mode = "read-only"'];
}

function formatTomlString(value: string): string {
  return JSON.stringify(value);
}
