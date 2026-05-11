# Upstream Sync Report
Generated: 2026-05-11T15:17:40Z
Range: 834ca4e..85548a5 (2 commits)

## Summary
- **Commits:** 2
- **Updates:** 2 files changed that exist locally
- **New:** 0 files to consider adding
- **Skipped:** 5 files filtered by local scope

## Commits
- `85548a5` chore: release main (#814)
- `9b45a83` feat(ce-compound): add mode:headless for non-interactive use (#813)

## Updates to Existing Content
Items that exist locally and changed upstream.

### skills/ce-compound/SKILL.md
- **Upstream path:** skills/ce-compound/SKILL.md
- **Status:** M | +61 / -10 lines
- **What changed:** Added `mode:headless` for non-interactive documentation capture, including mode detection, prompt skipping, discoverability handling, refresh recommendations, Phase 3 skipping, and structured headless success/failure output.
- **Action needed:** Applied locally with `.ai/solutions/` path adaptation and local unprefixed agent names preserved.

### skills/ce-compound-refresh/SKILL.md
- **Upstream path:** skills/ce-compound-refresh/SKILL.md
- **Status:** M | +18 / -17 lines
- **What changed:** Renamed non-interactive refresh mode from `mode:autofix` to `mode:headless`, added an argument hint, and clarified no-match scope behavior for headless runs.
- **Action needed:** Applied locally with `.ai/solutions/` path adaptation.

## New Content to Review
Items that don't exist locally and may be worth adding.

None.

## Auto-Skipped
Filtered by skip patterns or local scope — listed for transparency.

- `.claude-plugin/plugin.json` — outside local sync mapping; upstream plugin package metadata contains upstream branding.
- `.codex-plugin/plugin.json` — outside local sync mapping; upstream plugin package metadata contains upstream branding.
- `.cursor-plugin/plugin.json` — outside local sync mapping; upstream plugin package metadata contains upstream branding.
- `AGENTS.md` — outside local sync mapping; upstream repository instructions contain upstream-specific conventions.
- `CHANGELOG.md` — outside local sync mapping; release notes treated as untrusted data only.
