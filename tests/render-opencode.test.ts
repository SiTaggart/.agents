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
  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");
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

  const skill = await readText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("Use careful-reviewer from ~/.config/opencode/agents.");
  expect(skill).toContain("Keep mode:headless and obsidian daily:read untouched.");

  const plugin = await readText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"));
  expect(plugin).toContain("tool.execute.before");
  expect(plugin).toContain("prevent-main-commit.sh");
  expect(plugin).toContain("async ({ directory, worktree })");
  expect(plugin).toContain("cwd: hookCwd");
  expect(plugin).toContain("if (result.error)");
  expect(plugin).toContain("if (result.signal)");
  expect(plugin).toContain("if (result.status !== 0)");
  expect(await Bun.file(path.join(root, ".generated", "opencode", "commands")).exists()).toBe(false);
});

test("renders Claude agents, skills, and hooks in a generated target tree", async () => {
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
  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");
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

  const skill = await readText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"));
  expect(skill).toContain("description: Review via a helper agent");
  expect(skill).toContain("Use the careful reviewer.");
  expect(await readText(path.join(root, ".generated", "claude", "hooks", "prevent-main-commit.sh"))).toContain(
    "exit 0",
  );
});

test("renders Codex agents and hooks in a generated target tree", async () => {
  const root = await makeTempRoot("agents-render-codex-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "careful-reviewer.md"),
    [
      "---",
      "name: careful-reviewer",
      "description: Finds logic bugs",
      "model: sonnet",
      "tools: Read, Grep, Glob, Bash",
      "---",
      "",
      "Use the anchored confidence rubric.",
    ].join("\n"),
  );
  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");

  await renderTarget({ root, target: "codex" });

  const agent = await readText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"));
  expect(agent).toContain('name = "careful-reviewer"');
  expect(agent).toContain('description = "Finds logic bugs"');
  expect(agent).toContain('developer_instructions = "Use the anchored confidence rubric."');
  expect(agent).toContain('sandbox_mode = "read-only"');
  expect(agent).not.toContain("model =");
  expect(await readText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"))).toContain(
    "exit 0",
  );
});

test("lets write-capable Codex agents inherit the parent sandbox", async () => {
  const root = await makeTempRoot("agents-render-codex-write-tools-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "implementation-worker.md"),
    [
      "---",
      "name: implementation-worker",
      "description: Makes targeted edits",
      "tools: Read, Write, Edit, Bash",
      "---",
      "",
      "Make the smallest correct change.",
    ].join("\n"),
  );
  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");

  await renderTarget({ root, target: "codex" });

  const agent = await readText(path.join(root, ".generated", "codex", "agents", "implementation-worker.toml"));
  expect(agent).not.toContain("sandbox_mode");
});

test("renders explicit Codex model overrides only", async () => {
  const root = await makeTempRoot("agents-render-codex-model-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "careful-reviewer.md"),
    [
      "---",
      "name: careful-reviewer",
      "description: Finds logic bugs",
      "model: sonnet",
      "codex_model: gpt-5-codex",
      "---",
      "",
      "Use the anchored confidence rubric.",
    ].join("\n"),
  );
  await writeText(path.join(root, "hooks", "scripts", "prevent-main-commit.sh"), "#!/bin/bash\nexit 0\n");

  await renderTarget({ root, target: "codex" });

  const agent = await readText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"));
  expect(agent).toContain('model = "gpt-5-codex"');
  expect(agent).not.toContain('model = "sonnet"');
  expect(agent).not.toContain("sandbox_mode");
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
  expect(await isDirectory(path.join(root, ".generated", "opencode", "hooks"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "plugins"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "skills"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "codex", "agents"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "codex", "hooks"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "agents"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "hooks"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "claude", "skills"))).toBe(true);
});

async function isDirectory(dir: string): Promise<boolean> {
  return (await lstat(dir)).isDirectory();
}
