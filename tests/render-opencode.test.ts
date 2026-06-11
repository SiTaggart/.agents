import { afterEach, expect, test } from "bun:test";
import { lstat } from "fs/promises";
import path from "path";
import { renderTarget } from "../src/render/index";
import { makeTempRoot, readText, removeTempRoot, writeText } from "./helpers";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map(removeTempRoot));
  tempRoots.length = 0;
});

test("renders Claude-shaped agents into OpenCode-compatible generated files", async () => {
  const root = await makeTempRoot("agents-render-opencode-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "careful-reviewer.md"),
    [
      "---",
      "name: careful-reviewer",
      'description: "Finds logic bugs: fast"',
      "model: inherit",
      "tools: Read, Grep, Glob, Bash, WebFetch, AskUserQuestion, LS, MultiEdit",
      'color: "#FFA500"',
      "---",
      "",
      "Use ~/.claude/agents and ask compound-engineering:review:correctness-reviewer.",
    ].join("\n"),
  );
  await writeText(
    path.join(root, "commands", "ship.md"),
    [
      "---",
      "name: ship",
      "description: Ship the branch",
      "allowed-tools: Bash, Read, Write",
      "---",
      "",
      "Check .claude/commands before shipping.",
    ].join("\n"),
  );
  await writeText(
    path.join(root, "skills", "review-skill", "SKILL.md"),
    [
      "---",
      "name: review-skill",
      "description: Review via a helper agent",
      "---",
      "",
      "Use review:careful-reviewer from ~/.claude/agents.",
      "Keep mode:headless and obsidian daily:read untouched.",
    ].join("\n"),
  );

  await renderTarget({ root, target: "opencode" });

  const agent = await readText(path.join(root, ".generated", "opencode", "agents", "careful-reviewer.md"));
  expect(agent).toContain("description: \"Finds logic bugs: fast\"");
  expect(agent).toContain("mode: subagent");
  expect(agent).toContain("permission:");
  expect(agent).toContain("  bash: allow");
  expect(agent).toContain("  question: allow");
  expect(agent).toContain("  list: allow");
  expect(agent).toContain("  edit: allow");
  expect(agent).not.toContain("name:");
  expect(agent).not.toContain("tools:");
  expect(agent).not.toContain("color:");
  expect(agent).not.toContain("model: inherit");
  expect(agent).toContain("~/.config/opencode/agents");
  expect(agent).toContain("ask correctness-reviewer.");

  const command = await readText(path.join(root, ".generated", "opencode", "commands", "ship.md"));
  expect(command).toContain("description: Ship the branch");
  expect(command).not.toContain("allowed-tools:");
  expect(command).toContain(".opencode/commands before shipping.");

  const skill = await readText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("Use careful-reviewer from ~/.config/opencode/agents.");
  expect(skill).toContain("Keep mode:headless and obsidian daily:read untouched.");
});

test("renders Claude agents, commands, and skills in a generated target tree", async () => {
  const root = await makeTempRoot("agents-render-claude-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "careful-reviewer.md"),
    [
      "---",
      "name: careful-reviewer",
      "description: Finds logic bugs",
      "model: inherit",
      "tools: Read, Grep",
      "color: blue",
      "---",
      "",
      "Use ~/.claude/agents and the review-skill skill.",
    ].join("\n"),
  );
  await writeText(
    path.join(root, "commands", "ship.md"),
    [
      "---",
      "name: ship",
      "description: Ship the branch",
      "allowed-tools: Bash, Read, Write",
      "---",
      "",
      "Run the ship checklist.",
    ].join("\n"),
  );
  await writeText(
    path.join(root, "skills", "review-skill", "SKILL.md"),
    [
      "---",
      "name: review-skill",
      "description: Review via a helper agent",
      "---",
      "",
      "Use the careful reviewer.",
    ].join("\n"),
  );

  await renderTarget({ root, target: "claude" });

  const agent = await readText(path.join(root, ".generated", "claude", "agents", "careful-reviewer.md"));
  expect(agent).toContain("name: careful-reviewer");
  expect(agent).toContain("description: Finds logic bugs");
  expect(agent).toContain("tools: Read, Grep");
  expect(agent).toContain("Use ~/.claude/agents and the review-skill skill.");

  const command = await readText(path.join(root, ".generated", "claude", "commands", "ship.md"));
  expect(command).toContain("description: Ship the branch");
  expect(command).toContain("allowed-tools: Bash, Read, Write");
  expect(command).toContain("Run the ship checklist.");

  const skill = await readText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("description: Review via a helper agent");
  expect(skill).toContain("Use the careful reviewer.");
});

test("removes obsolete Codex generated output", async () => {
  const root = await makeTempRoot("agents-render-codex-clean-");
  tempRoots.push(root);

  await writeText(path.join(root, ".generated", "codex", "agents", "stale.toml"), "stale");

  await renderTarget({ root, target: "codex" });

  expect(await Bun.file(path.join(root, ".generated", "codex")).exists()).toBe(false);
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

  expect(await isDirectory(path.join(root, ".generated", "opencode", "agents"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "commands"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "skills"))).toBe(true);
  expect(await Bun.file(path.join(root, ".generated", "codex")).exists()).toBe(false);
  expect(await isDirectory(path.join(root, ".generated", "claude", "agents"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "commands"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "skills"))).toBe(true);
});

async function isDirectory(dir: string): Promise<boolean> {
  return (await lstat(dir)).isDirectory();
}
