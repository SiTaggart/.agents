---
name: ce-improve-skills
description: "Improve CE skills from evidence. Use when the user asks to run a continual-improvement loop, reinforce, tune, patch, or evaluate ce-* skills using Codex/Claude/Cursor session history, QMD agent retros, gotchas, proposals, user corrections, retries, test failures, or recurring skill friction."
---

# CE Skill Improvement Loop

Turn session evidence into small, measured patches to `ce-*` skills.

This is skill-level reinforcement, not model training. The policy is the
`SKILL.md`; the reward signal is whether later sessions show less friction.

## Default Scope

If the user names a skill, gotcha, proposal, error, or time window, use that.
If not, use the last 7 days of agent retros and focus on `ce-*` skills plus
`.agents` skill-development sessions.

Do not bulk-read raw session files. Use QMD retros first. Use `ce-sessions`
only for a focused question that names a concrete skill, failure, or behavior.

## Evidence Sources

Gather the smallest evidence set that can justify a change:

1. Read `AGENTS.md`, `README.md`, the target `ce-*` skill, and any referenced
   files the target skill says are part of its contract.
2. Query QMD, usually collection `ai`, for exact terms first:
   - `lex: <skill-name> gotcha proposal correction retry failure`
   - `vec: how has <skill-name> caused friction or needed improvement`
3. Read matching gotchas, proposals, weekly digests, or lessons with `qmd get`.
4. Use `ce-sessions` only when QMD evidence leaves a specific open question,
   such as "what went wrong recently with `ce-quality-gate` menus?"

## Reward Signals

Treat these as evidence that a skill may need reinforcement:

- repeated user corrections
- repeated retries or abandoned paths
- repeated test, type, sandbox, auth, or timeout failures
- repeated over-widening, over-delegation, or scope creep
- missing proof after a skill says proof is required
- a successful pattern that appears in multiple sessions but is not yet in the
  owning skill

Reading the target skill itself surfaces a second evidence class — textual
failure modes independent of session friction: **no-op** lines the model
already obeys by default, **sediment** (stale layers never cleared), **sprawl**
(too long even when every line is live), **duplication** (one meaning in more
than one place), and **premature completion** invited by a vague completion
criterion. The `writing-great-skills` skill
(`skills/writing-great-skills/GLOSSARY.md`) is the taxonomy and the cure for
each; consult it when diagnosing or patching.

Do not optimize vanity metrics such as fewer tool calls if the result becomes
less correct.

## Decision Rule

Use the first outcome that fits:

1. **Direct patch** - a recurring, actionable signal maps to one owner skill.
   Strong evidence is a gotcha/proposal, the same failure in at least two
   sessions, an explicit user correction, or a verified current failure.
2. **Proposal** - the signal is cross-cutting, risky, based only on aggregate
   metrics, or would touch more than one or two skills.
3. **No change** - the evidence is one-off, stale, contradicted, or already
   covered by the current skill.

If a patch would touch more than 3-4 files, stop and write a proposal instead.

## Owner Map

Patch the skill that owns the failing behavior:

| Signal | Owner |
| --- | --- |
| session discovery, extraction, widening, privacy | `ce-sessions` |
| implementation scope, product contract, proof | `ce-work` |
| mechanical checks, touched-surface quality | `ce-quality-gate` |
| review severity, deduplication, verdicts | `ce-review` |
| solved-problem docs, lessons, stale learnings | `ce-compound` / `ce-compound-refresh` |
| plan artifacts, plan depth, handoff quality | `ce-plan` |
| root-cause debugging behavior | `ce-debug` |
| browser/manual UI proof | `ce-polish` |

For cross-cutting behavior, prefer `AGENTS.md`, `README.md`, or a proposal only
when one owner skill cannot honestly contain the fix.

## Patch Discipline

Before editing, state:

- the behavior being reinforced
- the owner skill
- the expected future signal that should improve

Then make the smallest durable change, reaching for the `writing-great-skills`
levers first (they are defined there, not here):

- prefer replacing or deleting one misleading instruction over adding a new
  phase
- prune **no-ops** and **sediment**; collapse **duplication** into a **single
  source of truth** or a **leading word**; cure **sprawl** by **progressive
  disclosure**, adding a new reference file only when the SKILL.md branch would
  otherwise become noisy
- steer with the **positive** target, not prohibition (**negation**); sharpen a
  vague **completion criterion** before splitting to hide later steps
- keep examples concrete and short
- avoid new scripts unless the same deterministic operation has been rewritten
  or run manually at least three times
- preserve cross-platform tool wording when a skill runs across Codex, Claude
  Code, Cursor, Gemini, or Pi

## Verification

After editing:

1. Read back every changed line.
2. Render the skill shelf with `bun run render` from the `.agents` root.
3. Run `bun run test` only when source code, render behavior, hooks, or scripts
   changed. For a SKILL.md-only patch, render plus readback is enough.
4. If the behavior is non-trivial and cheap to exercise, forward-test the skill
   on one realistic prompt. Skip forward-testing for tiny wording patches and
   say so.

## Output

Return a compact report:

```markdown
Evidence: <what repeated signal justified this>
Decision: direct patch | proposal | no change
Changed: <files or proposal path>
Verified: <commands/readback/forward-test>
Next measurement: <what to check in future retros>
```

Do not claim the loop worked until a later retro or session search shows the
target signal dropped.
