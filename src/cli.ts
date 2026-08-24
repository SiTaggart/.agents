#!/usr/bin/env bun
import path from "path";
import { linkTarget } from "./link";
import { RENDER_TARGETS, renderTarget } from "./render";
import type { Scope, Target } from "./types";

type CliCommand = "render" | "format" | "link" | "sync" | "help";
type TargetSelection = Target | "all";

interface CliOptions {
  command: CliCommand;
  target: TargetSelection;
  root: string;
  scope: Scope;
  homeDir?: string;
  projectRoot?: string;
}

const COMMANDS: readonly CliCommand[] = ["render", "format", "link", "sync", "help"];
const VALUE_FLAGS: ReadonlySet<string> = new Set(["--target", "--root", "--scope", "--home", "--project"]);

async function main(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));
  if (options.command === "help") {
    printHelp();
    return;
  }

  const targets = expandTargets(options.target);

  if (options.command === "render" || options.command === "format") {
    await Promise.all(targets.map((target) => renderTarget({ root: options.root, target })));
    printCompleted("Rendered", targets, options.root);
    return;
  }

  if (options.command === "link") {
    await Promise.all(targets.map((target) => linkTarget({ ...options, target })));
    printCompleted("Linked", targets, options.root);
    return;
  }

  await Promise.all(
    targets.map(async (target) => {
      await renderTarget({ root: options.root, target });
      await linkTarget({ ...options, target });
    }),
  );
  printCompleted("Synced", targets, options.root);
}

export function parseCliArgs(args: readonly string[]): CliOptions {
  const command = parseCommand(args[0]);
  const tail = args.slice(1);
  const target = parseTarget(getFlagValue(tail, "--target") ?? findPositionalTarget(tail) ?? "all");

  return {
    command,
    target,
    root: path.resolve(getFlagValue(tail, "--root") ?? process.cwd()),
    scope: parseScope(getFlagValue(tail, "--scope") ?? "global"),
    homeDir: getFlagValue(tail, "--home"),
    projectRoot: getFlagValue(tail, "--project"),
  };
}

function parseCommand(value: string | undefined): CliCommand {
  if (!value) return "help";
  if (isCommand(value)) return value;
  throw new Error(`Unknown command: ${value}`);
}

function parseTarget(value: string): TargetSelection {
  if (value === "all" || isTarget(value)) {
    return value;
  }

  throw new Error(`Unknown target: ${value}`);
}

function parseScope(value: string): Scope {
  if (value === "global" || value === "project") {
    return value;
  }

  throw new Error(`Unknown scope: ${value}`);
}

function expandTargets(target: TargetSelection): readonly Target[] {
  return target === "all" ? RENDER_TARGETS : [target];
}

function getFlagValue(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function findPositionalTarget(args: readonly string[]): string | undefined {
  return args.reduce<{ skip: boolean; target?: string }>(
    (state, arg) => {
      if (state.skip) {
        return { ...state, skip: false };
      }
      if (state.target) {
        return state;
      }
      if (VALUE_FLAGS.has(arg)) {
        return { skip: true };
      }
      return arg.startsWith("--") ? state : { skip: false, target: arg };
    },
    { skip: false },
  ).target;
}

function isTarget(value: string): value is Target {
  return value === "opencode" || value === "codex" || value === "claude";
}

function isCommand(value: string): value is CliCommand {
  return COMMANDS.some((command) => command === value);
}

function printHelp(): void {
  console.log([
    "Usage: bun src/cli.ts <render|format|link|sync> [opencode|codex|claude|all] [options]",
    "",
    "Options:",
    "  --target <target>   Alternative to positional target",
    "  --root <path>       Canonical .agents repo root (defaults to cwd)",
    "  --scope <scope>     global or project (defaults to global)",
    "  --home <path>       Home directory override for global links",
    "  --project <path>    Project root override for project links",
    "",
    "Codex loads .agents skills natively; the codex target syncs AGENTS.md and hooks.",
  ].join("\n"));
}

function printCompleted(action: string, targets: readonly Target[], root: string): void {
  const activeTargets = targets.filter((target) => target !== "codex");
  const lines = activeTargets.length > 0
    ? [`${action} ${activeTargets.join(", ")} for ${root}`]
    : [];

  if (targets.includes("codex")) {
    const surfaces = action === "Rendered" ? "hooks" : "instructions and hooks";
    lines.push(`${action} Codex ${surfaces} for ${root}`);
  }

  console.log(lines.join("\n"));
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}
