import { afterEach, expect, test } from "bun:test";
import path from "path";
import { linkTarget } from "../src/link/index";
import { makeTempRoot, readSymlinkTarget, readText, removeTempRoot, writeText } from "./helpers";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map(removeTempRoot));
  tempRoots.length = 0;
});

test("links OpenCode to generated agents, hooks, plugin, skills, and shared instructions", async () => {
  const root = await makeTempRoot("agents-link-opencode-source-");
  const homeDir = await makeTempRoot("agents-link-opencode-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "opencode", "agents", "reviewer.md"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");
  await writeText(path.join(homeDir, ".config", "opencode", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".config", "opencode", "rules", "old.md"), "old");

  await linkTarget({ root, target: "opencode", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "agents"))).toBe(
    path.join(root, ".generated", "opencode", "agents"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "hooks"))).toBe(
    path.join(root, ".generated", "opencode", "hooks"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "plugins", "dotagents-hooks.js"))).toBe(
    path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "skills"))).toBe(
    path.join(root, ".generated", "opencode", "skills"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "AGENTS.md"))).toBe(
    path.join(root, "AGENTS.md"),
  );
  expect(await Bun.file(path.join(homeDir, ".config", "opencode", "commands")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".config", "opencode", "rules")).exists()).toBe(false);
});

test("links Claude to generated agents, hooks, skills, instructions, and hook config", async () => {
  const root = await makeTempRoot("agents-link-claude-source-");
  const homeDir = await makeTempRoot("agents-link-claude-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "claude", "agents", "reviewer.md"), "generated");
  await writeText(path.join(root, ".generated", "claude", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"), "generated");
  await writeText(path.join(homeDir, ".claude", "hooks", "old.sh"), "old");
  await writeText(path.join(homeDir, ".claude", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".claude", "rules", "old.md"), "old");

  await linkTarget({ root, target: "claude", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "agents"))).toBe(
    path.join(root, ".generated", "claude", "agents"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "hooks"))).toBe(
    path.join(root, ".generated", "claude", "hooks"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "skills"))).toBe(
    path.join(root, ".generated", "claude", "skills"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "CLAUDE.md"))).toBe(path.join(root, "AGENTS.md"));
  expect(await readJson(path.join(homeDir, ".claude", "settings.json"))).toEqual({
    hooks: {
      PreToolUse: [{
        matcher: "Bash",
        hooks: [{
          type: "command",
          command: `bash ${JSON.stringify(path.join(homeDir, ".claude", "hooks", "prevent-main-commit.sh"))}`,
        }],
      }],
    },
  });
  expect(await Bun.file(path.join(homeDir, ".claude", "commands")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".claude", "rules")).exists()).toBe(false);
});

test("links Codex generated agents and hooks, removing obsolete generated surfaces", async () => {
  const root = await makeTempRoot("agents-link-codex-source-");
  const homeDir = await makeTempRoot("agents-link-codex-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"), "generated");
  await writeText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, "skills", "dotagents", "old", "SKILL.md"), "old");
  await writeText(path.join(homeDir, ".codex", "agents", "old.toml"), "old");
  await writeText(path.join(homeDir, ".codex", "hooks", "old.sh"), "old");
  await writeText(path.join(homeDir, ".codex", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".codex", "rules", "old.md"), "old");
  await writeText(path.join(homeDir, ".codex", "prompts", "old.md"), "old");
  await writeText(path.join(homeDir, ".codex", "AGENTS.md"), "old");
  await writeText(path.join(homeDir, ".codex", "skills", "custom", "SKILL.md"), "custom");

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "agents"))).toBe(
    path.join(root, ".generated", "codex", "agents"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "hooks"))).toBe(
    path.join(root, ".generated", "codex", "hooks"),
  );
  expect(await readJson(path.join(homeDir, ".codex", "hooks.json"))).toEqual({
    hooks: {
      PreToolUse: [{
        matcher: "Bash",
        hooks: [{
          type: "command",
          command: `bash ${JSON.stringify(path.join(homeDir, ".codex", "hooks", "prevent-main-commit.sh"))}`,
          statusMessage: "Checking git branch policy",
        }],
      }],
    },
  });
  expect(await Bun.file(path.join(homeDir, ".codex", "commands")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "rules")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "prompts")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "AGENTS.md")).exists()).toBe(false);
  expect(await Bun.file(path.join(root, "skills", "dotagents")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "skills", "custom", "SKILL.md")).exists()).toBe(true);
});

test("rejects generated source kind mismatches before linking", async () => {
  const root = await makeTempRoot("agents-link-kind-source-");
  const homeDir = await makeTempRoot("agents-link-kind-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "opencode", "agents"), "not a directory");
  await writeText(path.join(root, ".generated", "opencode", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");

  await expect(linkTarget({ root, target: "opencode", scope: "global", homeDir })).rejects.toThrow(
    "Expected directory source",
  );
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readText(filePath));
}
