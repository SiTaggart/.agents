import { afterEach, expect, test } from "bun:test";
import { mkdir, symlink } from "fs/promises";
import path from "path";
import { pathExists } from "../src/fs";
import { linkTarget } from "../src/link/index";
import { makeTempRoot, readSymlinkTarget, readText, removeTempRoot, writeText } from "./helpers";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map(removeTempRoot));
  tempRoots.length = 0;
});

test("links OpenCode to generated hooks, plugin, skills, and shared instructions", async () => {
  const root = await makeTempRoot("agents-link-opencode-source-");
  const homeDir = await makeTempRoot("agents-link-opencode-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "opencode", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");
  await writeText(path.join(homeDir, ".config", "opencode", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".config", "opencode", "rules", "old.md"), "old");
  await symlink(
    path.relative(
      path.join(homeDir, ".config", "opencode"),
      path.join(root, ".generated", "opencode", "agents"),
    ),
    path.join(homeDir, ".config", "opencode", "agents"),
  );

  await linkTarget({ root, target: "opencode", scope: "global", homeDir });

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
  expect(await pathExists(path.join(homeDir, ".config", "opencode", "agents"))).toBe(false);
  expect(await pathExists(path.join(homeDir, ".config", "opencode", "commands"))).toBe(false);
  expect(await pathExists(path.join(homeDir, ".config", "opencode", "rules"))).toBe(false);
});

test("links Claude to generated hooks, skills, instructions, and hook config", async () => {
  const root = await makeTempRoot("agents-link-claude-source-");
  const homeDir = await makeTempRoot("agents-link-claude-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "claude", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"), "generated");
  await writeText(path.join(homeDir, ".claude", "hooks", "old.sh"), "old");
  await writeText(path.join(homeDir, ".claude", "agents", "mine.md"), "user-authored subagent");
  await writeText(path.join(homeDir, ".claude", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".claude", "rules", "old.md"), "old");

  await linkTarget({ root, target: "claude", scope: "global", homeDir });

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
  expect(await readText(path.join(homeDir, ".claude", "agents", "mine.md"))).toBe("user-authored subagent");
  expect(await pathExists(path.join(homeDir, ".claude", "commands"))).toBe(false);
  expect(await pathExists(path.join(homeDir, ".claude", "rules"))).toBe(false);
});

test("links Codex generated hooks, removing obsolete generated surfaces", async () => {
  const root = await makeTempRoot("agents-link-codex-source-");
  const homeDir = await makeTempRoot("agents-link-codex-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, "skills", "dotagents", "old", "SKILL.md"), "old");
  await writeText(path.join(homeDir, ".codex", "hooks", "old.sh"), "old");
  await writeText(path.join(homeDir, ".codex", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".codex", "rules", "old.md"), "old");
  await writeText(path.join(homeDir, ".codex", "prompts", "old.md"), "old");
  await writeText(path.join(homeDir, ".codex", "AGENTS.md"), "old");
  await writeText(path.join(homeDir, ".codex", "skills", "custom", "SKILL.md"), "custom");
  await mkdir(path.join(homeDir, "elsewhere"), { recursive: true });
  await symlink(path.join(homeDir, "elsewhere"), path.join(homeDir, ".codex", "agents"));

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

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
  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "agents"))).toBe(path.join(homeDir, "elsewhere"));
  expect(await pathExists(path.join(homeDir, ".codex", "commands"))).toBe(false);
  expect(await pathExists(path.join(homeDir, ".codex", "rules"))).toBe(false);
  expect(await pathExists(path.join(homeDir, ".codex", "prompts"))).toBe(false);
  expect(await pathExists(path.join(homeDir, ".codex", "AGENTS.md"))).toBe(false);
  expect(await pathExists(path.join(root, "skills", "dotagents"))).toBe(false);
  expect(await readText(path.join(homeDir, ".codex", "skills", "custom", "SKILL.md"))).toBe("custom");
});

test("removes dangling managed agents links from a retired checkout", async () => {
  const root = await makeTempRoot("agents-link-dangling-source-");
  const homeDir = await makeTempRoot("agents-link-dangling-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "claude", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"), "generated");
  await mkdir(path.join(homeDir, ".claude"), { recursive: true });
  await symlink(
    path.join(homeDir, "old-checkout", ".generated", "claude", "agents"),
    path.join(homeDir, ".claude", "agents"),
  );

  await linkTarget({ root, target: "claude", scope: "global", homeDir });

  expect(await pathExists(path.join(homeDir, ".claude", "agents"))).toBe(false);
});

test("rejects generated source kind mismatches before touching the target root", async () => {
  const root = await makeTempRoot("agents-link-kind-source-");
  const homeDir = await makeTempRoot("agents-link-kind-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "opencode", "skills"), "not a directory");
  await writeText(path.join(root, ".generated", "opencode", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"), "generated");
  await writeText(path.join(homeDir, ".config", "opencode", "commands", "old.md"), "old");
  await writeText(path.join(homeDir, ".config", "opencode", "agents", "mine.md"), "user-authored agent");

  await expect(linkTarget({ root, target: "opencode", scope: "global", homeDir })).rejects.toThrow(
    "Expected directory source",
  );

  expect(await readText(path.join(homeDir, ".config", "opencode", "commands", "old.md"))).toBe("old");
  expect(await readText(path.join(homeDir, ".config", "opencode", "agents", "mine.md"))).toBe("user-authored agent");
});

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readText(filePath));
}
