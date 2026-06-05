# Upstream Sync Report
Generated: 2026-06-04T15:41:02Z
Range: 422ffc7..f4d458c (9 commits)

## Summary
- **Commits:** 9
- **Updates:** 29 existing local files changed
- **New:** 10 new local files/directories added for review content
- **Skipped:** 6 upstream packaging files not mapped into local shared content

## Commits
- `f4d458c` chore: release main (#894)
- `d54501c` refactor(ce-code-review): lean SKILL.md and load large references on demand (#900)
- `0939187` feat(ce-promote): add ce-promote skill for post-ship announcement copy (#888)
- `3eedade` refactor(ce-code-review): lean apply model -- safe self-apply interactive, report-only for callers (#881)
- `4cc6f7a` chore(model): refresh MiniMax examples to current M3 flagship (#892)
- `8e6c51` docs(solutions): drop date suffixes from learning filenames (#897)
- `f92d88` docs(solutions): refresh skill-design learnings (#896)
- `7c4bb1` feat(skill): introduce CONCEPTS.md as shared vocabulary substrate (#838)
- `3e77a7` fix(ce-resolve-pr-feedback): drop clustering, default to merit-based fixing (#893)

## Updates to Existing Content
Items that exist locally and changed upstream.

### agents/learnings-researcher.md
- **Upstream path:** agents/ce-learnings-researcher.md
- **Status:** M | +6 / -0 lines
- **What changed:** Adds optional `CONCEPTS.md` grounding before searching historical learnings.
- **Action needed:** Ported with `.ai/solutions/` path convention preserved.

### agents/pr-comment-resolver.md
- **Upstream path:** agents/ce-pr-comment-resolver.md
- **Status:** M | substantial rewrite
- **What changed:** Removes cluster mode and reframes feedback handling around merit-based fixing with concrete tripwires for not fixing.
- **Action needed:** Ported with local `pr-comment-resolver` agent id.

### skills/resolve-pr-feedback/*
- **Upstream path:** skills/ce-resolve-pr-feedback/*
- **Status:** M | removes cross-invocation clustering
- **What changed:** Full mode is now 9 steps, dispatches one item per unresolved feedback item, and no longer emits `cross_invocation` from `get-pr-comments`.
- **Action needed:** Ported with local skill and agent names.

### skills/ce-review/*
- **Upstream path:** skills/ce-code-review/*
- **Status:** M/D/A | major simplification
- **What changed:** Replaces multiple mutation modes with default local apply plus `mode:agent` JSON report-only mode; moves action routing guidance into `references/action-class-rubric.md`; deletes bulk preview, tracker defer, and walkthrough references.
- **Action needed:** Ported to local `ce-review` name, `.ai/` paths, and unprefixed local reviewer agent ids.

### skills/ce-compound/SKILL.md
- **Upstream path:** skills/ce-compound/SKILL.md
- **Status:** M | vocabulary capture added
- **What changed:** Adds `CONCEPTS.md` capture after learning assembly, session-history continuation clarification, and discoverability handling.
- **Action needed:** Ported with `.ai/solutions/` path convention.

### skills/ce-compound-refresh/SKILL.md
- **Upstream path:** skills/ce-compound-refresh/SKILL.md
- **Status:** M | vocabulary capture added
- **What changed:** Adds `CONCEPTS.md` bootstrap handling, vocabulary audit dimension, Phase 4.5 capture, output reporting, and discoverability checks.
- **Action needed:** Ported with `.ai/solutions/` path convention.

### skills/ce-brainstorm/SKILL.md
- **Upstream path:** skills/ce-brainstorm/SKILL.md
- **Status:** M
- **What changed:** Refreshes post-generation behavior and related workflow wording from upstream.
- **Action needed:** Ported with local path conventions.

### skills/ce-optimize/SKILL.md
- **Upstream path:** skills/ce-optimize/SKILL.md
- **Status:** M
- **What changed:** Refreshes model examples and current flagship wording.
- **Action needed:** Ported.

### skills/ce-plan/SKILL.md and references/deepening-workflow.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M
- **What changed:** Adds post-generation handoff clarifications and Proof option wording.
- **Action needed:** Ported; removed an upstream-specific Proof attribution and corrected two prefixed agent ids in the local reference.

### skills/ce-setup/references/config-template.yaml
- **Upstream path:** skills/ce-setup/references/config-template.yaml
- **Status:** M
- **What changed:** Adds local config keys introduced by release workflows.
- **Action needed:** Ported.

### skills/ce-work/* and skills/ce-work-beta/*
- **Upstream path:** skills/ce-work/*, skills/ce-work-beta/*
- **Status:** M/A
- **What changed:** Adds code-review follow-up workflow references and updates shipping workflow around Tier 1/Tier 2 review routing.
- **Action needed:** Ported; stripped upstream badge requirement.

### skills/lfg/*
- **Upstream path:** skills/lfg/*
- **Status:** M/A
- **What changed:** Adds review follow-up reference and aligns tracker deferral wording.
- **Action needed:** Ported with local `ce-review` naming.

## New Content to Review
Items that did not exist locally and were added or adapted.

### skills/ce-promote/SKILL.md
- **Upstream path:** skills/ce-promote/SKILL.md
- **Category:** skill
- **Relevance:** HIGH -- general-purpose post-ship announcement drafting
- **Summary:** Drafts launch copy for X, changelog, LinkedIn, email, blog intros, and demo scripts.
- **Adaptation:** Ported as direct drafting only; the upstream Spiral CLI integration was not included because it depends on upstream-specific package and app endpoints.

### skills/ce-compound/references/concepts-vocabulary.md
- **Upstream path:** skills/ce-compound/references/concepts-vocabulary.md
- **Category:** skill reference
- **Relevance:** HIGH -- supports `CONCEPTS.md` vocabulary capture
- **Summary:** Defines what earns a slot in `CONCEPTS.md`, how seeding and accretion work, and entry quality rules.
- **Adaptation:** Ported with `.ai/solutions/` references.

### skills/ce-compound-refresh/references/concepts-vocabulary.md
- **Upstream path:** skills/ce-compound-refresh/references/concepts-vocabulary.md
- **Category:** skill reference
- **Relevance:** HIGH -- supports `CONCEPTS.md` refresh/bootstrap
- **Summary:** Same vocabulary rules used by refresh workflows.
- **Adaptation:** Ported with `.ai/solutions/` references.

### skills/ce-review/references/action-class-rubric.md
- **Upstream path:** skills/ce-code-review/references/action-class-rubric.md
- **Category:** skill reference
- **Relevance:** HIGH -- new review routing contract
- **Summary:** Defines `autofix_class` as follow-up signal rather than apply permission.
- **Adaptation:** Ported under local `ce-review`.

### skills/ce-sessions/evals/*
- **Upstream path:** skills/ce-sessions/evals/*
- **Category:** skill eval
- **Relevance:** MEDIUM -- evaluation fixtures for session search behavior
- **Summary:** Adds README, eval cases, and grader guidance for `ce-sessions`.

### skills/ce-work/references/review-findings-followup.md
- **Upstream path:** skills/ce-work/references/review-findings-followup.md
- **Category:** skill reference
- **Relevance:** HIGH -- follow-up workflow for review findings
- **Summary:** Defines batched resolver handling for `ce-review mode:agent` findings.

### skills/ce-work-beta/references/review-findings-followup.md
- **Upstream path:** skills/ce-work-beta/references/review-findings-followup.md
- **Category:** skill reference
- **Relevance:** HIGH -- beta follow-up workflow for review findings
- **Summary:** Mirrors `ce-work` review follow-up handling for beta flow.

### skills/lfg/references/review-followup.md
- **Upstream path:** skills/lfg/references/review-followup.md
- **Category:** skill reference
- **Relevance:** HIGH -- autonomous pipeline review follow-up
- **Summary:** Defines how `lfg` handles review residuals after `ce-review`.

## Auto-Skipped
Filtered by mapping scope or local adaptation rules.

- `.claude-plugin/plugin.json` -- upstream packaging manifest, no local shared-content mapping
- `.codex-plugin/plugin.json` -- upstream packaging manifest, no local shared-content mapping
- `.cursor-plugin/plugin.json` -- upstream packaging manifest, no local shared-content mapping
- `AGENTS.md` -- upstream root instructions, local AGENTS.md is authoritative for this repo
- `README.md` -- upstream package README, not shared local agent/skill content
- `CHANGELOG.md` -- upstream package changelog, represented by this sync report and state update
- `skills/ce-promote/references/spiral-cli.md` -- intentionally not ported; depends on upstream-specific Spiral package and app endpoints
