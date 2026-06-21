import { afterEach, expect, test } from "bun:test";
import { lstat } from "fs/promises";
import path from "path";
import { linkTarget } from "../src/link/index";
import { makeTempRoot, readSymlinkTarget, readText, removeTempRoot, writeText } from "./helpers";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map(removeTempRoot));
  tempRoots.length = 0;
});

test("links OpenCode to generated directories instead of canonical source directories", async () => {
  const root = await makeTempRoot("agents-link-source-");
  const homeDir = await makeTempRoot("agents-link-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "agents", "source-only.md"), "source");
  await writeText(path.join(root, ".generated", "opencode", "agents", "source-only.md"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");
  await Bun.$`mkdir -p ${path.join(homeDir, ".config", "opencode")}`;
  await Bun.$`ln -s ${path.join(root, ".generated", "opencode", "commands")} ${path.join(homeDir, ".config", "opencode", "commands")}`;
  await Bun.$`ln -s ${path.join(root, "rules")} ${path.join(homeDir, ".config", "opencode", "rules")}`;

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
  expect(await pathIsSymlink(path.join(homeDir, ".config", "opencode", "commands"))).toBe(false);
  expect(await pathIsSymlink(path.join(homeDir, ".config", "opencode", "rules"))).toBe(false);
});

test("cleans legacy Codex links and syncs generated agents and hooks", async () => {
  const root = await makeTempRoot("agents-link-codex-clean-source-");
  const homeDir = await makeTempRoot("agents-link-codex-clean-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "skills", "source-only", "SKILL.md"), "source");
  await writeText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"), "generated");
  await writeText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "codex", "prompts", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "codex", "skills", "review-skill", "SKILL.md"), "generated");

  await Bun.$`mkdir -p ${path.join(homeDir, ".codex", "agents")}`;
  await Bun.$`ln -s ${path.join(root, ".generated", "codex", "agents")} ${path.join(homeDir, ".codex", "agents", "dotagents")}`;
  await Bun.$`ln -s ${path.join(root, ".generated", "codex", "prompts")} ${path.join(homeDir, ".codex", "prompts")}`;
  await Bun.$`ln -s ${path.join(root, ".generated", "codex", "skills")} ${path.join(homeDir, ".codex", "skills")}`;
  await Bun.$`ln -s ${path.join(root, "AGENTS.md")} ${path.join(homeDir, ".codex", "AGENTS.md")}`;

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await Bun.file(path.join(homeDir, ".codex", "agents", "dotagents")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "prompts")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "skills")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "AGENTS.md")).exists()).toBe(false);
  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "agents", "careful-reviewer.toml"))).toBe(
    path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "hooks", "dotagents"))).toBe(
    path.join(root, ".generated", "codex", "hooks"),
  );
  const hooksConfig = await readText(path.join(homeDir, ".codex", "hooks.json"));
  expect(hooksConfig).toContain("PreToolUse");
  expect(hooksConfig).toContain("prevent-main-commit.sh");
});

test("removes legacy Codex skills directory containing managed dotagents symlink", async () => {
  const root = await makeTempRoot("agents-link-codex-legacy-source-");
  const homeDir = await makeTempRoot("agents-link-codex-legacy-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "skills", "source-only", "SKILL.md"), "source");
  await writeText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"), "generated");
  await writeText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "codex", "prompts", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "codex", "skills", "review-skill", "SKILL.md"), "generated");

  await Bun.$`mkdir -p ${path.join(homeDir, ".codex", "skills")}`;
  await Bun.$`ln -s ${path.join(root, "skills")} ${path.join(homeDir, ".codex", "skills", "dotagents")}`;
  await writeText(path.join(homeDir, ".codex", "skills", ".DS_Store"), "finder metadata");

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await Bun.file(path.join(homeDir, ".codex", "skills", "dotagents")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".codex", "skills")).exists()).toBe(false);
});

test("removes managed Codex skill link written through canonical skills symlink", async () => {
  const root = await makeTempRoot("agents-link-codex-canonical-source-");
  const homeDir = await makeTempRoot("agents-link-codex-canonical-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "skills", "source-only", "SKILL.md"), "source");
  await writeText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "codex", "skills", "review-skill", "SKILL.md"), "generated");

  await Bun.$`mkdir -p ${path.join(homeDir, ".codex")}`;
  await Bun.$`ln -s ${path.join(root, "skills")} ${path.join(homeDir, ".codex", "skills")}`;
  await Bun.$`ln -s ${path.join(root, ".generated", "codex", "skills")} ${path.join(root, "skills", "dotagents")}`;

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await Bun.file(path.join(homeDir, ".codex", "skills")).exists()).toBe(false);
  expect(await Bun.file(path.join(root, "skills", "dotagents")).exists()).toBe(false);
});

test("requires generated Codex hooks before linking", async () => {
  const root = await makeTempRoot("agents-link-codex-no-generated-source-");
  const homeDir = await makeTempRoot("agents-link-codex-no-generated-home-");
  tempRoots.push(root, homeDir);

  await expect(linkTarget({ root, target: "codex", scope: "global", homeDir })).rejects.toThrow(
    "Cannot link missing source",
  );
});

test("leaves unmanaged Codex skills directory untouched", async () => {
  const root = await makeTempRoot("agents-link-codex-unmanaged-source-");
  const homeDir = await makeTempRoot("agents-link-codex-unmanaged-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "codex", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(homeDir, ".codex", "skills", "custom", "SKILL.md"), "custom");

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await Bun.file(path.join(homeDir, ".codex", "skills", "custom", "SKILL.md")).exists()).toBe(true);
});

test("links Claude to generated directories, hook config, and CLAUDE.md", async () => {
  const root = await makeTempRoot("agents-link-claude-source-");
  const homeDir = await makeTempRoot("agents-link-claude-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "claude", "agents", "reviewer.md"), "generated");
  await writeText(path.join(root, ".generated", "claude", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"), "generated");
  await Bun.$`mkdir -p ${path.join(homeDir, ".claude")}`;
  await Bun.$`ln -s ${path.join(root, ".generated", "claude", "commands")} ${path.join(homeDir, ".claude", "commands")}`;
  await Bun.$`ln -s ${path.join(root, "rules")} ${path.join(homeDir, ".claude", "rules")}`;

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
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "CLAUDE.md"))).toBe(
    path.join(root, "AGENTS.md"),
  );
  const settings = await readText(path.join(homeDir, ".claude", "settings.json"));
  expect(settings).toContain("PreToolUse");
  expect(settings).toContain("prevent-main-commit.sh");
  expect(await pathIsSymlink(path.join(homeDir, ".claude", "commands"))).toBe(false);
  expect(await pathIsSymlink(path.join(homeDir, ".claude", "rules"))).toBe(false);
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

test("does not write partial links when link preflight fails", async () => {
  const root = await makeTempRoot("agents-link-preflight-source-");
  const homeDir = await makeTempRoot("agents-link-preflight-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "opencode", "agents"), "not a directory");
  await writeText(path.join(root, ".generated", "opencode", "hooks", "prevent-main-commit.sh"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "plugins", "dotagents-hooks.js"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");

  await expect(linkTarget({ root, target: "opencode", scope: "global", homeDir })).rejects.toThrow(
    "Expected directory source",
  );

  expect(await Bun.file(path.join(homeDir, ".config", "opencode", "hooks")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".config", "opencode", "skills")).exists()).toBe(false);
});

async function pathIsSymlink(filePath: string): Promise<boolean> {
  try {
    return (await lstat(filePath)).isSymbolicLink();
  } catch {
    return false;
  }
}
