import { expect, test } from "bun:test";
import path from "path";
import { PLUGIN_BUNDLE } from "../src/plugin-bundle";
import { inspectPluginManifest, namesInstructionFile, validatePluginBundle } from "../src/validate";

const repoRoot = path.resolve(import.meta.dir, "..");
const claudeAdapter = PLUGIN_BUNDLE.manifests.claude;

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

test("third-party skill provenance files are gone", async () => {
  expect(await Bun.file(path.join(repoRoot, "skills-lock.json")).exists()).toBe(false);
  expect(await Bun.file(path.join(repoRoot, ".skill-lock.json")).exists()).toBe(false);
});

test("AGENTS.md is not a plugin component path", () => {
  expect(namesInstructionFile("AGENTS.md")).toBe(true);
  expect(namesInstructionFile("./AGENTS.md")).toBe(true);
  expect(namesInstructionFile("CLAUDE.md")).toBe(true);
  expect(namesInstructionFile("./skills/")).toBe(false);
});

test("validator fails when a manifest omits skills", () => {
  const failures = inspectPluginManifest(
    {
      name: "agent-kit",
      hooks: "./hooks/hooks.json",
    },
    claudeAdapter,
    ".claude-plugin/plugin.json",
  );

  expect(failures.some((failure) => failure.message.includes("skills"))).toBe(true);
});

test("validator fails when a manifest omits hooks", () => {
  const failures = inspectPluginManifest(
    {
      name: "agent-kit",
      skills: "./skills/",
    },
    claudeAdapter,
    ".claude-plugin/plugin.json",
  );

  expect(failures.some((failure) => failure.message.includes("hooks"))).toBe(true);
});

test("validator reports AGENTS.md when it is listed as a component", () => {
  const failures = inspectPluginManifest(
    {
      name: "agent-kit",
      skills: "./AGENTS.md",
      hooks: "./hooks/hooks.json",
    },
    claudeAdapter,
    ".claude-plugin/plugin.json",
  );

  expect(failures.some((failure) => /AGENTS\.md/i.test(failure.message))).toBe(true);
});
