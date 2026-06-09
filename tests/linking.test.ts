import { afterEach, expect, test } from "bun:test";
import path from "path";
import { linkTarget } from "../src/link/index";
import { makeTempRoot, readSymlinkTarget, removeTempRoot, writeText } from "./helpers";

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
  await writeText(path.join(root, ".generated", "opencode", "commands", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");

  await linkTarget({ root, target: "opencode", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "agents"))).toBe(
    path.join(root, ".generated", "opencode", "agents"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "commands"))).toBe(
    path.join(root, ".generated", "opencode", "commands"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "skills"))).toBe(
    path.join(root, ".generated", "opencode", "skills"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".config", "opencode", "AGENTS.md"))).toBe(
    path.join(root, "AGENTS.md"),
  );
});

test("links Codex skills to generated directory instead of nesting under stale canonical symlink", async () => {
  const root = await makeTempRoot("agents-link-codex-source-");
  const homeDir = await makeTempRoot("agents-link-codex-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "skills", "source-only", "SKILL.md"), "source");
  await writeText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"), "generated");
  await writeText(path.join(root, ".generated", "codex", "prompts", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "codex", "skills", "review-skill", "SKILL.md"), "generated");

  await Bun.$`mkdir -p ${path.join(homeDir, ".codex")}`;
  await Bun.$`ln -s ${path.join(root, "skills")} ${path.join(homeDir, ".codex", "skills")}`;

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "skills"))).toBe(
    path.join(root, ".generated", "codex", "skills"),
  );
  expect(await Bun.file(path.join(root, "skills", "dotagents")).exists()).toBe(false);
});

test("migrates legacy Codex skills directory containing dotagents symlink", async () => {
  const root = await makeTempRoot("agents-link-codex-legacy-source-");
  const homeDir = await makeTempRoot("agents-link-codex-legacy-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "skills", "source-only", "SKILL.md"), "source");
  await writeText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"), "generated");
  await writeText(path.join(root, ".generated", "codex", "prompts", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "codex", "skills", "review-skill", "SKILL.md"), "generated");

  await Bun.$`mkdir -p ${path.join(homeDir, ".codex", "skills")}`;
  await Bun.$`ln -s ${path.join(root, "skills")} ${path.join(homeDir, ".codex", "skills", "dotagents")}`;

  await linkTarget({ root, target: "codex", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "skills"))).toBe(
    path.join(root, ".generated", "codex", "skills"),
  );
});

test("keeps legacy Codex skills directory when generated source preflight fails", async () => {
  const root = await makeTempRoot("agents-link-codex-preflight-source-");
  const homeDir = await makeTempRoot("agents-link-codex-preflight-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, "skills", "source-only", "SKILL.md"), "source");
  await writeText(path.join(root, ".generated", "codex", "agents", "careful-reviewer.toml"), "generated");
  await writeText(path.join(root, ".generated", "codex", "skills", "review-skill", "SKILL.md"), "generated");

  await Bun.$`mkdir -p ${path.join(homeDir, ".codex", "skills")}`;
  await Bun.$`ln -s ${path.join(root, "skills")} ${path.join(homeDir, ".codex", "skills", "dotagents")}`;

  await expect(linkTarget({ root, target: "codex", scope: "global", homeDir })).rejects.toThrow(
    "Cannot link missing source",
  );

  expect(await readSymlinkTarget(path.join(homeDir, ".codex", "skills", "dotagents"))).toBe(
    path.join(root, "skills"),
  );
});

test("links Claude to generated directories and CLAUDE.md", async () => {
  const root = await makeTempRoot("agents-link-claude-source-");
  const homeDir = await makeTempRoot("agents-link-claude-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "claude", "agents", "reviewer.md"), "generated");
  await writeText(path.join(root, ".generated", "claude", "commands", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "claude", "skills", "review-skill", "SKILL.md"), "generated");

  await linkTarget({ root, target: "claude", scope: "global", homeDir });

  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "agents"))).toBe(
    path.join(root, ".generated", "claude", "agents"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "commands"))).toBe(
    path.join(root, ".generated", "claude", "commands"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "skills"))).toBe(
    path.join(root, ".generated", "claude", "skills"),
  );
  expect(await readSymlinkTarget(path.join(homeDir, ".claude", "CLAUDE.md"))).toBe(
    path.join(root, "AGENTS.md"),
  );
});

test("rejects generated source kind mismatches before linking", async () => {
  const root = await makeTempRoot("agents-link-kind-source-");
  const homeDir = await makeTempRoot("agents-link-kind-home-");
  tempRoots.push(root, homeDir);

  await writeText(path.join(root, "AGENTS.md"), "# Shared instructions");
  await writeText(path.join(root, ".generated", "opencode", "agents"), "not a directory");
  await writeText(path.join(root, ".generated", "opencode", "commands", "ship.md"), "generated");
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
  await writeText(path.join(root, ".generated", "opencode", "commands", "ship.md"), "generated");
  await writeText(path.join(root, ".generated", "opencode", "skills", "review-skill", "SKILL.md"), "generated");

  await expect(linkTarget({ root, target: "opencode", scope: "global", homeDir })).rejects.toThrow(
    "Expected directory source",
  );

  expect(await Bun.file(path.join(homeDir, ".config", "opencode", "commands")).exists()).toBe(false);
  expect(await Bun.file(path.join(homeDir, ".config", "opencode", "skills")).exists()).toBe(false);
});
