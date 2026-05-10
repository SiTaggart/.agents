# Upstream Sync Report
Generated: 2026-05-10T15:26:31Z
Range: 6217031..834ca4e (30 commits)

## Summary
- **Commits:** 30
- **Updates:** 32 files changed that exist locally
- **New:** 9 files added, 1 low-relevance item left for review
- **Skipped:** 7 files filtered by patterns or local scope

## Commits
- `834ca4e` chore: release main (#808)
- `07a6d52` fix(ce-resolve-pr-feedback): paginate GraphQL connections (#807)
- `dbac024` chore: release main (#806)
- `62279b0` refactor(skills): extract conditional content to references (#804)
- `81710ef` fix(ce-sessions): unblock session-history on Claude Code (#800)
- `888c98a` chore: release main (#797)
- `0e49506` refactor(agent-descriptions): trim top 7 by ~25% (#803)
- `04031a5` refactor(skill-descriptions): trim top 7 by ~55% (#802)
- `a01d2a6` refactor(ce-agent-native-architecture): slim SKILL.md by 80% (#801)
- `6fc57c5` fix(ce-debug): right-size triage and tighten hypothesis discipline (#796)
- `0bb53df` chore: release main (#789)
- `9ec351a` refactor(ce-commit-push-pr): trim prescription and fold steps (#791)
- `7f5297a` docs(ce-ideate): sync user-facing doc with topic-surface decomposition (#790)
- `168fad4` fix(ce-ideate): bound scope and add topic-surface decomposition (#787)
- `d316971` feat(lfg): allow model invocation, add CI autofix loop after PR (#788)
- `d299868` docs(skills): reframe README around the 4-step core loop (#786)
- `52e8f86` chore: release main (#781)
- `65c278c` docs(skills): sync ce-doc-review and ce-plan with PR #780 (#782)
- `8349e75` fix(doc-review): cut review noise on plans, scope personas to doc shape (#780)
- `18076e0` chore: release main (#771)
- `60b66dd` feat: convert hooks to .codex/hooks.json for Codex target (#742)
- `3e03365` feat(ce-work-beta): adaptive effort selection for Codex delegation batches (#759)
- `5139ff1` fix(ce-work-beta): replace semicolon pre-resolution with single-command form (#758)
- `be2efd7` fix(ce-plan): render Implementation Units as headings, not bulleted list items (#766)
- `c7fc674` fix(review): escape literal pipes in finding table cells (#779)
- `1f3c646` fix(ce-doc-review): block diagram deletion as a fix recommendation (#775)
- `a1698b7` docs(skills): add user-facing skill docs at docs/skills/ (#773)
- `7ff3472` fix(ce-work-beta): update Codex sandbox flags to current CLI syntax (#770)
- `4cc1ee6` fix(ce-worktree): resolve script path against skill dir, not user CWD (#772)
- `5427863` fix(ce-doc-review): tighten finding resolution routing (#769)

## Updates to Existing Content
Items that exist locally and changed upstream.

### agents/adversarial-document-reviewer.md
- **Upstream path:** agents/ce-adversarial-document-reviewer.agent.md
- **Status:** M | +25 / -1 lines
- **What changed:** Tightened document-review adversarial persona scope and prompts.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/coherence-reviewer.md
- **Upstream path:** agents/ce-coherence-reviewer.agent.md
- **Status:** M | +17 / -1 lines
- **What changed:** Trimmed description and focused consistency review behavior.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/design-lens-reviewer.md
- **Upstream path:** agents/ce-design-lens-reviewer.agent.md
- **Status:** M | +8 / -0 lines
- **What changed:** Added plan-shape-specific design review guidance.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/feasibility-reviewer.md
- **Upstream path:** agents/ce-feasibility-reviewer.agent.md
- **Status:** M | +21 / -0 lines
- **What changed:** Added implementation reality-check guidance for planning reviews.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/learnings-researcher.md
- **Upstream path:** agents/ce-learnings-researcher.agent.md
- **Status:** M | +1 / -1 lines
- **What changed:** Trimmed agent description.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/product-lens-reviewer.md
- **Upstream path:** agents/ce-product-lens-reviewer.agent.md
- **Status:** M | +21 / -1 lines
- **What changed:** Refocused product-plan critique and scope.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/scope-guardian-reviewer.md
- **Upstream path:** agents/ce-scope-guardian-reviewer.agent.md
- **Status:** M | +23 / -0 lines
- **What changed:** Added scope-alignment review criteria.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/security-lens-reviewer.md
- **Upstream path:** agents/ce-security-lens-reviewer.agent.md
- **Status:** M | +8 / -0 lines
- **What changed:** Added plan-level security review guidance.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/session-historian.md
- **Upstream path:** agents/ce-session-historian.agent.md
- **Status:** M | +55 / -162 lines
- **What changed:** Changed session historian into a synthesis-only subagent orchestrated by ce-sessions.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/slack-researcher.md
- **Upstream path:** agents/ce-slack-researcher.agent.md
- **Status:** M | +1 / -1 lines
- **What changed:** Trimmed agent description.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### agents/web-researcher.md
- **Upstream path:** agents/ce-web-researcher.agent.md
- **Status:** M | +1 / -1 lines
- **What changed:** Trimmed agent description.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/agent-native-architecture/SKILL.md
- **Upstream path:** skills/ce-agent-native-architecture/SKILL.md
- **Status:** M | +55 / -404 lines
- **What changed:** Moved detailed checklist content into references/checklists.md.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-brainstorm/SKILL.md
- **Upstream path:** skills/ce-brainstorm/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Updated doc-review handoff wording.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-review/SKILL.md
- **Upstream path:** skills/ce-code-review/SKILL.md
- **Status:** M | +4 / -4 lines
- **What changed:** Synced review flow tightening and local ce-review naming.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/git-commit-push-pr/SKILL.md
- **Upstream path:** skills/ce-commit-push-pr/SKILL.md
- **Status:** M | +49 / -138 lines
- **What changed:** Trimmed workflow prescription and kept local git-commit-push-pr naming.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-compound-refresh/SKILL.md
- **Upstream path:** skills/ce-compound-refresh/SKILL.md
- **Status:** M | +8 / -78 lines
- **What changed:** Extracted per-action flows into references/per-action-flows.md.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-compound/SKILL.md
- **Upstream path:** skills/ce-compound/SKILL.md
- **Status:** M | +11 / -15 lines
- **What changed:** Updated compound workflow and local .ai path handling.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-debug/SKILL.md
- **Upstream path:** skills/ce-debug/SKILL.md
- **Status:** M | +28 / -11 lines
- **What changed:** Right-sized triage and hypothesis discipline.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/document-review/SKILL.md
- **Upstream path:** skills/ce-doc-review/SKILL.md
- **Status:** M | +33 / -8 lines
- **What changed:** Synced document-review noise reduction and persona routing changes.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-ideate/SKILL.md
- **Upstream path:** skills/ce-ideate/SKILL.md
- **Status:** M | +70 / -16 lines
- **What changed:** Bound ideation scope and added topic-surface decomposition.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-optimize/README.md
- **Upstream path:** skills/ce-optimize/README.md
- **Status:** D | +0 / -38 lines
- **What changed:** Removed upstream-deleted README.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-optimize/SKILL.md
- **Upstream path:** skills/ce-optimize/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Trimmed description.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-plan/SKILL.md
- **Upstream path:** skills/ce-plan/SKILL.md
- **Status:** M | +12 / -290 lines
- **What changed:** Moved plan template detail into references/plan-template.md and kept .ai paths.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/proof/SKILL.md
- **Upstream path:** skills/ce-proof/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Trimmed description with local proof naming.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/resolve-pr-feedback/SKILL.md
- **Upstream path:** skills/ce-resolve-pr-feedback/SKILL.md
- **Status:** M | +3 / -359 lines
- **What changed:** Moved full/targeted flows into references and synced GraphQL pagination support.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-session-extract/SKILL.md
- **Upstream path:** skills/ce-session-extract/SKILL.md
- **Status:** D | +0 / -64 lines
- **What changed:** Removed upstream-deleted standalone extraction skill; ce-sessions now orchestrates scripts.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-session-inventory/SKILL.md
- **Upstream path:** skills/ce-session-inventory/SKILL.md
- **Status:** D | +0 / -68 lines
- **What changed:** Removed upstream-deleted standalone inventory skill; ce-sessions now orchestrates scripts.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-sessions/SKILL.md
- **Upstream path:** skills/ce-sessions/SKILL.md
- **Status:** M | +193 / -8 lines
- **What changed:** Synced session discovery/filter/extract orchestration for Claude Code, Codex, and Cursor.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-slack-research/SKILL.md
- **Upstream path:** skills/ce-slack-research/SKILL.md
- **Status:** M | +1 / -1 lines
- **What changed:** Trimmed description.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/ce-work-beta/SKILL.md
- **Upstream path:** skills/ce-work-beta/SKILL.md
- **Status:** M | +3 / -2 lines
- **What changed:** Synced adaptive effort and Codex sandbox flag updates.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/git-worktree/SKILL.md
- **Upstream path:** skills/ce-worktree/SKILL.md
- **Status:** M | +7 / -4 lines
- **What changed:** Synced script path resolution fix with local git-worktree naming.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

### skills/lfg/SKILL.md
- **Upstream path:** skills/lfg/SKILL.md
- **Status:** M | +53 / -3 lines
- **What changed:** Added model invocation and CI autofix loop guidance.
- **Action needed:** Applied with local path/name and `.ai/` adaptations; review local diff

## New Content to Review
Items that don't exist locally and may be worth adding.

### skills/agent-native-architecture/references/checklists.md
- **Upstream path:** skills/ce-agent-native-architecture/references/checklists.md
- **Category:** skill
- **Relevance:** HIGH — General-purpose agent-native architecture checklist extracted from existing local skill.
- **Summary:** Applied locally.

### skills/ce-compound-refresh/references/per-action-flows.md
- **Upstream path:** skills/ce-compound-refresh/references/per-action-flows.md
- **Category:** skill
- **Relevance:** HIGH — General-purpose compound refresh action-flow reference extracted from existing local skill.
- **Summary:** Applied locally.

### skills/ce-plan/references/plan-template.md
- **Upstream path:** skills/ce-plan/references/plan-template.md
- **Category:** skill
- **Relevance:** HIGH — General-purpose plan template reference extracted from existing local skill.
- **Summary:** Applied locally.

### skills/resolve-pr-feedback/references/full-mode.md
- **Upstream path:** skills/ce-resolve-pr-feedback/references/full-mode.md
- **Category:** skill
- **Relevance:** HIGH — Full PR feedback resolution mode extracted from existing local skill.
- **Summary:** Applied locally.

### skills/resolve-pr-feedback/references/targeted-mode.md
- **Upstream path:** skills/ce-resolve-pr-feedback/references/targeted-mode.md
- **Category:** skill
- **Relevance:** HIGH — Targeted PR feedback resolution mode extracted from existing local skill.
- **Summary:** Applied locally.

### skills/ce-sessions/scripts/discover-sessions.sh
- **Upstream path:** skills/ce-sessions/scripts/discover-sessions.sh
- **Category:** skill
- **Relevance:** HIGH — Session discovery helper moved under ce-sessions.
- **Summary:** Applied locally.

### skills/ce-sessions/scripts/extract-errors.py
- **Upstream path:** skills/ce-sessions/scripts/extract-errors.py
- **Category:** skill
- **Relevance:** HIGH — Session error extraction helper moved under ce-sessions.
- **Summary:** Applied locally.

### skills/ce-sessions/scripts/extract-metadata.py
- **Upstream path:** skills/ce-sessions/scripts/extract-metadata.py
- **Category:** skill
- **Relevance:** HIGH — Session metadata extraction helper moved under ce-sessions.
- **Summary:** Applied locally.

### skills/ce-sessions/scripts/extract-skeleton.py
- **Upstream path:** skills/ce-sessions/scripts/extract-skeleton.py
- **Category:** skill
- **Relevance:** HIGH — Session skeleton extraction helper moved under ce-sessions.
- **Summary:** Applied locally.

### agents/swift-ios-reviewer.md
- **Upstream path:** agents/ce-swift-ios-reviewer.agent.md
- **Category:** agent
- **Relevance:** LOW — Swift/iOS-specific reviewer; not added because local inventory is TypeScript/React focused.
- **Summary:** Not applied.

## Auto-Skipped
Filtered by skip patterns — listed for transparency.

- `.claude-plugin/plugin.json` — outside sync skill path mapping
- `.codex-plugin/plugin.json` — outside sync skill path mapping
- `.cursor-plugin/plugin.json` — outside sync skill path mapping
- `AGENTS.md` — outside sync skill path mapping; local project instructions are authoritative
- `CHANGELOG.md` — outside sync skill path mapping; release notes treated as data only
- `README.md` — outside sync skill path mapping; avoid upstream branding leakage
- `agents/ce-swift-ios-reviewer.agent.md` — new iOS-specific agent outside local TypeScript/React scope
