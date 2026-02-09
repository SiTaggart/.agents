---
name: sync-upstream
description: Pull latest upstream changes, categorize, and produce an actionable sync report
---

# Sync Upstream Changes

Compare the local `.agents` content against the upstream [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) and produce a categorized report of what changed.

## Workflow

### Step 1: Load State

Read `.sync-state.json` from the repository root. This file contains:
- `upstream_repo` — absolute path to the local clone of the upstream repo
- `content_root` — subdirectory within upstream that holds the shared content
- `last_synced_commit` — the commit hash from the last successful sync
- `skip_patterns` — filename globs and content markers to auto-skip
- `path_mappings` — how upstream subdirectories map to local flat structure

If `.sync-state.json` does not exist, initialize it with defaults:
- Set `upstream_repo` to `/Users/staggart/dev/sandbox/compound-engineering-plugin`
- Set `content_root` to `plugins/compound-engineering`
- Get the current HEAD of `origin/main` in the upstream repo and use it as `last_synced_commit`
- Set `last_synced_date` to the current ISO timestamp
- Use the default skip patterns and path mappings from the SKILL.md

### Step 2: Fetch Upstream

```bash
git -C <upstream_repo> fetch origin main
```

Use `fetch`, not `pull` — this is read-only and avoids touching the upstream working tree.

### Step 3: List New Commits

```bash
git -C <upstream_repo> log --oneline <last_synced_commit>..origin/main
```

If there are no new commits, report "Already up to date" and stop.

### Step 4: Get Changed Files

```bash
git -C <upstream_repo> diff --name-status <last_synced_commit>..origin/main -- <content_root>/
```

This gives Added (A), Modified (M), and Deleted (D) files within the content root.

### Step 5: Analyze Each Change

For each changed file, use the categorization logic from the sync-upstream skill:

1. **Strip the content root prefix** — e.g., `plugins/compound-engineering/agents/review/foo.md` becomes `agents/review/foo.md`
2. **Check filename skip patterns** — match the basename against `skip_patterns.filenames` (glob matching)
3. **Map upstream path to local path** — use `path_mappings` to flatten subdirectories (e.g., `agents/review/foo.md` -> `agents/foo.md`)
4. **Check if local file exists** — determines whether this is NEW or an UPDATE
5. **For non-skipped files, read the upstream content** — scan for `skip_patterns.content_markers`
6. **Assign disposition:**
   - `SKIP` — matches a filename pattern or contains multiple content markers
   - `NEW` — no local equivalent exists, no skip triggers
   - `UPDATE` — local equivalent exists, no skip triggers

### Step 6: Read CHANGELOG (Optional)

If the upstream repo has a CHANGELOG.md at `<content_root>/CHANGELOG.md`:

```bash
git -C <upstream_repo> show origin/main:<content_root>/CHANGELOG.md
```

Extract entries that correspond to the commit range for additional context.

### Step 7: Generate Report

Write the full report to `.claude/sync-report.md` using this format:

```markdown
# Upstream Sync Report
Generated: <date>
Range: <old_commit_short>..<new_commit_short> (<N> commits)

## Commits
- <hash> <message>
- ...

## Updates to Existing Content
Items that exist locally and changed upstream.

### <local_path>
- **Upstream path:** <upstream_relative_path>
- **Status:** Modified | Added lines | Removed lines
- **What changed:** <brief summary from diff>
- **Action needed:** Review diff, merge improvements

## New Content to Review
Items that don't exist locally and may be worth adding.

### <mapped_local_path>
- **Upstream path:** <upstream_relative_path>
- **Category:** <agent|command|skill>
- **Relevance:** HIGH | MEDIUM | LOW
- **Summary:** <brief description of what this file does>

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `<upstream_relative_path>` — <reason: filename match or content marker>
```

### Step 8: Present Summary

Show the user a concise summary:
- Number of commits in range
- Count of updates, new items, and skipped items
- Highlight any HIGH relevance new items
- Point to `.claude/sync-report.md` for the full report

### Step 9: Update State

Write the new `origin/main` commit hash and current timestamp to `.sync-state.json`:

```bash
NEW_COMMIT=$(git -C <upstream_repo> rev-parse origin/main)
```

Update `last_synced_commit` and `last_synced_date` in the JSON file.

## Important Notes

- This command is **read-only** — it never modifies upstream or auto-applies changes locally
- The report is for **human review** — the user decides what to port
- Skip patterns are intentionally conservative — it's better to surface something irrelevant than miss something useful
- When scanning content markers, a single marker in a large file is not necessarily a skip — look for files that are predominantly Ruby/Rails/Every-specific
- The report goes to `.claude/sync-report.md` which is project-local (not in shared content directories)
