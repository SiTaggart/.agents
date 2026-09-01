import path from "path";
import { pathExists, readText } from "./fs";
import {
  PLUGIN_BUNDLE,
  PLUGIN_ID,
  type HarnessAdapter,
  type ManifestKind,
  type PluginBundle,
} from "./plugin-bundle";

export interface ValidationFailure {
  path: string;
  message: string;
}

export interface ValidationReport {
  ok: boolean;
  failures: readonly ValidationFailure[];
}

const FORBIDDEN_INSTRUCTION_BASENAMES = new Set(["agents.md", "claude.md"]);
const COMPONENT_KEYS = new Set([
  "skills",
  "hooks",
  "rules",
  "agents",
  "commands",
  "mcpServers",
  "apps",
  "instructions",
]);

const KIND_CHECKS: Record<ManifestKind, (ctx: KindCheckContext) => void> = {
  "cursor-plugin": collectCursorManifestFailures,
  "claude-plugin": collectNamedPluginManifestFailures,
  "codex-plugin": collectCodexManifestFailures,
  "opencode-package": collectOpenCodePackageFailures,
};

interface KindCheckContext {
  adapter: HarnessAdapter;
  document: unknown;
  relPath: string;
  failures: ValidationFailure[];
}

export async function validatePluginBundle(
  root: string,
  bundle: PluginBundle = PLUGIN_BUNDLE,
): Promise<ValidationReport> {
  const failures: ValidationFailure[] = [];

  await Promise.all([
    collectMissingPathFailures(root, bundle.skillsDir, "Canonical skills directory is missing.", failures),
    collectMissingPathFailures(root, bundle.hookFiles.script, "Hook script is missing.", failures),
    collectMissingPathFailures(root, bundle.hookFiles.claudeCodex, "Claude and Codex hook config is missing.", failures),
    collectMissingPathFailures(root, bundle.hookFiles.cursor, "Cursor hook config is missing.", failures),
    collectRetiredPathFailures(root, bundle, failures),
    collectAdapterFailures(root, bundle, failures),
  ]);

  collectGrokAliasFailures(bundle, failures);

  return {
    ok: failures.length === 0,
    failures,
  };
}

export function namesInstructionFile(value: string): boolean {
  const normalized = value.trim().replace(/\\/g, "/").toLowerCase();
  const base = normalized.split("/").pop() ?? normalized;
  return FORBIDDEN_INSTRUCTION_BASENAMES.has(base);
}

async function collectAdapterFailures(
  root: string,
  bundle: PluginBundle,
  failures: ValidationFailure[],
): Promise<void> {
  const scriptName = path.basename(bundle.hookFiles.script);
  await Promise.all(
    Object.values(bundle.manifests).map((adapter) => collectOneAdapterFailures(root, adapter, scriptName, failures)),
  );
}

async function collectOneAdapterFailures(
  root: string,
  adapter: HarnessAdapter,
  scriptName: string,
  failures: ValidationFailure[],
): Promise<void> {
  await collectMissingPathFailures(root, adapter.skillsPath, "Skills path named by the adapter is missing.", failures);

  if (adapter.hooksPath) {
    await collectMissingPathFailures(root, adapter.hooksPath, "Hook config named by the adapter is missing.", failures);
    await collectHookScriptReferenceFailures(root, adapter.hooksPath, scriptName, failures);
  }

  if (adapter.marketplacePath) {
    await collectJsonDocumentFailures(root, adapter.marketplacePath, (document, relPath) => {
      collectMarketplaceFailures(adapter, document, relPath, failures);
    }, failures);
  }

  await collectJsonDocumentFailures(root, adapter.manifestPath, (document, relPath) => {
    KIND_CHECKS[adapter.kind]({ adapter, document, relPath, failures });
    collectForbiddenComponentFailures(document, relPath, failures);
  }, failures);
}

function collectNamedPluginManifestFailures(ctx: KindCheckContext): void {
  const record = asRecord(ctx.document);
  if (!record) {
    ctx.failures.push({ path: ctx.relPath, message: "Plugin manifest must be a JSON object." });
    return;
  }

  if (record.name !== PLUGIN_ID) {
    ctx.failures.push({ path: ctx.relPath, message: `Plugin name must be ${PLUGIN_ID}.` });
  }

  collectNamedPathFailures(record.skills, ctx.adapter.skillsPath, ctx.relPath, "skills", ctx.failures);
  if (ctx.adapter.hooksPath) {
    collectNamedPathFailures(record.hooks, ctx.adapter.hooksPath, ctx.relPath, "hooks", ctx.failures);
  }
}

function collectCursorManifestFailures(ctx: KindCheckContext): void {
  collectNamedPluginManifestFailures(ctx);
  const record = asRecord(ctx.document);
  if (record && "rules" in record) {
    ctx.failures.push({ path: ctx.relPath, message: "Cursor plugin must not declare rules." });
  }
}

function collectCodexManifestFailures(ctx: KindCheckContext): void {
  collectNamedPluginManifestFailures(ctx);
}

function collectOpenCodePackageFailures(ctx: KindCheckContext): void {
  const record = asRecord(ctx.document);
  if (!record) {
    ctx.failures.push({ path: ctx.relPath, message: "OpenCode package.json must be a JSON object." });
    return;
  }

  if (record.name !== PLUGIN_ID) {
    ctx.failures.push({ path: ctx.relPath, message: `package.json name must be ${PLUGIN_ID}.` });
  }

  const exportsField = asRecord(record.exports);
  const exportTarget = exportsField?.["."];
  if (typeof exportTarget !== "string" || !exportTarget.endsWith("opencode-plugin.ts")) {
    ctx.failures.push({
      path: ctx.relPath,
      message: "package.json must export ./src/opencode-plugin.ts as \".\".",
    });
  }

  if ("skills" in record) {
    ctx.failures.push({
      path: ctx.relPath,
      message: "OpenCode package.json must not claim a SKILL.md marketplace.",
    });
  }
}

function collectMarketplaceFailures(
  adapter: HarnessAdapter,
  document: unknown,
  relPath: string,
  failures: ValidationFailure[],
): void {
  const record = asRecord(document);
  if (!record) {
    failures.push({ path: relPath, message: "Marketplace catalog must be a JSON object." });
    return;
  }

  if (record.name !== PLUGIN_ID) {
    failures.push({ path: relPath, message: `Marketplace name must be ${PLUGIN_ID}.` });
  }

  const plugins = record.plugins;
  if (!Array.isArray(plugins) || plugins.length === 0) {
    failures.push({ path: relPath, message: "Marketplace must list at least one plugin." });
    return;
  }

  const plugin = plugins.find((entry) => asRecord(entry)?.name === PLUGIN_ID);
  if (!plugin) {
    failures.push({ path: relPath, message: `Marketplace must list ${PLUGIN_ID}.` });
    return;
  }

  if (adapter.kind === "claude-plugin") {
    collectClaudeMarketplaceEntryFailures(record, plugin, relPath, failures);
    return;
  }

  if (adapter.kind === "cursor-plugin") {
    collectCursorMarketplaceEntryFailures(record, plugin, relPath, failures);
    return;
  }

  if (adapter.kind === "codex-plugin") {
    collectCodexMarketplaceEntryFailures(plugin, relPath, failures);
  }
}

function collectClaudeMarketplaceEntryFailures(
  marketplace: Record<string, unknown>,
  plugin: unknown,
  relPath: string,
  failures: ValidationFailure[],
): void {
  const owner = asRecord(marketplace.owner);
  if (typeof owner?.name !== "string" || owner.name.length === 0) {
    failures.push({ path: relPath, message: "Claude marketplace must include owner.name." });
  }

  const entry = asRecord(plugin);
  if (entry?.source !== "./") {
    failures.push({ path: relPath, message: "Claude marketplace source must be \"./\"." });
  }
}

function collectCursorMarketplaceEntryFailures(
  marketplace: Record<string, unknown>,
  plugin: unknown,
  relPath: string,
  failures: ValidationFailure[],
): void {
  const owner = asRecord(marketplace.owner);
  if (typeof owner?.name !== "string" || owner.name.length === 0) {
    failures.push({ path: relPath, message: "Cursor marketplace must include owner.name." });
  }

  const entry = asRecord(plugin);
  if (entry?.source !== ".") {
    failures.push({ path: relPath, message: "Cursor marketplace source must be \".\"." });
  }
}

function collectCodexMarketplaceEntryFailures(
  plugin: unknown,
  relPath: string,
  failures: ValidationFailure[],
): void {
  const entry = asRecord(plugin);
  const source = asRecord(entry?.source);
  if (source?.source !== "local" || source.path !== "./") {
    failures.push({ path: relPath, message: "Codex marketplace source.path must be \"./\" relative to the repo root." });
  }

  const policy = asRecord(entry?.policy);
  if (typeof policy?.installation !== "string" || typeof policy.authentication !== "string") {
    failures.push({ path: relPath, message: "Codex marketplace entry must include policy.installation and policy.authentication." });
  }

  if (typeof entry?.category !== "string" || entry.category.length === 0) {
    failures.push({ path: relPath, message: "Codex marketplace entry must include category." });
  }
}

function collectForbiddenComponentFailures(
  document: unknown,
  relPath: string,
  failures: ValidationFailure[],
): void {
  for (const value of collectComponentStrings(document)) {
    if (namesInstructionFile(value)) {
      failures.push({
        path: relPath,
        message: `Plugin components must not include ${path.basename(value)}.`,
      });
    }
  }
}

function collectComponentStrings(value: unknown, parentKey?: string): readonly string[] {
  if (typeof value === "string") {
    return parentKey && COMPONENT_KEYS.has(parentKey) ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectComponentStrings(entry, parentKey));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  return Object.entries(record).flatMap(([key, entry]) => collectComponentStrings(entry, key));
}

function collectNamedPathFailures(
  value: unknown,
  expected: string,
  relPath: string,
  field: string,
  failures: ValidationFailure[],
): void {
  if (typeof value !== "string") {
    return;
  }

  if (normalizeRelPath(value) !== normalizeRelPath(expected)) {
    failures.push({
      path: relPath,
      message: `${field} must point at ${expected}.`,
    });
  }
}

function collectGrokAliasFailures(bundle: PluginBundle, failures: ValidationFailure[]): void {
  const { grok, cursor } = bundle.manifests;
  if (grok.manifestPath !== cursor.manifestPath || grok.hooksPath !== cursor.hooksPath) {
    failures.push({
      path: grok.manifestPath,
      message: "Grok must reuse the Cursor plugin files.",
    });
  }
}

async function collectRetiredPathFailures(
  root: string,
  bundle: PluginBundle,
  failures: ValidationFailure[],
): Promise<void> {
  await Promise.all(bundle.retiredPaths.map(async (relPath) => {
    if (await pathExists(path.join(root, relPath))) {
      failures.push({ path: relPath, message: "Retired catalog must be removed." });
    }
  }));
}

async function collectHookScriptReferenceFailures(
  root: string,
  relPath: string,
  scriptName: string,
  failures: ValidationFailure[],
): Promise<void> {
  const absPath = path.join(root, relPath);
  if (!(await pathExists(absPath))) {
    return;
  }

  const text = await readText(absPath);
  if (!text.includes(scriptName)) {
    failures.push({ path: relPath, message: `Hook config must name ${scriptName}.` });
  }
}

async function collectMissingPathFailures(
  root: string,
  relPath: string,
  message: string,
  failures: ValidationFailure[],
): Promise<void> {
  if (!(await pathExists(path.join(root, relPath)))) {
    failures.push({ path: relPath, message });
  }
}

async function collectJsonDocumentFailures(
  root: string,
  relPath: string,
  inspect: (document: unknown, relPath: string) => void,
  failures: ValidationFailure[],
): Promise<void> {
  const absPath = path.join(root, relPath);
  if (!(await pathExists(absPath))) {
    failures.push({ path: relPath, message: "Required JSON file is missing." });
    return;
  }

  try {
    inspect(JSON.parse(await readText(absPath)), relPath);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    failures.push({ path: relPath, message: `JSON did not parse. ${detail}` });
  }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function normalizeRelPath(value: string): string {
  return value.replace(/^\.\//, "").replace(/\/$/, "");
}
