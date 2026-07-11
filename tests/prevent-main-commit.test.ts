import { afterEach, expect, test } from "bun:test";
import path from "path";
import { makeTempRoot, removeTempRoot } from "./helpers";

const tempRoots: string[] = [];
const hookPath = path.resolve(import.meta.dir, "..", "hooks", "scripts", "prevent-main-commit.sh");

afterEach(async () => {
  await Promise.all(tempRoots.map(removeTempRoot));
  tempRoots.length = 0;
});

test("fails closed when hook input cannot be parsed", async () => {
  const result = await runHook({ input: "not json" });

  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("Could not parse hook input");
});

test("blocks commit operations on main", async () => {
  const repo = await makeTempRoot("agents-hook-main-");
  tempRoots.push(repo);
  await Bun.$`git -C ${repo} init -b main`.quiet();

  const result = await runHook({
    cwd: repo,
    input: JSON.stringify({ tool_input: { command: "git commit -m test" } }),
  });

  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("Cannot commit directly to 'main'");
});

test.each([
  "rm -rf build",
  "rm -r build",
  "find . -delete",
  "truncate -s 0 data.db",
  "git reset --hard HEAD",
  "git clean -fd",
  "git checkout -- .",
  "git restore file.txt",
  "git stash clear",
  "git push --force origin main",
  "terraform destroy",
  "docker system prune -af",
  "docker volume prune",
  "docker compose down -v",
  "kubectl delete namespace production",
  "kubectl delete pods --all",
  "chmod -R 000 .",
  "sudo chown -R root /tmp/example",
  "dd if=/dev/zero of=/dev/disk1",
  "mkfs.ext4 /dev/disk1",
  "diskutil eraseDisk APFS Empty /dev/disk4",
])(
  "blocks destructive command: %s",
  async (command) => {
    const result = await runHook({
      input: JSON.stringify({ tool_input: { command } }),
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain("Blocked:");
  },
);

test("allows non-commit commands", async () => {
  const result = await runHook({
    input: JSON.stringify({ tool_input: { command: "git status" } }),
  });

  expect(result.exitCode).toBe(0);
});

test("allows push with force-with-lease", async () => {
  const result = await runHook({
    input: JSON.stringify({ tool_input: { command: "git push --force-with-lease" } }),
  });

  expect(result.exitCode).toBe(0);
});

interface HookRunOptions {
  cwd?: string;
  env?: Record<string, string>;
  input: string;
}

async function runHook(options: HookRunOptions): Promise<{ exitCode: number; stderr: string }> {
  const child = Bun.spawn(["/bin/bash", hookPath], {
    cwd: options.cwd,
    env: {
      ...process.env,
      ...options.env,
    },
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });

  child.stdin.write(options.input);
  child.stdin.end();

  return {
    exitCode: await child.exited,
    stderr: await new Response(child.stderr).text(),
  };
}
