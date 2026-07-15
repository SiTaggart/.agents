---
name: orca-super-review
description: Run a repository's existing exhaustive super review through visible Orca-managed Claude, Codex, and OpenCode panes. Use when the user asks for orca-super-review, an Orca-based exhaustive review, or maximum multi-model coverage with inspectable agent progress.
---

# Orca Super Review

Read the repository's `.claude/skills/tp-super-review/SKILL.md`, then load and
follow `../orca-multi-review/SKILL.md` as the orchestration adapter. Force the
repository's `super` tier instead of using automatic tier selection.

Preserve every finder, refutation vote, arbiter, distillation step, model, prompt,
schema, fallback, and synthesis rule from the repository super-review contract.
The only changed boundary is worker transport: launch every model call as a
fresh, visible Orca pane through `ccc`, `cdx`, or foreground OpenCode as specified by
`orca-multi-review`, including its coordinator-left, workers-right wave layout,
validated result artifacts, and close-after-capture pane lifecycle.
