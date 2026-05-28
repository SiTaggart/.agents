# Upstream Sync Report
Generated: 2026-05-27T15:36:21Z
Range: 08bb589..e2c9cd2 (7 commits)

## Summary
- **Commits:** 7
- **Updates:** 29 files changed that exist locally
- **New:** 10 files added for review or adoption
- **Skipped:** 7 files filtered by patterns or unmapped plugin metadata

## Commits
- `e2c9cd2` chore: release main (#852)
- `11e12e5` feat(ce-plan,ce-brainstorm): contract-driven sections + optional HTML output (#826)
- `673dcfa` fix(simplify-code): guard against over-simplification and behavior drift (#859)
- `26a8025` fix(commit): auto-create feature branch on default branch (#856)
- `5297a94` refactor(review): consolidate migration personas and trim stack reviewers (#854)
- `67d2736` fix(ce-commit-push-pr): require user-visible bug summaries (#853)
- `0aa6b55` feat(ce-dogfood-beta): add diff-scoped browser QA dogfood skill (#848)

## Updates to Existing Content
Items that exist locally and changed upstream.

### agents/adversarial-reviewer.md
- **Upstream path:** agents/ce-adversarial-reviewer.md
- **Status:** M | +1 / -1 lines
- **What changed:** Migration safety ownership now points to the consolidated data migration reviewer.
- **Action needed:** Merged locally with flattened agent naming.

### agents/maintainability-reviewer.md
- **Upstream path:** agents/ce-maintainability-reviewer.md
- **Status:** M | +55 / -30 lines
- **What changed:** Expanded maintainability review toward structural simplification, file-size regressions, type-boundary leaks, and concrete severity guidance.
- **Action needed:** Merged locally.

### agents/data-migration-expert.md
- **Upstream path:** agents/ce-data-migration-expert.md
- **Status:** D | removed upstream
- **What changed:** Replaced by consolidated migration reviewer.
- **Action needed:** Removed locally.

### agents/data-migrations-reviewer.md
- **Upstream path:** agents/ce-data-migrations-reviewer.md
- **Status:** D | removed upstream
- **What changed:** Replaced by singular data migration reviewer with schema drift coverage.
- **Action needed:** Removed locally.

### agents/kieran-python-reviewer.md
- **Upstream path:** agents/ce-kieran-python-reviewer.md
- **Status:** D | removed upstream
- **What changed:** Stack-specific language reviewers were trimmed from the review pipeline.
- **Action needed:** Removed locally.

### agents/kieran-typescript-reviewer.md
- **Upstream path:** agents/ce-kieran-typescript-reviewer.md
- **Status:** D | removed upstream
- **What changed:** Stack-specific language reviewers were trimmed from the review pipeline.
- **Action needed:** Removed locally.

### skills/ce-brainstorm/
- **Upstream path:** skills/ce-brainstorm/**
- **Status:** M/A/D | +922 / -245 lines
- **What changed:** Added exclusive markdown/HTML output modes, section-contract references, markdown and HTML renderers, and removed the older requirements-capture/visual references.
- **Action needed:** Merged locally with `.ai/` artifact paths.

### skills/ce-plan/
- **Upstream path:** skills/ce-plan/**
- **Status:** M/A/D | +1070 / -320 lines
- **What changed:** Added exclusive markdown/HTML output modes, plan section contracts, renderers, HTML-aware resume/deepening gates, and removed the old plan-template/visual references.
- **Action needed:** Merged locally with `.ai/` artifact paths.

### skills/ce-review/
- **Upstream path:** skills/ce-code-review/**
- **Status:** M | +80 / -80 lines
- **What changed:** Reduced reviewer roster, folded schema drift into the migration reviewer, updated output sections, and renamed migration persona references.
- **Action needed:** Merged locally as `ce-review` with local flattened agent names.

### skills/git-commit-push-pr/
- **Upstream path:** skills/ce-commit-push-pr/**
- **Status:** M | +4 / -1 lines
- **What changed:** Default-branch workflow now auto-creates a feature branch; PR description guidance requires user-visible bug summaries.
- **Action needed:** Merged locally as `git-commit-push-pr` and removed upstream attribution badge guidance.

### skills/commit/SKILL.md
- **Upstream path:** skills/ce-commit/SKILL.md
- **Status:** M | +2 / -2 lines
- **What changed:** Commit flow now auto-creates a feature branch on the default branch.
- **Action needed:** Merged locally as `commit` and preserved no-attribution convention.

### skills/ce-compound/SKILL.md
- **Upstream path:** skills/ce-compound/SKILL.md
- **Status:** M | +10 / -6 lines
- **What changed:** Updated compounding flow references around code review and generated artifacts.
- **Action needed:** Merged locally with local skill names and `.ai/` paths.

### skills/ce-demo-reel/
- **Upstream path:** skills/ce-demo-reel/references/**
- **Status:** M | +56 / -7 lines
- **What changed:** Browser reel and upload/approval guidance were tightened.
- **Action needed:** Merged locally.

### skills/ce-setup/references/config-template.yaml
- **Upstream path:** skills/ce-setup/references/config-template.yaml
- **Status:** M | +11 / -0 lines
- **What changed:** Added commented output-format settings for brainstorm and plan artifacts.
- **Action needed:** Merged locally.

### skills/ce-simplify-code/SKILL.md
- **Upstream path:** skills/ce-simplify-code/SKILL.md
- **Status:** M | +4 / -0 lines
- **What changed:** Added guardrails against over-simplification and behavior drift.
- **Action needed:** Merged locally.

### skills/ce-work/
- **Upstream path:** skills/ce-work/**
- **Status:** M | +23 / -0 lines
- **What changed:** Updated shipping workflow to use the review escalation and residual-work gates.
- **Action needed:** Merged locally with local skill names and `.ai/` residual artifact paths.

## New Content to Review
Items that don't exist locally and may be worth adding.

### agents/data-migration-reviewer.md
- **Upstream path:** agents/ce-data-migration-reviewer.md
- **Category:** agent
- **Relevance:** HIGH — replaces two local migration personas and folds in schema drift.
- **Summary:** Unified reviewer for schema drift, migration correctness, deployment-window safety, verification, and rollback.

### skills/ce-dogfood-beta/
- **Upstream path:** skills/ce-dogfood-beta/**
- **Category:** skill
- **Relevance:** HIGH — general-purpose browser QA workflow for diff-scoped branch dogfooding.
- **Summary:** Adds an end-to-end QA orchestrator that derives browser test matrices from diffs, records reports, fixes failures, and commits fixes.

### skills/ce-brainstorm/references/brainstorm-sections.md
- **Upstream path:** skills/ce-brainstorm/references/brainstorm-sections.md
- **Category:** skill
- **Relevance:** HIGH — required by updated `ce-brainstorm`.
- **Summary:** Defines brainstorm section contracts independent of output format.

### skills/ce-brainstorm/references/html-rendering.md
- **Upstream path:** skills/ce-brainstorm/references/html-rendering.md
- **Category:** skill
- **Relevance:** HIGH — enables `output:html`.
- **Summary:** Provides HTML rendering rules for requirements docs.

### skills/ce-brainstorm/references/markdown-rendering.md
- **Upstream path:** skills/ce-brainstorm/references/markdown-rendering.md
- **Category:** skill
- **Relevance:** HIGH — required by markdown output mode.
- **Summary:** Provides markdown rendering rules for requirements docs.

### skills/ce-plan/references/plan-sections.md
- **Upstream path:** skills/ce-plan/references/plan-sections.md
- **Category:** skill
- **Relevance:** HIGH — required by updated `ce-plan`.
- **Summary:** Defines plan section contracts independent of output format.

### skills/ce-plan/references/html-rendering.md
- **Upstream path:** skills/ce-plan/references/html-rendering.md
- **Category:** skill
- **Relevance:** HIGH — enables `output:html`.
- **Summary:** Provides HTML rendering rules for implementation plans.

### skills/ce-plan/references/markdown-rendering.md
- **Upstream path:** skills/ce-plan/references/markdown-rendering.md
- **Category:** skill
- **Relevance:** HIGH — required by markdown output mode.
- **Summary:** Provides markdown rendering rules for implementation plans.

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `.claude-plugin/plugin.json` — unmapped plugin packaging metadata
- `.codex-plugin/plugin.json` — unmapped plugin packaging metadata
- `.cursor-plugin/plugin.json` — unmapped plugin packaging metadata
- `CHANGELOG.md` — release metadata, not shared agent/skill content
- `README.md` — upstream packaging documentation, not mapped shared content
- `agents/ce-dhh-rails-reviewer.md` — filename/content skip; Rails-specific upstream deletion
- `agents/ce-kieran-rails-reviewer.md` — filename/content skip; Rails-specific upstream deletion
- `agents/ce-schema-drift-detector.md` — filename/content skip; Rails-specific upstream deletion
