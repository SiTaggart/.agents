import { homedir } from "os";
import type { Stats } from "fs";
import { lstat, readdir, readlink, rm, rmdir, unlink } from "fs/promises";
import path from "path";
import { replaceSymlink, validateLinkSource } from "../fs";
import type { LinkMapping, LinkTargetOptions } from "../types";

export async function linkTarget(options: LinkTargetOptions): Promise<void> {
  const mappings = resolveLinkMappings(options);
  await Promise.all(mappings.map((mapping) => validateLinkSource(mapping)));
  await Promise.all(mappings.map((mapping) => validateLinkTarget(mapping)));
  if (options.target === "codex") {
    await removeManagedCodexLinks(options);
    return;
  }
  await Promise.all(mappings.map((mapping) => replaceSymlink(mapping)));
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
    { name: "opencode-commands", source: path.join(generated, "commands"), target: path.join(targetRoot, "commands"), kind: "dir" },
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
    removeManagedSymlink(path.join(targetRoot, "prompts"), [path.join(generated, "prompts")]),
    removeManagedSymlink(path.join(targetRoot, "skills"), [
      path.join(generated, "skills"),
      path.join(root, "skills"),
    ]),
    removeManagedSymlink(path.join(root, "skills", "dotagents"), [path.join(generated, "skills")]),
    removeManagedSymlink(path.join(targetRoot, "agents", "dotagents"), [path.join(generated, "agents")]),
    removeLegacyCodexSkillsDirectory(path.join(targetRoot, "skills"), [
      path.join(generated, "skills"),
      path.join(root, "skills"),
    ]),
  ]);

  await removeEmptyDirectory(path.join(targetRoot, "agents"));
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
