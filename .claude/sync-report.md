# Upstream Sync Report
Generated: 2026-05-21T15:24:11Z
Range: f61d1b3..08bb589 (4 commits)

## Summary
- **Commits:** 4
- **Updates:** 6 files changed that exist locally
- **New:** 0 files to consider adding
- **Skipped:** 54 files filtered by patterns or local convention no-ops

## Commits
- `08bb589` chore: release main (#850)
- `ac1c6d9` fix(ce-compound): drop date suffix from generated doc filenames (#849)
- `796bea7` fix(agents): rename .agent.md to .md for VS Code Copilot tool access (#846)
- `2a46670` fix(ce-proof): update HITL flow for Proof v2 (#847)

## Updates to Existing Content
Items that exist locally and changed upstream.

### skills/ce-brainstorm/references/handoff.md
- **Upstream path:** skills/ce-brainstorm/references/handoff.md
- **Status:** M | +1 / -1 lines
- **What changed:** Updated Proof handoff wording to describe filtered comment ingestion, current edit APIs, and reply/resolve behavior instead of tracked suggestions.
- **Action needed:** Review diff, merge improvements

### skills/ce-compound/SKILL.md
- **Upstream path:** skills/ce-compound/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Changed generated solution filename guidance from `[slug]-[date].md` to `[slug].md`, keeping creation date in frontmatter.
- **Action needed:** Review diff, merge improvements

### skills/ce-ideate/references/post-ideation-workflow.md
- **Upstream path:** skills/ce-ideate/references/post-ideation-workflow.md
- **Status:** M | +1 / -1 lines
- **What changed:** Updated Proof save wording to say agents apply agreed edits and reply/resolve in thread; local `.ai/ideation/` path convention preserved.
- **Action needed:** Review diff, merge improvements

### skills/ce-plan/references/plan-handoff.md
- **Upstream path:** skills/ce-plan/references/plan-handoff.md
- **Status:** M | +1 / -1 lines
- **What changed:** Updated plan Proof handoff wording to reference filtered comment ingestion and current Proof edit APIs.
- **Action needed:** Review diff, merge improvements

### skills/proof/SKILL.md
- **Upstream path:** skills/ce-proof/SKILL.md
- **Status:** M | +110 / -21 lines
- **What changed:** Ported Proof v2 API guidance: shared URL content negotiation, `?kinds=comment`, `/edit/v2` as the preferred content-edit path, `find_replace_in_doc`, batch comment operations, response-based baseToken updates, and stricter idempotency-key handling.
- **Action needed:** Review diff, merge improvements

### skills/proof/references/hitl-review.md
- **Upstream path:** skills/ce-proof/references/hitl-review.md
- **Status:** M | +45 / -20 lines
- **What changed:** Updated the HITL loop to filter to comment marks, batch replies/resolves, prefer `/edit/v2` for agent-applied edits, use `find_replace_in_doc` for literal sweeps, and refresh baseToken handling after successful mutations.
- **Action needed:** Review diff, merge improvements

## New Content to Review
Items that don't exist locally and may be worth adding.

None.

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `.claude-plugin/plugin.json` — plugin packaging metadata; outside Simon's flat `agents/` and direct `skills/` content conventions
- `.codex-plugin/plugin.json` — plugin packaging metadata; outside Simon's flat `agents/` and direct `skills/` content conventions
- `.cursor-plugin/plugin.json` — plugin packaging metadata; outside Simon's flat `agents/` and direct `skills/` content conventions
- `AGENTS.md` — upstream global instructions; local project instructions are authoritative
- `CHANGELOG.md` — release context captured in this sync report and PR instead
- `agents/ce-adversarial-document-reviewer.agent.md` -> `agents/ce-adversarial-document-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-adversarial-reviewer.agent.md` -> `agents/ce-adversarial-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-agent-native-reviewer.agent.md` -> `agents/ce-agent-native-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-ankane-readme-writer.agent.md` -> `agents/ce-ankane-readme-writer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-api-contract-reviewer.agent.md` -> `agents/ce-api-contract-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-architecture-strategist.agent.md` -> `agents/ce-architecture-strategist.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-best-practices-researcher.agent.md` -> `agents/ce-best-practices-researcher.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-code-simplicity-reviewer.agent.md` -> `agents/ce-code-simplicity-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-coherence-reviewer.agent.md` -> `agents/ce-coherence-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-correctness-reviewer.agent.md` -> `agents/ce-correctness-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-data-integrity-guardian.agent.md` -> `agents/ce-data-integrity-guardian.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-data-migration-expert.agent.md` -> `agents/ce-data-migration-expert.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-data-migrations-reviewer.agent.md` -> `agents/ce-data-migrations-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-deployment-verification-agent.agent.md` -> `agents/ce-deployment-verification-agent.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-design-implementation-reviewer.agent.md` -> `agents/ce-design-implementation-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-design-iterator.agent.md` -> `agents/ce-design-iterator.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-design-lens-reviewer.agent.md` -> `agents/ce-design-lens-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-dhh-rails-reviewer.agent.md` -> `agents/ce-dhh-rails-reviewer.md` — rename-only upstream agent extension change; skipped by Rails-specific filename pattern and local flat `.md` convention
- `agents/ce-feasibility-reviewer.agent.md` -> `agents/ce-feasibility-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-figma-design-sync.agent.md` -> `agents/ce-figma-design-sync.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-framework-docs-researcher.agent.md` -> `agents/ce-framework-docs-researcher.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-git-history-analyzer.agent.md` -> `agents/ce-git-history-analyzer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-issue-intelligence-analyst.agent.md` -> `agents/ce-issue-intelligence-analyst.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-julik-frontend-races-reviewer.agent.md` -> `agents/ce-julik-frontend-races-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-kieran-python-reviewer.agent.md` -> `agents/ce-kieran-python-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-kieran-rails-reviewer.agent.md` -> `agents/ce-kieran-rails-reviewer.md` — rename-only upstream agent extension change; skipped by Rails-specific filename pattern and local flat `.md` convention
- `agents/ce-kieran-typescript-reviewer.agent.md` -> `agents/ce-kieran-typescript-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-learnings-researcher.agent.md` -> `agents/ce-learnings-researcher.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-maintainability-reviewer.agent.md` -> `agents/ce-maintainability-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-pattern-recognition-specialist.agent.md` -> `agents/ce-pattern-recognition-specialist.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-performance-oracle.agent.md` -> `agents/ce-performance-oracle.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-performance-reviewer.agent.md` -> `agents/ce-performance-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-pr-comment-resolver.agent.md` -> `agents/ce-pr-comment-resolver.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-previous-comments-reviewer.agent.md` -> `agents/ce-previous-comments-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-product-lens-reviewer.agent.md` -> `agents/ce-product-lens-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-project-standards-reviewer.agent.md` -> `agents/ce-project-standards-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-reliability-reviewer.agent.md` -> `agents/ce-reliability-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-repo-research-analyst.agent.md` -> `agents/ce-repo-research-analyst.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-schema-drift-detector.agent.md` -> `agents/ce-schema-drift-detector.md` — rename-only upstream agent extension change; skipped by Rails-specific filename pattern and local flat `.md` convention
- `agents/ce-scope-guardian-reviewer.agent.md` -> `agents/ce-scope-guardian-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-security-lens-reviewer.agent.md` -> `agents/ce-security-lens-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-security-reviewer.agent.md` -> `agents/ce-security-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-security-sentinel.agent.md` -> `agents/ce-security-sentinel.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-session-historian.agent.md` -> `agents/ce-session-historian.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-slack-researcher.agent.md` -> `agents/ce-slack-researcher.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-spec-flow-analyzer.agent.md` -> `agents/ce-spec-flow-analyzer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-swift-ios-reviewer.agent.md` -> `agents/ce-swift-ios-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-testing-reviewer.agent.md` -> `agents/ce-testing-reviewer.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
- `agents/ce-web-researcher.agent.md` -> `agents/ce-web-researcher.md` — rename-only upstream agent extension change; local flat `agents/*.md` files already use `.md` names
