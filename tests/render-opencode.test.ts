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
      "Use review:ce-correctness-reviewer from ~/.claude/agents.",
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
  expect(skill).toContain("Use ce-correctness-reviewer from ~/.config/opencode/agents.");
});

test("renders Codex agents as TOML in a generated target tree", async () => {
  const root = await makeTempRoot("agents-render-codex-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "careful-reviewer.md"),
    [
      "---",
      "name: careful-reviewer",
      "description: Finds logic bugs",
      "tools: Read, Grep",
      "---",
      "",
      "Use the review-skill skill and inspect ~/.claude/agents.",
    ].join("\n"),
  );

  await renderTarget({ root, target: "codex" });

  const agent = await readText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"));
  expect(agent).toContain('name = "careful-reviewer"');
  expect(agent).toContain('description = "Finds logic bugs"');
  expect(agent).toContain('developer_instructions = "Use the review-skill skill');
  expect(agent).toContain("Use the review-skill skill");
  expect(agent).not.toContain("tools:");
});

test("escapes Codex TOML instructions with backslashes safely", async () => {
  const root = await makeTempRoot("agents-render-codex-escaping-");
  tempRoots.push(root);

  await writeText(
    path.join(root, "agents", "regex-reviewer.md"),
    [
      "---",
      "name: regex-reviewer",
      "description: Checks regex examples",
      "---",
      "",
      String.raw`Use regex \d+ and path C:\tmp.`,
    ].join("\n"),
  );

  await renderTarget({ root, target: "codex" });

  const agent = await readText(path.join(root, ".generated", "codex", "agents", "regex-reviewer.toml"));
  expect(agent).toContain(String.raw`developer_instructions = "Use regex \\d+ and path C:\\tmp."`);
  expect(agent).not.toContain('developer_instructions = """');
});

test("creates empty generated directories for linkable target sections", async () => {
  const root = await makeTempRoot("agents-render-empty-sections-");
  tempRoots.push(root);

  await renderTarget({ root, target: "opencode" });
  await renderTarget({ root, target: "codex" });

  expect(await isDirectory(path.join(root, ".generated", "opencode", "agents"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "commands"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "opencode", "skills"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "codex", "agents"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "codex", "prompts"))).toBe(true);
  expect(await isDirectory(path.join(root, ".generated", "codex", "skills"))).toBe(true);
});

async function isDirectory(dir: string): Promise<boolean> {
  return (await lstat(dir)).isDirectory();
}
