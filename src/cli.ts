#!/usr/bin/env bun
import path from "path";
import { renderOpenCode } from "./render/opencode";
import { validatePluginBundle } from "./validate";

type CliCommand = "validate" | "render" | "help";

interface CliOptions {
  command: CliCommand;
  root: string;
}

const COMMANDS: readonly CliCommand[] = ["validate", "render", "help"];
const VALUE_FLAGS: ReadonlySet<string> = new Set(["--root"]);

async function main(): Promise<void> {
  const options = parseCliArgs(process.argv.slice(2));
  if (options.command === "help") {
    printHelp();
    return;
  }

  if (options.command === "validate") {
    const report = await validatePluginBundle(options.root);
    if (!report.ok) {
      for (const failure of report.failures) {
        console.error(`${failure.path}: ${failure.message}`);
      }
      process.exitCode = 1;
      return;
    }

    console.log("agent-kit plugin bundle is valid");
    return;
  }

  await renderOpenCode(options.root);
  console.log(`Rendered OpenCode skills for ${options.root}`);
}

export function parseCliArgs(args: readonly string[]): CliOptions {
  const command = parseCommand(args[0]);
  const tail = args.slice(1);
  rejectRetiredRenderTarget(command, tail);

  return {
    command,
    root: path.resolve(getFlagValue(tail, "--root") ?? process.cwd()),
  };
}

function parseCommand(value: string | undefined): CliCommand {
  if (!value) {
    return "help";
  }

  if (isCommand(value)) {
    return value;
  }

  throw new Error(`Unknown command: ${value}`);
}

function rejectRetiredRenderTarget(command: CliCommand, args: readonly string[]): void {
  if (command !== "render") {
    return;
  }

  const target = getFlagValue(args, "--target") ?? findPositionalValue(args);
  if (target && target !== "opencode") {
    throw new Error("Only the opencode render target remains. Claude, Cursor, Codex, and Grok consume skills/ as-is.");
  }
}

function getFlagValue(args: readonly string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function findPositionalValue(args: readonly string[]): string | undefined {
  return args.reduce<{ skip: boolean; value?: string }>(
    (state, arg) => {
      if (state.skip) {
        return { ...state, skip: false };
      }
      if (state.value) {
        return state;
      }
      if (VALUE_FLAGS.has(arg) || arg === "--target") {
        return { skip: true };
      }
      return arg.startsWith("--") ? state : { skip: false, value: arg };
    },
    { skip: false },
  ).value;
}

function isCommand(value: string): value is CliCommand {
  return COMMANDS.some((command) => command === value);
}

function printHelp(): void {
  console.log([
    "Usage: bun src/cli.ts <validate|render> [opencode] [options]",
    "",
    "Options:",
    "  --root <path>   Plugin repo root (defaults to cwd)",
    "",
    "validate   Check manifests, skills/, and hook files.",
    "render     Write OpenCode skill files to .generated/opencode/skills.",
  ].join("\n"));
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  });
}
