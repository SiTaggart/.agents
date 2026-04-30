# Task: Local dotagents render/link CLI

## Context
- Goal: move the dotagents-style CLI into this `.agents` repo so canonical agents, skills, and commands can be rendered into target-specific generated trees before linking.
- Business reason: keep one portable source of truth while preventing OpenCode and Codex from reading Claude-shaped frontmatter that breaks their startup/runtime parsing.
- Constraints/scope: keep the first pass focused on Bun/TypeScript, generated OpenCode/Codex artifacts, symlinks to generated outputs, ignored `.generated/` artifacts, and minimal conversion rules inspired by Compound Engineering rather than a full clone of its installer.
- Intended approach: add a local Bun executable with `render`, `link`, and `sync` commands, tested with Bun tests before implementation, where `sync` renders `.generated/<target>` and then links tool config paths to those generated directories.

## Checklist
- [x] review-planned: Confirm existing repo shape, missing package config, and target incompatibility surfaces
- [x] implementation: Add failing tests for OpenCode frontmatter conversion and generated-path symlinking
- [x] implementation: Add Bun/TypeScript project scaffolding and local CLI modules
- [x] implementation: Render OpenCode agents/commands/skills into `.generated/opencode`
- [x] implementation: Render Codex agents/skills/prompts into `.generated/codex`
- [x] implementation: Link generated outputs for OpenCode/Codex while keeping canonical source untouched
- [x] validation: Verify changed files by reading back key sections after edits
- [x] validation: Run Bun tests, TypeScript typecheck, and diff whitespace checks

## Review
- Added a local Bun CLI with `render`, `format`, `link`, and `sync` commands for `opencode`, `codex`, or `all`.
- Added generated target trees under ignored `.generated/`, with OpenCode receiving converted Markdown agents/commands/skills and Codex receiving TOML agents plus copied prompts/skills.
- OpenCode conversion drops Claude-only `name`, `tools`, `color`, and `model: inherit` frontmatter, maps agent `tools` to OpenCode `permission`, and rewrites Claude paths / qualified agent references.
- Link targets now point OpenCode/Codex at generated directories while keeping canonical source files untouched.
- RepoPrompt review found and prompted fixes for Codex TOML escaping, generated source-kind validation before linking, common Claude tool aliases (`LS`, `MultiEdit`, notebook tools), and typoed CLI commands.
- `ce:review` follow-up found and prompted fixes for Codex's `developer_instructions` TOML field, preflight-before-link behavior to avoid partial symlink writes, and empty generated section directories for stable linking.
- Validation run:
  - QMD prior-art search returned no existing local artifacts for this converter/symlink work.
  - Confirmed the initial tests failed before implementation because `src/render` and `src/link` did not exist.
  - Confirmed review-driven tests failed before the TOML/link/tool-alias/CLI typo fixes, then passed after the fixes.
  - Confirmed `ce:review` follow-up tests failed before the Codex field / preflight / empty-directory fixes, then passed after the fixes.
  - `bun run render opencode` and `bun run render codex` both rendered the real repo corpus in a sequential smoke check.
  - Temporary-home CLI smoke test passed for `bun src/cli.ts sync all --home <tmp>`.
  - `bun run lint` passed.
  - `bun run type-check` passed.
  - `bun run test` passed with 8 tests and 39 assertions.
  - `git diff --check` passed.

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
