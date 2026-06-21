import { homedir } from "os";
import type { Stats } from "fs";
import { lstat, mkdir, readFile, readdir, readlink, rm, rmdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { replaceSymlink, validateLinkSource } from "../fs";
import type { LinkMapping, LinkTargetOptions } from "../types";

export async function linkTarget(options: LinkTargetOptions): Promise<void> {
  if (options.target === "codex") {
    await linkCodexTarget(options);
    return;
  }

  const mappings = resolveLinkMappings(options);
  await Promise.all(mappings.map((mapping) => validateLinkSource(mapping)));
  await Promise.all(mappings.map((mapping) => validateLinkTarget(mapping)));
  await removeObsoleteManagedLinks(options);
  await Promise.all(mappings.map((mapping) => replaceSymlink(mapping)));
  await configureHookTarget(options);
}

export function resolveLinkMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  if (options.target === "opencode") {
    return resolveOpenCodeMappings(options);
  }

  if (options.target === "codex") {
    return [];
  }

  return resolveClaudeMappings(options);
}

function resolveOpenCodeMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  const scope = options.scope ?? "global";
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "opencode");
  const targetRoot = scope === "global"
    ? path.join(resolveHome(options.homeDir), ".config", "opencode")
    : path.join(resolveProjectRoot(options), ".opencode");

  return [
    { name: "opencode-agents", source: path.join(generated, "agents"), target: path.join(targetRoot, "agents"), kind: "dir" },
    { name: "opencode-hooks", source: path.join(generated, "hooks"), target: path.join(targetRoot, "hooks"), kind: "dir" },
    { name: "opencode-dotagents-hooks", source: path.join(generated, "plugins", "dotagents-hooks.js"), target: path.join(targetRoot, "plugins", "dotagents-hooks.js"), kind: "file" },
    { name: "opencode-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "opencode-agents-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "AGENTS.md"), kind: "file" },
  ];
}

function resolveClaudeMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  const scope = options.scope ?? "global";
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "claude");
  const targetRoot = scope === "global"
    ? path.join(resolveHome(options.homeDir), ".claude")
    : path.join(resolveProjectRoot(options), ".claude");

  return [
    { name: "claude-agents", source: path.join(generated, "agents"), target: path.join(targetRoot, "agents"), kind: "dir" },
    { name: "claude-hooks", source: path.join(generated, "hooks"), target: path.join(targetRoot, "hooks", "dotagents"), kind: "dir" },
    { name: "claude-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "claude-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "CLAUDE.md"), kind: "file" },
  ];
}

async function linkCodexTarget(options: LinkTargetOptions): Promise<void> {
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "codex");
  const targetRoot = (options.scope ?? "global") === "global"
    ? path.join(resolveHome(options.homeDir), ".codex")
    : path.join(resolveProjectRoot(options), ".codex");
  await preflightCodexGeneratedSources(generated, targetRoot);

  const agentMappings = await resolveCodexAgentMappings(generated, targetRoot);
  const mappings: readonly LinkMapping[] = [
    ...agentMappings,
    { name: "codex-hooks", source: path.join(generated, "hooks"), target: path.join(targetRoot, "hooks", "dotagents"), kind: "dir" },
  ];

  await Promise.all(mappings.map((mapping) => validateLinkSource(mapping)));
  await Promise.all(mappings.map((mapping) => validateLinkTarget(mapping)));
  await removeManagedCodexLinks(options);
  await Promise.all(mappings.map((mapping) => replaceSymlink(mapping)));
  await configureHookTarget(options);
}

async function preflightCodexGeneratedSources(generated: string, targetRoot: string): Promise<void> {
  await Promise.all([
    validateLinkSource({
      source: path.join(generated, "agents"),
      target: path.join(targetRoot, "agents"),
      kind: "dir",
    }),
    validateLinkSource({
      source: path.join(generated, "hooks"),
      target: path.join(targetRoot, "hooks", "dotagents"),
      kind: "dir",
    }),
    validateLinkSource({
      source: path.join(generated, "hooks", "prevent-main-commit.sh"),
      target: path.join(targetRoot, "hooks", "dotagents", "prevent-main-commit.sh"),
      kind: "file",
    }),
  ]);
}

async function resolveCodexAgentMappings(generated: string, targetRoot: string): Promise<readonly LinkMapping[]> {
  const agentsDir = path.join(generated, "agents");
  const entries = await readDirNamesSafe(agentsDir);
  return entries
    .filter((entry) => entry.endsWith(".toml"))
    .map((entry) => ({
      name: `codex-agent-${entry}`,
      source: path.join(agentsDir, entry),
      target: path.join(targetRoot, "agents", entry),
      kind: "file" as const,
    }));
}

function resolveHome(homeDir?: string): string {
  return path.resolve(homeDir ?? homedir());
}

function resolveProjectRoot(options: LinkTargetOptions): string {
  return path.resolve(options.projectRoot ?? options.root);
}

async function validateLinkTarget(mapping: LinkMapping): Promise<void> {
  const existing = await lstatSafe(mapping.target);
  if (!existing || existing.isSymbolicLink()) {
    return;
  }

  throw new Error(`Refusing to replace non-symlink target: ${mapping.target}`);
}

async function removeManagedCodexLinks(options: LinkTargetOptions): Promise<void> {
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "codex");
  const targetRoot = (options.scope ?? "global") === "global"
    ? path.join(resolveHome(options.homeDir), ".codex")
    : path.join(resolveProjectRoot(options), ".codex");

  await Promise.all([
    removeManagedSymlink(path.join(targetRoot, "AGENTS.md"), [path.join(root, "AGENTS.md")]),
    removeManagedSymlink(path.join(targetRoot, "commands"), [
      path.join(generated, "commands"),
      path.join(root, "commands"),
    ]),
    removeManagedSymlink(path.join(targetRoot, "prompts"), [path.join(generated, "prompts")]),
    removeManagedSymlink(path.join(targetRoot, "rules"), [
      path.join(generated, "rules"),
      path.join(root, "rules"),
    ]),
    removeManagedSymlink(path.join(targetRoot, "skills"), [
      path.join(generated, "skills"),
      path.join(root, "skills"),
    ]),
    removeManagedSymlink(path.join(root, "skills", "dotagents"), [path.join(generated, "skills")]),
    removeManagedSymlink(path.join(targetRoot, "agents", "dotagents"), [path.join(generated, "agents")]),
    removeManagedCodexAgentLinks(path.join(targetRoot, "agents"), path.join(generated, "agents")),
    removeLegacyCodexSkillsDirectory(path.join(targetRoot, "skills"), [
      path.join(generated, "skills"),
      path.join(root, "skills"),
    ]),
  ]);

  await removeEmptyDirectory(path.join(targetRoot, "agents"));
}

async function removeObsoleteManagedLinks(options: LinkTargetOptions): Promise<void> {
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", options.target);
  const targetRoot = options.target === "opencode"
    ? resolveOpenCodeRoot(options)
    : resolveClaudeRoot(options);

  await Promise.all([
    removeManagedSymlink(path.join(targetRoot, "commands"), [
      path.join(generated, "commands"),
      path.join(root, "commands"),
    ]),
    removeManagedSymlink(path.join(targetRoot, "hooks"), [
      path.join(generated, "hooks"),
      path.join(root, "hooks"),
    ]),
    removeManagedSymlink(path.join(targetRoot, "rules"), [
      path.join(generated, "rules"),
      path.join(root, "rules"),
    ]),
  ]);
}

async function configureHookTarget(options: LinkTargetOptions): Promise<void> {
  if (options.target === "claude") {
    await configureClaudeHook(options);
    return;
  }

  if (options.target === "codex") {
    await configureCodexHook(options);
  }
}

async function configureClaudeHook(options: LinkTargetOptions): Promise<void> {
  const targetRoot = resolveClaudeRoot(options);
  const settingsPath = path.join(targetRoot, "settings.json");
  const command = `bash ${JSON.stringify(path.join(targetRoot, "hooks", "dotagents", "prevent-main-commit.sh"))}`;
  const legacyCommand = `bash ${JSON.stringify(path.join(targetRoot, "hooks", "prevent-main-commit.sh"))}`;
  const settings = await readJsonObject(settingsPath);
  const hooks = readObject(settings, "hooks");
  const preToolUse = readArray(hooks, "PreToolUse");
  hooks.PreToolUse = appendCommandHook(removeCommandHooks(preToolUse, [legacyCommand]), {
    matcher: "Bash",
    hooks: [{ type: "command", command }],
  });
  settings.hooks = hooks;
  await writeJson(settingsPath, settings);
}

async function configureCodexHook(options: LinkTargetOptions): Promise<void> {
  const targetRoot = (options.scope ?? "global") === "global"
    ? path.join(resolveHome(options.homeDir), ".codex")
    : path.join(resolveProjectRoot(options), ".codex");
  const hooksPath = path.join(targetRoot, "hooks.json");
  const command = `bash ${JSON.stringify(path.join(targetRoot, "hooks", "dotagents", "prevent-main-commit.sh"))}`;
  const config = await readJsonObject(hooksPath);
  const hooks = readObject(config, "hooks");
  const preToolUse = readArray(hooks, "PreToolUse");
  hooks.PreToolUse = appendCommandHook(preToolUse, {
    matcher: "Bash",
    hooks: [
      {
        type: "command",
        command,
        statusMessage: "Checking git branch policy",
      },
    ],
  });
  config.hooks = hooks;
  await writeJson(hooksPath, config);
}

function resolveOpenCodeRoot(options: LinkTargetOptions): string {
  return (options.scope ?? "global") === "global"
    ? path.join(resolveHome(options.homeDir), ".config", "opencode")
    : path.join(resolveProjectRoot(options), ".opencode");
}

function resolveClaudeRoot(options: LinkTargetOptions): string {
  return (options.scope ?? "global") === "global"
    ? path.join(resolveHome(options.homeDir), ".claude")
    : path.join(resolveProjectRoot(options), ".claude");
}

interface CommandHookGroup {
  matcher?: string;
  hooks: readonly CommandHook[];
}

interface CommandHook {
  type: "command";
  command: string;
  statusMessage?: string;
}

type JsonRecord = Record<string, unknown>;

function appendCommandHook(existing: readonly unknown[], group: CommandHookGroup): readonly unknown[] {
  return existing.some((entry) => commandHookGroupHasCommand(entry, group.hooks[0]?.command ?? ""))
    ? existing
    : [...existing, group];
}

function removeCommandHooks(existing: readonly unknown[], commands: readonly string[]): readonly unknown[] {
  return existing.flatMap((entry) => {
    if (!isRecord(entry) || !Array.isArray(entry.hooks)) {
      return [entry];
    }

    const hooks = entry.hooks.filter((hook) => !isRecord(hook) || !commands.includes(readCommand(hook)));
    return hooks.length > 0 ? [{ ...entry, hooks }] : [];
  });
}

function commandHookGroupHasCommand(value: unknown, command: string): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const hooks = value.hooks;
  return Array.isArray(hooks) && hooks.some((hook) => isRecord(hook) && hook.command === command);
}

function readCommand(value: JsonRecord): string {
  return typeof value.command === "string" ? value.command : "";
}

async function readJsonObject(filePath: string): Promise<JsonRecord> {
  try {
    const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"));
    return isRecord(parsed) ? parsed : {};
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeJson(filePath: string, data: JsonRecord): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readObject(record: JsonRecord, key: string): JsonRecord {
  const value = record[key];
  return isRecord(value) ? value : {};
}

function readArray(record: JsonRecord, key: string): readonly unknown[] {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function removeManagedCodexAgentLinks(agentsDir: string, generatedAgentsDir: string): Promise<void> {
  const entries = await readDirNamesSafe(agentsDir);
  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.endsWith(".toml")) {
        return;
      }

      await removeManagedSymlink(path.join(agentsDir, entry), [path.join(generatedAgentsDir, entry)]);
    }),
  );
}

async function removeLegacyCodexSkillsDirectory(
  skillsDir: string,
  managedTargets: readonly string[],
): Promise<void> {
  const existing = await lstatSafe(skillsDir);
  if (!existing?.isDirectory()) {
    return;
  }

  const legacyLink = path.join(skillsDir, "dotagents");
  if (!await removeManagedSymlink(legacyLink, managedTargets)) {
    return;
  }

  await removeEmptyDirectory(skillsDir);
}

async function removeManagedSymlink(linkPath: string, managedTargets: readonly string[]): Promise<boolean> {
  const existing = await lstatSafe(linkPath);
  if (!existing?.isSymbolicLink()) {
    return false;
  }

  const target = await resolveSymlink(linkPath);
  if (!target || !managedTargets.some((managedTarget) => target === path.resolve(managedTarget))) {
    return false;
  }

  await unlink(linkPath);
  return true;
}

async function removeEmptyDirectory(dir: string): Promise<void> {
  const existing = await lstatSafe(dir);
  if (!existing?.isDirectory()) {
    return;
  }

  const entries = await readdir(dir);
  const removableEntries = entries.filter((entry) => entry === ".DS_Store");
  const retainedEntries = entries.filter((entry) => entry !== ".DS_Store");
  if (retainedEntries.length > 0) {
    return;
  }

  await Promise.all(removableEntries.map((entry) => rm(path.join(dir, entry), { force: true })));
  await rmdir(dir);
}

async function readDirNamesSafe(dir: string): Promise<readonly string[]> {
  try {
    return await readdir(dir);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function resolveSymlink(linkPath: string): Promise<string | null> {
  try {
    const target = await readlink(linkPath);
    return path.resolve(path.dirname(linkPath), target);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function lstatSafe(filePath: string): Promise<Stats | null> {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}
