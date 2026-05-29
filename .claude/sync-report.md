# Upstream Sync Report
Generated: 2026-05-29T15:29:59Z
Range: e2c9cd2..85987d4 (8 commits)

## Summary
- **Commits:** 8
- **Updates:** 10 files changed that exist locally
- **New:** 0 files to consider adding
- **Skipped:** 4 files filtered by patterns

## Commits
- `85987d4` chore: release main (#874)
- `b3e396d` fix(ce-plan): honor explicit external-research requests and route them by intent (#875)
- `253dba8` fix(ce-sessions): emit repo root path instead of basename subshell (#873)
- `2bab351` chore: release main (#872)
- `e5e3fc3` fix(ce-brainstorm,ce-plan): add conceptual-diagram affordance to brainstorm docs (#871)
- `48cd914` chore: release main (#869)
- `1051132` fix(html-rendering): constrain measure and surface execution notes (#870)
- `5c88212` fix(ce-brainstorm,ce-plan): restore default-on requirements grouping (#868)

## Updates to Existing Content
Items that exist locally and changed upstream.

### agents/web-researcher.md
- **Upstream path:** agents/ce-web-researcher.md
- **Status:** M | +5 / -4 lines
- **What changed:** Expanded the agent to support planning research, added `ce-plan` as a caller for landscape/option-discovery intent, and made low-signal guidance caller-neutral.
- **Action needed:** Merged locally with flattened agent naming.

### skills/ce-brainstorm/references/brainstorm-sections.md
- **Upstream path:** skills/ce-brainstorm/references/brainstorm-sections.md
- **Status:** M | +32 / -3 lines
- **What changed:** Tightened default requirements grouping and added conceptual diagram guidance that complements, but does not replace, prose.
- **Action needed:** Merged locally.

### skills/ce-brainstorm/references/html-rendering.md
- **Upstream path:** skills/ce-brainstorm/references/html-rendering.md
- **Status:** M | +60 / -4 lines
- **What changed:** Added readable prose measure defaults, grouped-requirements rendering guidance, execution-note callout handling, conceptual diagram guardrails, and final diagram/prose checks.
- **Action needed:** Merged locally with `.ai/` artifact paths preserved.

### skills/ce-brainstorm/references/markdown-rendering.md
- **Upstream path:** skills/ce-brainstorm/references/markdown-rendering.md
- **Status:** M | +6 / -4 lines
- **What changed:** Made requirement concern-grouping the default markdown shape when requirements span more than one concern.
- **Action needed:** Merged locally.

### skills/ce-plan/SKILL.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M | +34 / -9 lines
- **What changed:** Reworked external research routing around explicit requests, intent classification, `web-researcher` landscape scans, unavailable-tool handling, load-bearing external findings, and confidence scoring.
- **Action needed:** Merged locally with local `web-researcher` naming and `.ai/` artifact paths preserved.

### skills/ce-plan/references/deepening-workflow.md
- **Upstream path:** skills/ce-plan/references/deepening-workflow.md
- **Status:** M | +1 / -0 lines
- **What changed:** Added the web researcher to the deepening agent roster for landscape/prior-art gaps.
- **Action needed:** Merged locally with local `web-researcher` naming.

### skills/ce-plan/references/html-rendering.md
- **Upstream path:** skills/ce-plan/references/html-rendering.md
- **Status:** M | +60 / -4 lines
- **What changed:** Added readable prose measure defaults, grouped-requirements rendering guidance, execution-note callout handling, conceptual diagram guardrails, and final diagram/prose checks.
- **Action needed:** Merged locally with `.ai/` artifact paths preserved.

### skills/ce-plan/references/markdown-rendering.md
- **Upstream path:** skills/ce-plan/references/markdown-rendering.md
- **Status:** M | +6 / -4 lines
- **What changed:** Made requirement concern-grouping the default markdown shape when requirements span more than one concern.
- **Action needed:** Merged locally.

### skills/ce-plan/references/plan-sections.md
- **Upstream path:** skills/ce-plan/references/plan-sections.md
- **Status:** M | +7 / -5 lines
- **What changed:** Clarified that requirement grouping should be skipped only when every requirement is about the same thing.
- **Action needed:** Merged locally.

### skills/ce-sessions/SKILL.md
- **Upstream path:** skills/ce-sessions/SKILL.md
- **Status:** M | +2 / -2 lines
- **What changed:** Pre-resolved repo context now captures the repo root path and derives the folder name from that path during session discovery.
- **Action needed:** Merged locally.

## New Content to Review
Items that don't exist locally and may be worth adding.

None.

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `.claude-plugin/plugin.json` — unmapped plugin packaging metadata
- `.codex-plugin/plugin.json` — unmapped plugin packaging metadata
- `.cursor-plugin/plugin.json` — unmapped plugin packaging metadata
- `CHANGELOG.md` — release metadata, not shared agent/skill content
