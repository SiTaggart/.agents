---
name: ce-quality-gate
description: "Run the changed-code quality gate after implementation: touched-file lint, format, type-check, tests, and code-shape checks. Use after ce-work writes code, before review or shipping, and when the user asks to make changed files clean."
argument-hint: "[optional touched file list, diff scope, or quality concern]"
---

# Changed-Code Quality Gate

Use this after code has been written. It makes the touched surface mechanically
clean and checks that the code shape matches the project's standards.

This is not a product review and does not replace real-surface proof. It answers
"is the changed code complete enough to review or ship?"

## Loop Role

`ce-work` calls this after implementation and behavioral proof. `ce-review` may
still run after this when the work is substantial, risky, or explicitly under
review.

## Contract

For the touched surface:

- formatting is clean
- lint is clean
- TypeScript or language-specific type checks are clean
- relevant tests pass
- relevant `code-taste` issues are fixed
- warnings count when the project treats warnings as failures
- no `any`, non-null assertions, skipped tests, weakened tests, or ignored
  rules were added to make checks pass
- no speculative type guards, casts, wrappers, adapters, defensive helpers,
  `useEffect` misuse, or premature abstractions remain unless required by the
  accepted contract and reported as an exception
- local `AGENTS.md`, `CLAUDE.md`, and nearby code conventions are followed

If broad repo checks are noisy, separate unrelated baseline failures from
touched-file failures. Do not hide them and do not claim the whole repo is clean.

## Workflow

### 1. Resolve Scope

Use the provided file list when present. Otherwise derive the touched surface
from the current diff.

Include:

- edited source files
- edited tests and fixtures
- generated files that are part of the accepted contract
- package, config, schema, or lockfile changes that affect checks

### 2. Read Governing Standards

Read the closest applicable instructions and conventions:

- project `AGENTS.md` and `CLAUDE.md`
- nearby package scripts, test docs, or CI config
- local examples around touched files

Use these to choose the check shape. Do not invent commands when the repo
already has scripts.

### 3. Discover The Check Bundle

Find the narrowest trustworthy bundle for the touched surface.

For TypeScript and React, prefer:

- relevant formatter or format check
- touched-file or package lint
- package type-check
- focused tests for the lowest meaningful behavior

For other stacks, use the same principle: formatter, lint/static checks,
type/compile checks, and focused tests where the project provides them.

If no suitable command exists, say which proof is unavailable and use the
closest representative check.

### 4. Iterate Until Clean

Run checks and fix failures caused by the changed surface. Treat relevant
`code-taste` violations like lint failures for touched code.

Do not:

- skip tests
- delete assertions
- disable lint rules
- weaken types
- use casts, `any`, or non-null assertions to silence errors
- expand scope into unrelated cleanup

If a check fails from unrelated baseline noise, capture the exact failure and
then prove the touched surface with the narrower available command.

### 5. Code-Shape Pass

Review the changed code for local taste:

- use `code-taste` for TypeScript, React, helper-boundary, effect, test-shape,
  and maintainability smells when those concerns are relevant to the touched code
- for TypeScript or React changes, verify `ce-work` used `code-taste` before or
  during implementation and that `typescript-advanced-types` or
  `vercel-react-best-practices` was consulted when the surface justified it
- no dead code, duplicate branches, or speculative abstractions
- behavior still lives at the owner boundary accepted by `ce-work`
- comments explain why, not what

The gate is not complete while relevant `code-taste` violations remain. Fix
them, or report a necessary exception with the accepted-contract reason.
If the relevant taste route was skipped earlier, do a narrow pass now, fix only
issues in the accepted contract, and report the status as `fixed late`. Do not
turn the quality gate into the main architecture phase.

Use `ce-simplify-code` only when simplification is non-trivial or the user asks
for it. Do not turn simplification into a mandatory ritual.

### 6. Report Proof

Return a compact status:

- touched files checked
- commands run and results
- `code-taste` route and gate status: applied early, fixed late, not relevant,
  or necessary exception
- code-shape issues fixed or still present
- unrelated baseline failures, if any
- what this gate did not prove, especially product/browser behavior

### 7. Recommend The Next Step

After the report, recommend what to run next and fire it — do not end on a bare report. The menu is gated by the gate result and the change's risk, not a fixed list: show only the options that fit, mark the recommended one, and renumber so options stay contiguous from 1.

Use the platform's blocking question tool (`AskUserQuestion` in Claude Code, `request_user_input` in Codex, `ask_user` in Gemini, `ask_user` in Pi (requires the `pi-ask-user` extension)). In Claude Code, call `ToolSearch` with `select:AskUserQuestion` first if its schema isn't loaded — a pending schema load is not a reason to fall back. Fall back to a numbered chat list ("Pick a number or describe what you want.") only when no blocking tool exists or the call errors. Never end the turn without collecting a response. Act on the selection — invoke the routed skill via the platform's skill primitive — do not merely name it.

Gate the options on the result:

- **Clean and the change is substantial or risky:** `ce-review` for a first-principles pass (recommended), then ship.
- **Clean and the change is narrow and low-risk:** `git-commit-push-pr` to ship (recommended), or `git-commit` for a local commit only. Offer `ce-review` only if the user wants a second pass.
- **A non-trivial simplification opportunity remains, or a code-shape exception was reported:** `ce-simplify-code` before review or ship.
- **Still blocked by a touched-file failure this gate could not resolve:** `ce-debug` to find the root cause (recommended). Do not route to review or ship while the surface is failing.

Always include a `Done for now` option that ends the turn without follow-up work.

**Sub-step guard:** When `ce-work` (or another skill) invoked this gate as a sub-step, skip the menu — return the report and let the caller own the terminal next-step recommendation. Present the menu only when the gate owns the turn's endpoint.
