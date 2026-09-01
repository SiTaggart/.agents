import { afterEach, expect, test } from "bun:test";
import { lstat } from "fs/promises";
import path from "path";
import { pathExists } from "../src/fs";
import { renderOpenCode } from "../src/render/opencode";
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

test("renders OpenCode skills with path and namespace transforms", async () => {
  const root = await makeTempRoot("agents-render-opencode-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "skills", "review-skill", "SKILL.md"),
    ["---", "name: review-skill", "description: Review via personas", "---", "", TRANSFORM_FIXTURE_BODY].join("\n"),
  );

  await renderOpenCode(root);

  const skill = await readText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("Use ce-review and read ~/.config/opencode/skills/ce-review/references/reviewers/correctness.md.");
  expect(skill).toContain("Keep mode:headless and obsidian daily:read untouched.");
  expect(await pathExists(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"))).toBe(false);
  expect(await pathExists(path.join(root, ".generated", "opencode", "hooks"))).toBe(false);
  expect(await pathExists(path.join(root, ".generated", "opencode", "commands"))).toBe(false);
  expect(await pathExists(path.join(root, ".generated", "opencode", "agents"))).toBe(false);
});

test("skips hidden skill directories when rendering OpenCode skills", async () => {
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

  await renderOpenCode(root);

  expect(await Bun.file(path.join(root, ".generated", "opencode", "skills", "public-skill", "SKILL.md")).exists()).toBe(
    true,
  );
  expect(await Bun.file(path.join(root, ".generated", "opencode", "skills", "hidden-skill", "SKILL.md")).exists()).toBe(
    false,
  );
});

test("resets the OpenCode output root when the source shelf is empty", async () => {
  const root = await makeTempRoot("agents-render-empty-skills-");
  tempRoots.push(root);

  await renderOpenCode(root);

  expect(await isDirectory(path.join(root, ".generated", "opencode"))).toBe(true);
  expect(await pathExists(path.join(root, ".generated", "opencode", "skills"))).toBe(false);
});

async function isDirectory(dir: string): Promise<boolean> {
  return (await lstat(dir)).isDirectory();
}
