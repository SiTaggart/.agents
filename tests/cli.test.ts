import { expect, test } from "bun:test";
import { parseCliArgs } from "../src/cli";

test("rejects typoed CLI commands instead of silently showing help", () => {
  expect(() => parseCliArgs(["sycn", "opencode"])).toThrow("Unknown command: sycn");
});
