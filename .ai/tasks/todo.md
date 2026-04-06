# Task: Post-merge follow-up for PR #3 Codex comments

## Context
- Goal: address missed Codex review findings after merge.
- Business reason: keep mandatory QMD prior-art workflow executable and ensure hook failures are detectable.
- Constraints/scope: minimal-diff changes only; update docs/instructions and one hook script.
- Intended approach: normalize QMD MCP tool naming to `mcp__qmd__query` and propagate hook command failure via script exit code.

## Checklist
- [x] review-planned: Confirm current state for both findings and identify impacted files
- [x] implementation: Update QMD MCP references to valid tool naming
- [x] implementation: Update `hooks/scripts/cm-reflect.sh` to return failure status
- [x] validation: Verify edits by reading changed lines
- [x] validation: Run linter
- [x] validation: Run type-checker

## Review
- Addressed Codex P1 by standardizing instruction references from invalid `mcp__qmd__search` / `mcp__qmd__vector_search` to `mcp__qmd__query`.
- Updated QMD MCP setup reference to prefer `query` and note `structured_search` as legacy naming.
- Addressed Codex P2 by making `hooks/scripts/cm-reflect.sh` return non-zero when `cass index` or `cm reflect` fails.
- Validation run:
  - `bash -n hooks/scripts/cm-reflect.sh` passed.
  - No repo lint/typecheck config or project manifests were found, so no additional linter/type-checker command was available to run.

# Task: Upstream sync cleanup for PR #7 review findings

## Context
- Goal: remove broken references and inaccurate docs left behind by the upstream sync.
- Business reason: synced skills need to match the actual local agent inventory and `.ai/` document conventions so they can be used reliably.
- Constraints/scope: keep missing Rails-only agents intentionally absent, prefer minimal local adaptations over broader rewrites, and only touch the affected skills/docs.
- Intended approach: patch the synced skills to stop referencing intentionally missing agents, move ideation artifacts under `.ai/`, and correct remaining README and branding inaccuracies.

## Checklist
- [x] review-planned: Confirm the affected skills, docs, and local inventory mismatches
- [x] implementation: Remove references to intentionally missing agents from synced skills
- [x] implementation: Move ideation artifact guidance to a local `.ai/` path and document it
- [x] implementation: Correct stale README and example branding mismatches
- [x] validation: Read back changed lines for every edited file
- [x] validation: Run available repo validation commands

## Review
- Removed references to intentionally omitted local agents from `ce-review`, its persona catalog/template guidance, `ce-compound`, and `orchestrating-swarms`.
- Moved `ce-ideate` artifact guidance to `.ai/ideation/`, documented that path in `AGENTS.md`, and taught the sync-upstream adaptation notes to rewrite `docs/ideation/` on future syncs.
- Corrected stale inventory/branding mismatches in `README.md` and `claude-permissions-optimizer`.
- Validation run:
  - Read back every edited block after patching to confirm the changes applied.
  - `git diff --check` passed.
  - Stale reference scan passed; only the sync rule’s own `docs/ideation -> .ai/ideation` mapping remains, which is intentional.
  - No `package.json`, `tsconfig.json`, ESLint, Biome, or similar project config exists in this repo root, so there was no runnable linter or type-checker command to execute.
