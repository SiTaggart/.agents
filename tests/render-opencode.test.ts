import { afterEach, expect, test } from "bun:test";
import { lstat } from "fs/promises";
import path from "path";
import { pathExists } from "../src/fs";
import { renderTarget } from "../src/render/index";
import { makeTempRoot, readText, removeTempRoot, writeText } from "./helpers";

const TRANSFORM_FIXTURE_BODY = [
  "Use compound-engineering:ce-review and read ~/.claude/skills/ce-review/references/reviewers/correctness.md.",
  "Keep mode:headless and obsidian daily:read untouched.",
].join("\n");

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map(removeTempRoot));
  tempRoots.length = 0;
});

test("renders skills and the hook plugin into OpenCode-compatible generated files", async () => {
  const root = await makeTempRoot("agents-render-opencode-");
  tempRoots.push(root);

  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");
  await writeText(
    path.join(root, "skills", "review-skill", "SKILL.md"),
    ["---", "name: review-skill", "description: Review via personas", "---", "", TRANSFORM_FIXTURE_BODY].join("\n"),
  );

  await renderTarget({ root, target: "opencode" });

  const skill = await readText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("Use ce-review and read ~/.config/opencode/skills/ce-review/references/reviewers/correctness.md.");
  expect(skill).toContain("Keep mode:headless and obsidian daily:read untouched.");

  const plugin = await readText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"));
  expect(plugin).toContain("tool.execute.before");
  expect(plugin).toContain("prevent-main-commit.sh");
  expect(plugin).toContain("async ({ directory, worktree })");
  expect(plugin).toContain("cwd: hookCwd");
  expect(plugin).toContain("if (result.error)");
  expect(plugin).toContain("if (result.signal)");
  expect(plugin).toContain("if (result.status !== 0)");
  expect(await pathExists(path.join(root, ".generated", "opencode", "commands"))).toBe(false);
  expect(await pathExists(path.join(root, ".generated", "opencode", "agents"))).toBe(false);
});

test("renders Claude skills and hooks in a generated target tree", async () => {
  const root = await makeTempRoot("agents-render-claude-");
  tempRoots.push(root);

  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");
  await writeText(
    path.join(root, "skills", "review-skill", "SKILL.md"),
    ["---", "name: review-skill", "description: Review via personas", "---", "", TRANSFORM_FIXTURE_BODY].join("\n"),
  );

  await renderTarget({ root, target: "claude" });

  const skill = await readText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("description: Review via personas");
  expect(skill).toContain(
    "Use compound-engineering:ce-review and read ~/.claude/skills/ce-review/references/reviewers/correctness.md.",
  );
  expect(await readText(path.join(root, ".generated", "claude", "hooks", "prevent-main-commit.sh"))).toContain(
    "exit 0",
  );
  expect(await pathExists(path.join(root, ".generated", "claude", "agents"))).toBe(false);
});

test("renders Codex hooks in a generated target tree", async () => {
  const root = await makeTempRoot("agents-render-codex-");
  tempRoots.push(root);

  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");

  await renderTarget({ root, target: "codex" });

  expect(await readText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"))).toContain(
    "exit 0",
  );
  expect(await pathExists(path.join(root, ".generated", "codex", "agents"))).toBe(false);
});

test("skips hidden skill directories when rendering target skill shelves", async () => {
  const root = await makeTempRoot("agents-render-hidden-skills-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "skills", "public-skill", "SKILL.md"),
    [
      "---",
      "name: public-skill",
      "description: Public skill",
      "---",
      "",
      "Use this skill.",
    ].join("\n"),
  );
  await writeText(
    path.join(root, "skills", ".system", "hidden-skill", "SKILL.md"),
    [
      "---",
      "name: hidden-skill",
      "description: Hidden skill",
      "---",
      "",
      "Do not render this skill.",
    ].join("\n"),
  );

  await renderTarget({ root, target: "opencode" });

  expect(await Bun.file(path.join(root, ".generated", "opencode", "skills", "public-skill", "SKILL.md")).exists()).toBe(
    true,
  );
  expect(await Bun.file(path.join(root, ".generated", "opencode", "skills", "hidden-skill", "SKILL.md")).exists()).toBe(
    false,
  );
});

test("creates empty generated directories for linkable target sections", async () => {
  const root = await makeTempRoot("agents-render-empty-sections-");
  tempRoots.push(root);

  await renderTarget({ root, target: "opencode" });
  await renderTarget({ root, target: "codex" });
  await renderTarget({ root, target: "claude" });

  expect(await isDirectory(path.join(root, ".generated", "opencode", "hooks"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "plugins"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "skills"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "codex", "hooks"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "hooks"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "skills"))).toBe(true);
});

async function isDirectory(dir: string): Promise<boolean> {
  return (await lstat(dir)).isDirectory();
}
