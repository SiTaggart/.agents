# Compound Engineering Release Sync Automation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Automatically keep `SiTaggart/.agents` aligned with useful upstream releases from `EveryInc/compound-engineering-plugin`, while preserving Simon's local conventions and avoiding Every-specific/Rails-specific leakage.

**Architecture:** Use a once-daily release-polling Hermes cron job because we do not control the upstream repository's webhooks. A small pre-run script checks GitHub releases for new `compound-engineering-v*` releases since `.sync-state.json`; only when releases are new does the agent create a sync branch, load the project-local `.claude` sync skill/command as the source of truth, apply its mapping/filtering/adaptation rules, run verification, and open a PR for review.

**Tech Stack:** Hermes cron, `gh` GitHub CLI, Git, Bun/TypeScript, `.agents` sync/render CLI, GitHub PRs.

---

## Current State

- Local repo: `/opt/data/workspace/github/refs/SiTaggart/.agents`
- Upstream source: `https://github.com/EveryInc/compound-engineering-plugin`
- Upstream content root: `plugins/compound-engineering`
- Current local sync state: `.sync-state.json`
  - `last_synced_commit`: `7924f5ccc9cf0cc3cb8bcd4aadf9b51e3a1af099`
  - `last_synced_date`: `2026-04-17T00:00:00Z`
  - mapping rules for upstream `agents/*` and `skills/*`
  - skip patterns for Every/Rails/local-mismatch content
- Latest upstream release observed during planning: `compound-engineering-v3.5.0`, published `2026-05-04T16:56:07Z`
- Prior sync PRs show the expected workflow:
  - PR #7: `v2.38 → v2.60`, structural `commands/` to `skills/` migration
  - PR #9: `v2.60 → v2.68`, HITL review loop + new skills

## Design Decision

Do **not** try to use a GitHub webhook for upstream release events unless EveryInc grants webhook access. We don't own `EveryInc/compound-engineering-plugin`, so webhook registration against that repo is not available.

Use polling instead:

- Daily Hermes cron for low-noise release freshness.
- The pre-run script is deterministic and cheap.
- The expensive agent sync only does real work when the script reports new `compound-engineering-v*` releases.
- Multiple missed releases collapse into one PR, with a release-window summary.

Recommended schedule: `17 15 * * *` UTC. That checks once per day after the existing 11:00 UTC CLI updater and before the 17:00 UTC dependency scout window, without creating no-op spam.

## Target Behavior

1. Cron fires.
2. Pre-run script fetches recent upstream releases via `gh api repos/EveryInc/compound-engineering-plugin/releases`.
3. Script filters:
   - include tags matching `compound-engineering-v*`
   - exclude drafts
   - exclude prereleases unless explicitly configured later
   - ignore sibling tags like `cli-v*`, `marketplace-v*`, etc.
4. Script compares latest release tag/target commit to `.sync-state.json`.
5. If no new release:
   - job returns a one-line no-op summary
   - no branch, PR, or repo edits
6. If new releases exist:
   - ensure `.agents` main is clean and fast-forwarded
   - create branch `sync/compound-engineering-<latest-version>`
   - read `.claude/commands/sync-upstream.md` and `.claude/skills/sync-upstream/SKILL.md` before doing any sync analysis or file changes
   - run the `.claude` sync workflow/skill as the canonical process for categorizing upstream changes and producing `.claude/sync-report.md`
   - fetch/checkout upstream latest release tag into a cache or temp worktree
   - apply only the mapping/filter/adaptation rules from `.claude/skills/sync-upstream/SKILL.md`, with `.sync-state.json` as machine-readable state
   - update `.sync-state.json`
   - run verification
   - open PR against `SiTaggart/.agents:main`
   - deliver a concise Telegram summary with PR link and notable upstream changes

## Required Local Adaptation Rules

The **source of truth** for sync mechanics is:

- `.claude/commands/sync-upstream.md`
- `.claude/skills/sync-upstream/SKILL.md`

Every automated run must read those files first and follow them. The bullets below are only a snapshot from the current skill, included so the cron prompt has enough orientation; if this plan conflicts with the `.claude` sync skill, the `.claude` sync skill wins.

- Map upstream paths:
  - `plugins/compound-engineering/agents/review/*` → `agents/*`
  - `plugins/compound-engineering/agents/research/*` → `agents/*`
  - `plugins/compound-engineering/agents/design/*` → `agents/*`
  - `plugins/compound-engineering/agents/workflow/*` → `agents/*`
  - `plugins/compound-engineering/agents/docs/*` → `agents/*`
  - `plugins/compound-engineering/agents/document-review/*` → `agents/*`
  - `plugins/compound-engineering/skills/*` → `skills/*`
- Strip or adapt upstream namespacing:
  - `compound-engineering:review:<agent>` → `<agent>`
  - analogous `compound-engineering:*:<agent>` references should become flat local agent names when the file exists in `agents/`
- Rewrite generated/document artifact paths:
  - bare `docs/{brainstorms,ideation,plans,solutions,handoffs,tasks,todos}/` → `.ai/{...}/`
  - `.context/compound-engineering/` paths should be reviewed and usually rewritten to `.ai/` equivalents where consistent with local conventions
- Honor skip patterns from `.sync-state.json`.
- Preserve local-only artifacts unless upstream deletion is explicitly for an already-managed upstream artifact.
- Do not import company-specific content for Every/Rails workflows unless Simon explicitly wants it.

## Files to Add / Modify

### Create: `/opt/data/profiles/builder/scripts/compound_engineering_release_sync.py`

Purpose: pre-run detector for Hermes cron.

Responsibilities:

- Read `.agents/.sync-state.json`.
- Query GitHub releases using `gh api` first; fail clearly if `gh` is unavailable/auth-broken.
- Filter to `compound-engineering-v*` releases.
- Determine whether new releases exist after `last_synced_release` or `last_synced_commit`.
- Emit compact JSON for the agent prompt:

```json
{
  "status": "new_release" | "no_change" | "blocked",
  "repo": "/opt/data/workspace/github/refs/SiTaggart/.agents",
  "upstream": "EveryInc/compound-engineering-plugin",
  "last_synced_release": "compound-engineering-v2.68.0",
  "last_synced_commit": "7924f5ccc9cf0cc3cb8bcd4aadf9b51e3a1af099",
  "latest_release": {
    "tag": "compound-engineering-v3.5.0",
    "version": "3.5.0",
    "published_at": "2026-05-04T16:56:07Z",
    "target_commitish": "62170315ba986caa525d2b2e43a5da0598d1b184",
    "url": "https://github.com/EveryInc/compound-engineering-plugin/releases/tag/compound-engineering-v3.5.0"
  },
  "release_window": [
    {
      "tag": "compound-engineering-v3.5.0",
      "body_excerpt": "...",
      "linked_prs": [747]
    }
  ]
}
```

### Modify: `.sync-state.json`

Add durable release fields while preserving existing fields:

```json
{
  "upstream_repo": "https://github.com/EveryInc/compound-engineering-plugin",
  "content_root": "plugins/compound-engineering",
  "last_synced_release": "compound-engineering-v3.5.0",
  "last_synced_commit": "62170315ba986caa525d2b2e43a5da0598d1b184",
  "last_synced_date": "2026-05-05T00:00:00Z",
  "last_checked_release": "compound-engineering-v3.5.0",
  "skip_patterns": { "...": "preserve existing" },
  "path_mappings": { "...": "preserve existing" }
}
```

Use `last_synced_release` as the primary comparison key going forward. Keep `last_synced_commit` for diff links and auditability.

### Optional Create: `.ai/sync/compound-engineering/<tag>.md`

Purpose: PR-local audit trail for each sync run.

Include:

- release range
- upstream PRs/commits considered
- added/updated/removed artifacts
- skipped files and reasons
- local adaptations applied
- verification results
- unresolved review questions

Only add this if it proves useful during implementation; don't create permanent process sludge just because we can.

## Implementation Tasks

### Task 1: Add release metadata to sync state

**Objective:** Make `.sync-state.json` release-aware.

**Files:**
- Modify: `.sync-state.json`

**Steps:**
1. Add `last_synced_release` using the best-known previous release from sync history (`compound-engineering-v2.68.0` unless verified otherwise from upstream tags around `7924f5c`).
2. Change `upstream_repo` from local machine path to canonical URL: `https://github.com/EveryInc/compound-engineering-plugin`.
3. Preserve `skip_patterns` and `path_mappings` exactly.
4. Validate JSON with `python3 -m json.tool .sync-state.json`.

### Task 2: Build the release detector script

**Objective:** Produce deterministic no-change/new-release context for cron.

**Files:**
- Create: `/opt/data/profiles/builder/scripts/compound_engineering_release_sync.py`

**Steps:**
1. Implement JSON loading for `.sync-state.json`.
2. Invoke `gh api repos/EveryInc/compound-engineering-plugin/releases --paginate` with timeout-safe subprocess handling.
3. Filter/sort `compound-engineering-v*` releases by `published_at` descending.
4. Compare latest release to `last_synced_release`.
5. Emit compact JSON only; no prose.
6. Add failure states for missing repo, dirty repo, broken `gh`, and malformed state file.

**Verification:**

```bash
python3 /opt/data/profiles/builder/scripts/compound_engineering_release_sync.py | python3 -m json.tool
```

Expected: valid JSON with `status` set to `new_release`, `no_change`, or `blocked`.

### Task 3: Wrap the `.claude` sync skill in the sync runner

**Objective:** Ensure automation uses the existing Claude-local sync workflow instead of inventing parallel rules.

**Files:**
- Read first: `.claude/commands/sync-upstream.md`
- Read first: `.claude/skills/sync-upstream/SKILL.md`
- Prefer create: `scripts/sync-compound-engineering-upstream.ts`
- Or document existing manual sync procedure if a sync skill/script already exists elsewhere

**Steps:**
1. Load `.claude/commands/sync-upstream.md` and `.claude/skills/sync-upstream/SKILL.md` at runtime or embed a clear preflight that refuses to run if they are missing.
2. Resolve upstream checkout/cache path, e.g. `/opt/data/workspace/github/cache/EveryInc/compound-engineering-plugin`.
3. Fetch tags and checkout the target release tag.
4. Use the `.claude` sync skill's path mapping, skip patterns, content-marker heuristic, relevance scoring, adaptation notes, and report template.
5. Walk mapped source directories under `plugins/compound-engineering`.
6. Apply filename skip patterns before copy.
7. Apply content marker skip/review rules.
8. Apply local text adaptations.
9. Remove previously managed upstream files that disappeared upstream, but only if they are tracked as managed imports.
10. Write `.claude/sync-report.md` in the skill's report format.
11. Update README component counts if changed.
12. Update `.sync-state.json`.

**Verification:**

```bash
bun run type-check
bun run lint
bun test
bun run render codex
bun run render claude
```

### Task 4: Create the Hermes cron job

**Objective:** Poll upstream releases and trigger the sync workflow automatically.

**Cron:**

```text
17 15 * * *
```

**Cron script:**

```text
compound_engineering_release_sync.py
```

**Enabled toolsets:**

```json
["terminal", "file", "web", "github"]
```

If `github` is not a valid scheduler toolset here, use `terminal` only; `gh` handles GitHub operations.

**Prompt requirements:**

- If script output says `status: no_change`, report one concise no-op line and make no changes.
- If `status: blocked`, report the blocker and make no changes.
- If `status: new_release`, run the sync workflow:
  - read `.claude/commands/sync-upstream.md`
  - read `.claude/skills/sync-upstream/SKILL.md`
  - treat the `.claude` sync skill as authoritative for path mapping, skip patterns, relevance scoring, adaptation notes, and report format
  - create a branch
  - import/adapt upstream artifacts
  - write/update `.claude/sync-report.md` as specified by the skill
  - run verification
  - commit
  - push
  - open PR with release summary, adaptation notes, sync-report reference, and test results
- Never push directly to `main`.
- Never auto-merge.
- Keep PRs reviewable; if the upstream release window is huge, still make one PR but call out high-risk areas.

### Task 5: First live run as a manual dry run

**Objective:** Prove the workflow before making it recurring.

**Steps:**
1. Run the detector locally.
2. Run the sync in a throwaway branch/worktree.
3. Inspect diff size and content leakage.
4. Run full verification.
5. Open the first PR manually or via a one-shot cron run.
6. Only after the first PR shape is good, enable the recurring cron.

## Verification Gates Before Shipping

Required for every sync PR:

```bash
python3 -m json.tool .sync-state.json
bun run type-check
bun run lint
bun test
bun run render codex
bun run render claude
git status --short
```

Additional content checks:

```bash
grep -R "every.to\|Every's\|bundle exec\|standardrb\|erblint\|brakeman\|ActiveRecord\|schema.rb" agents skills || true
grep -R "compound-engineering:" agents skills || true
grep -R "docs/brainstorms\|docs/ideation\|docs/plans\|docs/solutions\|docs/handoffs\|docs/tasks\|docs/todos" agents skills || true
```

Any positive grep result must be reviewed, not blindly deleted; some strings may be acceptable in release-note or attribution contexts.

## Open Questions

1. Polling cadence: once daily at `17 15 * * *` UTC.
2. Scope: sync only `compound-engineering-v*` releases, not `cli-v*` releases. This matches the stated goal and avoids unrelated CLI churn.
3. Automation level: recommended PR-only, no auto-merge. These artifacts shape agent behavior; silent merges are a bad idea.
4. First catch-up PR likely jumps from v2.68-ish to v3.5.0 and may be large. Treat that as a supervised bootstrap sync before trusting recurring automation.
5. `.claude/skills/sync-upstream/SKILL.md` and `.claude/commands/sync-upstream.md` are authoritative. If the automated workflow needs rules not represented there, update the skill first rather than duplicating divergent sync logic elsewhere.

## Done Criteria

- Release detector emits valid JSON and no-ops cleanly.
- First sync PR is opened against `SiTaggart/.agents` with a useful summary.
- Verification passes or failures are explicitly captured in the PR.
- `.sync-state.json` records `last_synced_release` and latest commit.
- Recurring cron exists, enabled, and delivers back to Simon's Telegram DM.
