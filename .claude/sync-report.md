# Upstream Sync Report
Generated: 2026-06-06T15:30:33Z
Range: f4d458c..5ec8f7c (5 commits)
Release: compound-engineering-v3.11.1

## Summary
- **Commits:** 5
- **Updates:** 8 files changed that exist locally
- **New:** 4 items to consider or add
- **Skipped:** 7 items filtered or adapted out

## Commits
- `5ec8f7c1` chore: release main (#907)
- `debc915c` fix: reduce verbosity and remove HTML comments from generated docs (#906)
- `c9053229` chore: release main (#902)
- `fbd0fafd` feat(ce-plan): approach-altitude plan-for-a-plan with ce-work non-code carve-out (#905)
- `63b6b260` fix(ce-polish): promote from beta to stable (#880)

## Updates to Existing Content
Items that exist locally and changed upstream.

### skills/ce-brainstorm/SKILL.md
- **Upstream path:** skills/ce-brainstorm/SKILL.md
- **Status:** M | +2 / -0 lines
- **What changed:** Adds prose-economy guidance before writing brainstorm docs.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/ce-brainstorm/references/brainstorm-sections.md
- **Upstream path:** skills/ce-brainstorm/references/brainstorm-sections.md
- **Status:** M | +38 / -0 lines
- **What changed:** Adds prose-economy and resolve-in-place rules for requirements docs.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/document-review/references/open-questions-defer.md
- **Upstream path:** skills/ce-doc-review/references/open-questions-defer.md
- **Status:** M | +3 / -36 lines
- **What changed:** Removes hidden HTML-comment dedup metadata from deferred findings; dedup now reconstructs from visible text.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/ce-plan/SKILL.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M | +21 / -0 lines
- **What changed:** Adds approach-altitude request routing before software/non-software split.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/ce-plan/references/deepening-workflow.md
- **Upstream path:** skills/ce-plan/references/deepening-workflow.md
- **Status:** M | +3 / -0 lines
- **What changed:** Allows deepening to tighten prose and remove superseded text, not only add content.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/ce-plan/references/plan-sections.md
- **Upstream path:** skills/ce-plan/references/plan-sections.md
- **Status:** M | +46 / -0 lines
- **What changed:** Adds plan prose-economy rules and the optional execution metadata field.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/ce-work/SKILL.md
- **Upstream path:** skills/ce-work/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Routes plans marked execution: knowledge-work to the non-code carve-out.
- **Action needed:** Ported with local adaptations; review diff before merge.

### skills/ce-work-beta/SKILL.md
- **Upstream path:** skills/ce-work-beta/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Routes plans marked execution: knowledge-work to the non-code carve-out.
- **Action needed:** Ported with local adaptations; review diff before merge.

## New Content to Review
Items that don't exist locally and may be worth adding.

### skills/ce-plan/references/approach-altitude.md
- **Upstream path:** skills/ce-plan/references/approach-altitude.md
- **Category:** skill
- **Relevance:** HIGH — general-purpose planning/workflow content
- **Summary:** General-purpose planning flow for approach-plan checkpoints before producing expensive deliverables.

### skills/ce-work/references/non-code-execution.md
- **Upstream path:** skills/ce-work/references/non-code-execution.md
- **Category:** skill
- **Relevance:** HIGH — general-purpose planning/workflow content
- **Summary:** Knowledge-work execution carve-out for plans marked execution: knowledge-work, adapted to write deliverables under .ai/.

### skills/ce-work-beta/references/non-code-execution.md
- **Upstream path:** skills/ce-work-beta/references/non-code-execution.md
- **Category:** skill
- **Relevance:** HIGH — general-purpose planning/workflow content
- **Summary:** Beta work-skill copy of the knowledge-work execution carve-out, adapted to .ai/.

### skills/ce-polish/
- **Upstream path:** skills/ce-polish/
- **Category:** skill
- **Relevance:** HIGH — general-purpose planning/workflow content
- **Summary:** Stable polish skill promoted from beta for dev-server/browser iteration; Rails recipe and detection content omitted.

## Auto-Skipped
Filtered by skip patterns or local sync constraints — listed for transparency.

- `.claude-plugin/plugin.json` — plugin packaging metadata
- `.codex-plugin/plugin.json` — plugin packaging metadata
- `.cursor-plugin/plugin.json` — plugin packaging metadata
- `CHANGELOG.md` — release metadata, not local shared content
- `README.md` — upstream package README/branding, not local shared content
- `skills/ce-polish/references/dev-server-rails.md` — Rails-specific dev-server recipe
- `skills/ce-polish-beta/*` — rename source only; local keeps existing beta while adding stable ce-polish

## Local Adaptations Applied
- Rewrote generated artifact paths from upstream `docs/` locations to local `.ai/` conventions.
- Removed upstream identity/branding strings from imported handoff content.
- Added stable `skills/ce-polish/` without the Rails-specific recipe or Rails project detection.
- Mapped upstream `skills/ce-doc-review/references/open-questions-defer.md` to local `skills/document-review/references/open-questions-defer.md`.
