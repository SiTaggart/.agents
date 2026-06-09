---
name: ce-quality-gate
description: "Run the changed-code quality gate after implementation: touched-file lint, format, type-check, tests, and code-shape checks. Use after ce-work writes code, before review or shipping, and when the user asks to make changed files clean."
argument-hint: "[optional touched file list, diff scope, or quality concern]"
---

# Changed-Code Quality Gate

Use this after code has been written. It makes the touched surface mechanically
clean and checks that the code shape matches the project's standards.

This is not a product review and does not replace real-surface proof. It answers
"is the changed code clean enough to review or ship?"

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
- warnings count when the project treats warnings as failures
- no `any`, non-null assertions, skipped tests, weakened tests, or ignored
  rules were added to make checks pass
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

Run checks and fix failures caused by the changed surface.

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

- honest helper arguments instead of broad courier objects
- deterministic logic in named helpers, reducers, schemas, selectors, or
  adapters when JSX or effects start carrying business rules
- no dead code, duplicate branches, or speculative abstractions
- behavior still lives at the owner boundary accepted by `ce-work`
- comments explain why, not what

Use `ce-simplify-code` only when simplification is non-trivial or the user asks
for it. Do not turn simplification into a mandatory ritual.

### 6. Report Proof

Return a compact status:

- touched files checked
- commands run and results
- code-shape issues fixed or still present
- unrelated baseline failures, if any
- what this gate did not prove, especially product/browser behavior
