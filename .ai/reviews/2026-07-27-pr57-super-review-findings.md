# PR #57 super-review follow-ups

> **Applied 2026-07-27** (same day, on the PR branch): both "Fix later"
> clusters plus the README and `ensureDirs` nits. Still open by choice:
> the `parseFrontmatter` replacement.

Source: tp-super-review run (borrowed spade contract) via Orca panes,
2026-07-27. Find stage complete (17/17 finders, 35 candidates); verification
partial (1 of 3 refute votes — Sol — completed; no arbitration). These are the
surviving clusters after that vote plus coordinator verification. Raw
artifacts were in /tmp/orca-review-*.json (volatile).

## Fix later — src/link/index.ts managed-agents guard

- A dotagents-managed `agents` symlink created from a previous repo location
  points outside the current `.generated`, fails the guard, and dangles
  forever (both providers; rated must by Codex). Fix: also remove symlinks
  whose target no longer exists (dangling = safe), keeping the current guard
  for live links.
- The steady state (real user `~/.claude/agents` directory) warns on every
  sync. Fix: warn only for symlinks left in place; plain directories are
  expected, not anomalies.
- The comment claims "a link this tool created"; the guard proves only the
  destination. Reword.

## Fix later — ce-conventions §Sub-agent dispatch

- Read-only is advisory since the migration; the old Codex TOML render
  enforced `sandbox_mode = "read-only"` for reviewer personas (Codex, must).
  Fix: name the enforced mechanism per platform (read-only agent type in
  Claude Code, read-only sandbox in Codex) instead of "prefer read-only".
- The Codex carve-out ("do not load the persona into the parent") reads as
  contradicting Codex's parent-reads-references skill contract (Codex, must).
  Fix: rephrase as an exemption — the parent may read personas but must not
  need to.
- Add: spawn workers fresh, not as forks carrying the parent's full history.

## Optional

- README delegation overview conflates personas with skill files in one
  paragraph.
- `ensureDirs` in `src/render/codex.ts` is redundant (`copyDirectory` mkdirs).
- `parseFrontmatter` remains a full YAML-subset parser to read one `name:`
  field — deferred twice now, upheld by two models.

## Adjudicated noise (do not re-raise)

Double link validation (intentional layering), `statSafe` naming
(pre-existing), Reviewer Index vs persona-header "duplication" (parent-routing
vs child-framing), AGENTS.md read-back rule (relocated in substance to
ce-work), dispatch-site restatements of the convention (sites stay locally
executable).
