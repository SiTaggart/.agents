import { expect, test } from "bun:test";
import { parseCliArgs } from "../src/cli";

test("rejects typoed CLI commands instead of silently showing help", () => {
  expect(() => parseCliArgs(["sycn"])).toThrow("Unknown command: sycn");
});

test("rejects retired sync, link, and render commands", () => {
  expect(() => parseCliArgs(["sync"])).toThrow("Unknown command: sync");
  expect(() => parseCliArgs(["link"])).toThrow("Unknown command: link");
  expect(() => parseCliArgs(["render"])).toThrow("Unknown command: render");
});

test("honors --root for validate", () => {
  const parsed = parseCliArgs(["validate", "--root", "/tmp/agents"]);

  expect(parsed.command).toBe("validate");
  expect(parsed.root).toBe("/tmp/agents");
});
