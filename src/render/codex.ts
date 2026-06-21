import path from "path";
import { copyDirectory, ensureDirs, resetDir, writeText } from "../fs";
import { readStringField } from "../frontmatter";
import type { SourceMarkdownFile } from "../types";
import { sanitizePathName } from "./content";
import { loadMarkdownSources } from "./source";

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
    "",
  ].join("\n");

  await writeText(path.join(outputRoot, "agents", `${sanitizePathName(agent.name)}.toml`), content);
}

function codexOptionalModelLines(agent: SourceMarkdownFile): readonly string[] {
  const model = readStringField(agent.frontmatter, "codex_model");
  return model && model !== "inherit" ? [`model = ${formatTomlString(model)}`] : [];
}

function formatTomlString(value: string): string {
  return JSON.stringify(value);
}
