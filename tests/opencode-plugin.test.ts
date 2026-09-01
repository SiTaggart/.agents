import { expect, test } from "bun:test";
import plugin from "../src/opencode-plugin";
import { PLUGIN_ID } from "../src/plugin-bundle";

test("OpenCode package export is hooks-only agent-kit", () => {
  expect(plugin.id).toBe(PLUGIN_ID);
  expect(typeof plugin.setup).toBe("function");
});

test("OpenCode hook blocks a destructive bash command", async () => {
  let handler: ((input: unknown, event: { tool?: string; args?: { command?: string } }) => Promise<void>) | undefined;
  plugin.setup({
    tool: {
      hook(_event, next) {
        handler = next;
      },
    },
  });

  expect(handler).toBeDefined();
  await expect(handler?.({}, { tool: "bash", args: { command: "rm -rf build" } })).rejects.toThrow("Blocked:");
});

test("OpenCode hook allows a safe bash command", async () => {
  let handler: ((input: unknown, event: { tool?: string; args?: { command?: string } }) => Promise<void>) | undefined;
  plugin.setup({
    tool: {
      hook(_event, next) {
        handler = next;
      },
    },
  });

  await expect(handler?.({}, { tool: "bash", args: { command: "git status" } })).resolves.toBeUndefined();
});
