import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PLUGIN_ID } from "./plugin-bundle";

const HOOK_SCRIPT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "hooks",
  "scripts",
  "prevent-main-commit.sh",
);

interface OpenCodeToolEvent {
  tool?: unknown;
  args?: { command?: unknown };
  input?: { command?: unknown };
}

interface OpenCodePluginContext {
  tool: {
    hook: (
      event: "execute.before",
      handler: (input: unknown, event: OpenCodeToolEvent) => Promise<void>,
    ) => void;
  };
}

const plugin = {
  id: PLUGIN_ID,
  setup(ctx: OpenCodePluginContext): void {
    ctx.tool.hook("execute.before", async (input, event) => {
      const command = readShellCommand(input, event);
      if (!command) {
        return;
      }

      assertHookAllowsCommand(command);
    });
  },
};

export default plugin;

function readShellCommand(input: unknown, event: OpenCodeToolEvent): string | undefined {
  const toolName = readToolName(input, event);
  if (toolName !== "bash" && toolName !== "shell") {
    return undefined;
  }

  const command = event.args?.command ?? event.input?.command ?? readInputCommand(input);
  return typeof command === "string" && command.length > 0 ? command : undefined;
}

function readToolName(input: unknown, event: OpenCodeToolEvent): string | undefined {
  if (typeof event.tool === "string") {
    return event.tool;
  }

  if (typeof input === "object" && input !== null && "tool" in input && typeof input.tool === "string") {
    return input.tool;
  }

  return undefined;
}

function readInputCommand(input: unknown): unknown {
  if (typeof input !== "object" || input === null || !("args" in input)) {
    return undefined;
  }

  const args = input.args;
  return typeof args === "object" && args !== null && "command" in args ? args.command : undefined;
}

function assertHookAllowsCommand(command: string): void {
  const result = spawnSync("/bin/bash", [HOOK_SCRIPT], {
    input: JSON.stringify({
      hook_event_name: "PreToolUse",
      tool_name: "bash",
      tool_input: { command },
      command,
    }),
    encoding: "utf8",
  });

  const hookFailure = result.stderr?.trim() || result.error?.message || "agent-kit hook failed";
  if (result.error) {
    throw new Error(hookFailure);
  }

  if (result.signal) {
    throw new Error(`${hookFailure}: terminated by ${result.signal}`);
  }

  if (result.status === 2) {
    throw new Error(result.stderr?.trim() || "Blocked by agent-kit hook");
  }

  if (result.status !== 0) {
    throw new Error(hookFailure);
  }
}
