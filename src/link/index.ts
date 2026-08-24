import { homedir } from "os";
import { readlink, rm } from "fs/promises";
import path from "path";
import { replaceSymlink, statSafe, validateLinkSource, writeText } from "../fs";
import type { LinkMapping, LinkTargetOptions } from "../types";

export async function linkTarget(options: LinkTargetOptions): Promise<void> {
  const mappings = resolveLinkMappings(options);
  await Promise.all(mappings.map(validateLinkSource));
  await removeObsoletePaths(options);
  await Promise.all(mappings.map((mapping) => replaceSymlink(mapping)));
  await configureHook(options);
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
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "opencode");
  const targetRoot = resolveTargetRoot(options);

  return [
    { name: "opencode-hooks", source: path.join(generated, "hooks"), target: path.join(targetRoot, "hooks"), kind: "dir" },
    { name: "opencode-dotagents-hooks", source: path.join(generated, "plugins", "dotagents-hooks.js"), target: path.join(targetRoot, "plugins", "dotagents-hooks.js"), kind: "file" },
    { name: "opencode-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "opencode-agents-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "AGENTS.md"), kind: "file" },
  ];
}

function resolveClaudeMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "claude");
  const targetRoot = resolveTargetRoot(options);

  return [
    { name: "claude-hooks", source: path.join(generated, "hooks"), target: path.join(targetRoot, "hooks"), kind: "dir" },
    { name: "claude-skills", source: path.join(generated, "skills"), target: path.join(targetRoot, "skills"), kind: "dir" },
    { name: "claude-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "CLAUDE.md"), kind: "file" },
  ];
}

function resolveCodexMappings(options: LinkTargetOptions): readonly LinkMapping[] {
  const root = path.resolve(options.root);
  const generated = path.join(root, ".generated", "codex");
  const targetRoot = resolveTargetRoot(options);

  return [
    { name: "codex-hooks", source: path.join(generated, "hooks"), target: path.join(targetRoot, "hooks"), kind: "dir" },
    { name: "codex-agents-md", source: path.join(root, "AGENTS.md"), target: path.join(targetRoot, "AGENTS.md"), kind: "file" },
  ];
}

async function removeObsoletePaths(options: LinkTargetOptions): Promise<void> {
  const targetRoot = resolveTargetRoot(options);
  const paths = [
    path.join(targetRoot, "commands"),
    path.join(targetRoot, "rules"),
  ];

  if (options.target === "codex") {
    paths.push(
      path.join(targetRoot, "prompts"),
      path.join(path.resolve(options.root), "skills", "dotagents"),
    );
  }

  await Promise.all([
    ...paths.map((targetPath) => rm(targetPath, { recursive: true, force: true })),
    removeManagedAgentsLink(options, targetRoot),
  ]);
}

// The agents path can hold user-authored agents the harness itself writes.
// A plain directory is the expected steady state: leave it silently. Remove a
// symlink only when its destination is inside this repo's .generated tree or
// no longer exists (dangling links from a retired or moved checkout).
async function removeManagedAgentsLink(options: LinkTargetOptions, targetRoot: string): Promise<void> {
  const agentsPath = path.join(targetRoot, "agents");
  const stats = await statSafe(agentsPath);
  if (!stats || !stats.isSymbolicLink()) {
    return;
  }

  const generatedRoot = path.join(path.resolve(options.root), ".generated") + path.sep;
  const destination = path.resolve(path.dirname(agentsPath), await readlink(agentsPath));
  const managed = destination.startsWith(generatedRoot);
  const dangling = (await statSafe(destination)) === null;
  if (!managed && !dangling) {
    console.warn(`Left ${agentsPath} in place: links outside this repo's .generated tree.`);
    return;
  }

  await rm(agentsPath, { force: true });
}

async function configureHook(options: LinkTargetOptions): Promise<void> {
  if (options.target === "claude") {
    await writeText(path.join(resolveTargetRoot(options), "settings.json"), `${JSON.stringify(claudeHookConfig(options), null, 2)}\n`);
    return;
  }

  if (options.target === "codex") {
    await writeText(path.join(resolveTargetRoot(options), "hooks.json"), `${JSON.stringify(codexHookConfig(options), null, 2)}\n`);
  }
}

function claudeHookConfig(options: LinkTargetOptions): object {
  return {
    hooks: {
      PreToolUse: [{
        matcher: "Bash",
        hooks: [{ type: "command", command: hookCommand(options) }],
      }],
    },
  };
}

function codexHookConfig(options: LinkTargetOptions): object {
  return {
    hooks: {
      PreToolUse: [{
        matcher: "Bash",
        hooks: [{
          type: "command",
          command: hookCommand(options),
          statusMessage: "Checking git branch policy",
        }],
      }],
    },
  };
}

function hookCommand(options: LinkTargetOptions): string {
  return `bash ${JSON.stringify(path.join(resolveTargetRoot(options), "hooks", "prevent-main-commit.sh"))}`;
}

function resolveTargetRoot(options: LinkTargetOptions): string {
  if (options.target === "opencode") {
    return (options.scope ?? "global") === "global"
      ? path.join(resolveHome(options.homeDir), ".config", "opencode")
      : path.join(resolveProjectRoot(options), ".opencode");
  }

  if (options.target === "codex") {
    return (options.scope ?? "global") === "global"
      ? path.join(resolveHome(options.homeDir), ".codex")
      : path.join(resolveProjectRoot(options), ".codex");
  }

  return (options.scope ?? "global") === "global"
    ? path.join(resolveHome(options.homeDir), ".claude")
    : path.join(resolveProjectRoot(options), ".claude");
}

function resolveHome(homeDir?: string): string {
  return path.resolve(homeDir ?? homedir());
}

function resolveProjectRoot(options: LinkTargetOptions): string {
  return path.resolve(options.projectRoot ?? options.root);
}
