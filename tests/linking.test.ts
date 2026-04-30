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
