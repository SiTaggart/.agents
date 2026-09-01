import { expect, test } from "bun:test";
import path from "path";
import { PLUGIN_BUNDLE } from "../src/plugin-bundle";
import { namesInstructionFile, validatePluginBundle } from "../src/validate";

const repoRoot = path.resolve(import.meta.dir, "..");

test("plugin bundle validator accepts this repo", async () => {
  const report = await validatePluginBundle(repoRoot);

  expect(report.failures).toEqual([]);
  expect(report.ok).toBe(true);
});

test("Grok reuses the Cursor plugin files", () => {
  expect(PLUGIN_BUNDLE.manifests.grok.manifestPath).toBe(PLUGIN_BUNDLE.manifests.cursor.manifestPath);
  expect(PLUGIN_BUNDLE.manifests.grok.hooksPath).toBe(PLUGIN_BUNDLE.manifests.cursor.hooksPath);
  expect(PLUGIN_BUNDLE.manifests.grok.kind).toBe("cursor-plugin");
});

test("retired mattpocock catalog is gone", async () => {
  expect(await Bun.file(path.join(repoRoot, "plugins", "marketplace.json")).exists()).toBe(false);
});

test("AGENTS.md is not a plugin component path", () => {
  expect(namesInstructionFile("AGENTS.md")).toBe(true);
  expect(namesInstructionFile("./AGENTS.md")).toBe(true);
  expect(namesInstructionFile("CLAUDE.md")).toBe(true);
  expect(namesInstructionFile("./skills/")).toBe(false);
});
