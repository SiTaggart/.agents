import { homedir } from "os";
import type { Stats } from "fs";
import { lstat, readdir, rm } from "fs/promises";
import path from "path";
import { replaceSymlink, validateLinkSource } from "../fs";
import type { LinkMapping, LinkTargetOptions } from "../types";

export async function linkTarget(options: LinkTargetOptions): Promise<void> {
  const mappings = resolveLinkMappings(options);
  await Promise.all(mappings.map((mapping) => validateLinkSource(mapping)));
  await Promise.all(mappings.map((mapping) => validateLinkTarget(mapping)));
  await migrateLegacyLinkTargets(mappings);
  await Promise.all(mappings.map((mapping) => replaceSymlink(mapping)));
}

export function resolveLinkMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  if (options.target === "opencode") {
    return resolveOpenCodeMappings(options);
  }

  if (options.target === "codex") {
    return resolveCodexMappings(options);
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
    { name: "opencode-commands", source: path.join(generated, "commands"), target: path.join(targetRoot, "commands"), kind: "dir" },
    { name: "opencode-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "opencode-agents-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "AGENTS.md"), kind: "file" },
  ];
}

function resolveCodexMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  const scope = options.scope ?? "global";
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "codex");
  const targetRoot = scope === "global"
    ? path.join(resolveHome(options.homeDir), ".codex")
    : path.join(resolveProjectRoot(options), ".codex");

  return [
    { name: "codex-agents", source: path.join(generated, "agents"), target: path.join(targetRoot, "agents", "dotagents"), kind: "dir" },
    { name: "codex-prompts", source: path.join(generated, "prompts"), target: path.join(targetRoot, "prompts"), kind: "dir" },
    { name: "codex-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "codex-agents-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "AGENTS.md"), kind: "file" },
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
    { name: "claude-commands", source: path.join(generated, "commands"), target: path.join(targetRoot, "commands"), kind: "dir" },
    { name: "claude-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "claude-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "CLAUDE.md"), kind: "file" },
  ];
}

function resolveHome(homeDir?: string): string {
  return path.resolve(homeDir ?? homedir());
}

function resolveProjectRoot(options: LinkTargetOptions): string {
  return path.resolve(options.projectRoot ?? options.root);
}

async function migrateLegacyLinkTargets(mappings: readonly LinkMapping[]): Promise<void> {
  await Promise.all(mappings.map(async (mapping) => {
    if (mapping.name !== "codex-skills") {
      return;
    }

    await removeLegacyCodexSkillsDirectory(mapping.target);
  }));
}

async function validateLinkTarget(mapping: LinkMapping): Promise<void> {
  const existing = await lstatSafe(mapping.target);
  if (!existing || existing.isSymbolicLink()) {
    return;
  }

  if (mapping.name === "codex-skills" && await isMigratableCodexSkillsDirectory(mapping.target)) {
    return;
  }

  throw new Error(`Refusing to replace non-symlink target: ${mapping.target}`);
}

async function removeLegacyCodexSkillsDirectory(skillsDir: string): Promise<void> {
  if (!await isMigratableCodexSkillsDirectory(skillsDir)) {
    return;
  }

  await rm(skillsDir, { recursive: true, force: true });
}

async function isMigratableCodexSkillsDirectory(skillsDir: string): Promise<boolean> {
  const existing = await lstatSafe(skillsDir);
  if (!existing?.isDirectory()) {
    return false;
  }

  const entries = (await readdir(skillsDir)).filter((entry) => entry !== ".DS_Store");
  if (entries.length === 0) {
    return true;
  }

  if (entries.length !== 1 || entries[0] !== "dotagents") {
    return false;
  }

  const legacyLink = await lstatSafe(path.join(skillsDir, "dotagents"));
  return legacyLink?.isSymbolicLink() ?? false;
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
