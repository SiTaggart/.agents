# Upstream Sync Report
Generated: 2026-05-19T15:23:29Z
Range: 705f28a..f61d1b3 (5 commits)

## Summary
- **Commits:** 5
- **Updates:** 6 files changed that exist locally
- **New:** 0 files to consider adding
- **Skipped:** 4 files filtered by patterns

## Commits
- `39cb9da` fix(ce-plan): inline synthesis gate output into SKILL.md (#822)
- `6fa1277` fix(ce-web-researcher): use any web tool, not just Claude built-ins (#836)
- `82b8af4` fix(ce-coherence-reviewer): remove Bash from tool allowlist (#837)
- `fd88fd8` fix(ce-commit-push-pr): rewrite pr-description around a core principle (#841)
- `f61d1b3` chore: release main (#834)

## Updates to Existing Content
Items that exist locally and changed upstream.

### agents/coherence-reviewer.md
- **Upstream path:** agents/ce-coherence-reviewer.agent.md
- **Status:** M | +1 / -1 lines
- **What changed:** Removed shell access from the pure document coherence reviewer tool allowlist.
- **Action needed:** Review diff, merge improvements

### agents/web-researcher.md
- **Upstream path:** agents/ce-web-researcher.agent.md
- **Status:** M | +22 / -28 lines
- **What changed:** Generalized web research preconditions to accept any dedicated search/fetch tooling and simplified the search/fetch workflow around adaptive stopping.
- **Action needed:** Review diff, merge improvements

### skills/git-commit-push-pr/SKILL.md
- **Upstream path:** skills/ce-commit-push-pr/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Requires reading the PR-description reference in full because the value-led core principle governs every step.
- **Action needed:** Review diff, merge improvements

### skills/git-commit-push-pr/references/pr-description-writing.md
- **Upstream path:** skills/ce-commit-push-pr/references/pr-description-writing.md
- **Status:** M | +42 / -141 lines
- **What changed:** Reframed PR descriptions around the core principle that the body should explain value and rationale the diff cannot show; local adaptation strips upstream badge and attribution instructions.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/SKILL.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M | +89 / -8 lines
- **What changed:** Inlined synthesis gate output requirements into the planning workflow, including mandatory confirmation behavior, summary shape rules, pre-emit scans, and headless routing.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/synthesis-summary.md
- **Upstream path:** skills/ce-plan/references/synthesis-summary.md
- **Status:** M | +90 / -48 lines
- **What changed:** Renamed the artifact to scoping synthesis, added detail tests and tier-aware confirmation behavior, tightened anti-pattern guidance, and clarified headless routing.
- **Action needed:** Review diff, merge improvements

## New Content to Review
Items that don't exist locally and may be worth adding.

None.

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `.claude-plugin/plugin.json` — no local mapped target; plugin packaging metadata is outside Simon's flat `agents/` and direct `skills/` content conventions
- `.codex-plugin/plugin.json` — no local mapped target; plugin packaging metadata is outside Simon's flat `agents/` and direct `skills/` content conventions
- `.cursor-plugin/plugin.json` — no local mapped target; plugin packaging metadata is outside Simon's flat `agents/` and direct `skills/` content conventions
- `CHANGELOG.md` — no local mapped target; release context captured in this sync report and PR instead
