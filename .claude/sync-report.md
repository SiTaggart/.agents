# Upstream Sync Report
Generated: 2026-05-12T15:28:20Z
Range: 85548a5..b07aac5 (3 commits)

## Summary
- **Commits:** 3
- **Updates:** 4 files changed that exist locally
- **New:** 0 files to consider adding
- **Skipped:** 4 files filtered by patterns

## Commits
- `b07aac5` chore: release main (#817)
- `60c1c93` fix(ce-plan): compress synthesis confirmation to prose + call-outs (#819)
- `d090bde` fix(ce-code-review): replace resolve-base.sh with prose-driven base detection (#815)

## Updates to Existing Content
Items that exist locally and changed upstream.

### skills/ce-review/SKILL.md
- **Upstream path:** skills/ce-code-review/SKILL.md
- **Status:** M | +7 / -15 lines
- **What changed:** Replaced the deleted `resolve-base.sh` dependency with prose-driven branch/default-base detection instructions.
- **Action needed:** Review diff, merge improvements

### skills/ce-review/scripts/resolve-base.sh
- **Upstream path:** skills/ce-code-review/scripts/resolve-base.sh
- **Status:** D | +0 / -100 lines
- **What changed:** Removed the obsolete base-resolution helper script after moving the logic into the review skill.
- **Action needed:** Review deletion

### skills/ce-plan/SKILL.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M | +6 / -6 lines
- **What changed:** Updated the synthesis checkpoints to require two-stage internal draft plus user-facing call-outs.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/synthesis-summary.md
- **Upstream path:** skills/ce-plan/references/synthesis-summary.md
- **Status:** M | +171 / -62 lines
- **What changed:** Reworked synthesis guidance around internal three-bucket drafts, call-out keep tests, cap-and-recut rules, skip behavior, and headless routing.
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
