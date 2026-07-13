import { expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const script = path.join(import.meta.dir, "..", "skills", "ce-sessions", "scripts", "discover-sessions.sh");
const skeletonScript = path.join(
  import.meta.dir,
  "..",
  "skills",
  "ce-sessions",
  "scripts",
  "extract-skeleton.py",
);

test("discovers Claude sessions globally and in a dot-prefixed repo", async () => {
  const home = await mkdtemp(path.join(os.tmpdir(), "ce-sessions-"));
  const agents = path.join(home, ".claude", "projects", "-Users-test--agents");
  const spade = path.join(home, ".claude", "projects", "-Users-test-spade");
  const agentsSession = path.join(agents, "agents.jsonl");
  const spadeSession = path.join(spade, "spade.jsonl");
  const codexSession = path.join(home, ".codex", "sessions", "shared.jsonl");
  const mirroredOrcaSession = path.join(
    home,
    "Library",
    "Application Support",
    "orca",
    "codex-runtime-home",
    "home",
    "sessions",
    "shared.jsonl",
  );
  const orcaSession = path.join(path.dirname(mirroredOrcaSession), "orca.jsonl");

  await mkdir(agents, { recursive: true });
  await mkdir(spade, { recursive: true });
  await mkdir(path.dirname(codexSession), { recursive: true });
  await mkdir(path.dirname(mirroredOrcaSession), { recursive: true });
  await writeFile(agentsSession, "{}\n");
  await writeFile(spadeSession, "{}\n");
  await writeFile(codexSession, "{}\n");
  await writeFile(mirroredOrcaSession, "{}\n");
  await writeFile(orcaSession, "{}\n");

  const run = async (scope: string, platform?: string) => {
    const args = ["bash", script, scope, "7"];
    if (platform) args.push("--platform", platform);

    const process = Bun.spawn(args, {
      env: { ...Bun.env, HOME: home },
      stdout: "pipe",
    });
    const output = await new Response(process.stdout).text();
    expect(await process.exited).toBe(0);
    return output.trim().split("\n").sort();
  };

  expect(await run("--all-repos")).toEqual([agentsSession, codexSession, orcaSession, spadeSession].sort());
  expect(await run(".agents", "claude")).toEqual([agentsSession]);
});

test("extracts Hermes sessions without reasoning or tool output", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "ce-sessions-hermes-"));
  const input = path.join(directory, "session.jsonl");
  const output = path.join(directory, "skeleton.txt");
  const session = {
    id: "hermes-test",
    messages: [
      { role: "user", content: "Please inspect the skill behavior in this repository.", timestamp: "2026-07-13" },
      {
        role: "assistant",
        content: "I will inspect the relevant source before deciding.",
        reasoning: "SECRET_REASONING",
        timestamp: "2026-07-13",
        tool_calls: [
          {
            function: {
              name: "read_file",
              arguments: JSON.stringify({ file_path: "/tmp/SKILL.md", secret: "SECRET_ARGUMENT" }),
            },
          },
        ],
      },
      { role: "tool", tool_name: "read_file", content: "SECRET_TOOL_OUTPUT", timestamp: "2026-07-13" },
    ],
  };
  await writeFile(input, `${JSON.stringify(session)}\n`);

  const process = Bun.spawn(["python3", skeletonScript, "--output", output], {
    stdin: Bun.file(input),
    stdout: "pipe",
  });
  await new Response(process.stdout).text();
  expect(await process.exited).toBe(0);

  const skeleton = await Bun.file(output).text();
  expect(skeleton).toContain("[user] Please inspect the skill behavior");
  expect(skeleton).toContain("[assistant] I will inspect the relevant source");
  expect(skeleton).toContain("[tool] read_file /tmp/SKILL.md -> ok");
  expect(skeleton).not.toContain("SECRET_REASONING");
  expect(skeleton).not.toContain("SECRET_ARGUMENT");
  expect(skeleton).not.toContain("SECRET_TOOL_OUTPUT");
});
