import { expect, test } from "bun:test";
import { parseCliArgs } from "../src/cli";

test("rejects typoed CLI commands instead of silently showing help", () => {
  expect(() => parseCliArgs(["sycn"])).toThrow("Unknown command: sycn");
});

test("rejects retired sync and link commands", () => {
  expect(() => parseCliArgs(["sync", "opencode"])).toThrow("Unknown command: sync");
  expect(() => parseCliArgs(["link", "claude"])).toThrow("Unknown command: link");
});

test("honors --root for validate", () => {
  const parsed = parseCliArgs(["validate", "--root", "/tmp/agents"]);

  expect(parsed.command).toBe("validate");
  expect(parsed.root).toBe("/tmp/agents");
});

test("rejects Claude as a render target", () => {
  expect(() => parseCliArgs(["render", "claude"])).toThrow("Only the opencode render target remains");
});

test("accepts render opencode", () => {
  const parsed = parseCliArgs(["render", "opencode", "--root", "/tmp/agents"]);

  expect(parsed.command).toBe("render");
  expect(parsed.root).toBe("/tmp/agents");
});
