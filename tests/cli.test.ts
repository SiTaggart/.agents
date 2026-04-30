import { expect, test } from "bun:test";
import { parseCliArgs } from "../src/cli";

test("rejects typoed CLI commands instead of silently showing help", () => {
  expect(() => parseCliArgs(["sycn", "opencode"])).toThrow("Unknown command: sycn");
});

test("honors positional target after options", () => {
  const parsed = parseCliArgs(["sync", "--root", "/tmp/agents", "opencode"]);

  expect(parsed.target).toBe("opencode");
  expect(parsed.root).toBe("/tmp/agents");
});
