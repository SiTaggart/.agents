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
