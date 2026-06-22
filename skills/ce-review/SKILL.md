---
name: ce-review
description: Review recent code changes for bugs, regressions, product fit, conventions, performance, security, and blast radius.
argument-hint: "[quick] [base:<ref>] [plan:<path>] [PR number, PR URL, branch name, or blank for current branch]"
---

# First-Principles Code Review

Review the current changeset like a senior engineer who cares about product outcome and code taste. The goal is not maximum findings. The goal is to help the user ship a clean, correct, elegant implementation.

This skill is review-only. It never edits files, commits, pushes, opens PRs, files tickets, writes run artifacts, or applies fixes. If the user wants fixes after the review, handle that as a separate task.

## Loop Role

`ce-review` is a work-review skill. Use it after implementation exists as a
branch, PR, or local diff. It may read a plan via `plan:<path>` for intent, but
the review target is still the changed work.

Do not use `ce-review` to review requirements docs, plans, PRDs, or kickoff
docs. Use `document-review` for those artifacts.

## Review Philosophy

- Start from the product contract: what user action, UI state, backend payload, URL state, persisted state, rendered output, or artifact is this change trying to improve?
- Prefer first-principles reasoning over checklist compliance.
- Thoroughness is not noise. A strong review catches what matters and suppresses what does not.
- Good code should be easy to trace, easy to test, easy to delete, and hard to misuse.
- Taste matters. If the implementation works but is needlessly tangled, indirect, broad, or hard to read, say so with a concrete simpler direction.
- Use `code-taste` for TypeScript, React, helper-boundary, effect, test-shape,
  and maintainability smells when those concerns are relevant to the diff.
- Guardrail concerns are conditional. Migration, deployment, rollout, support, and observability issues matter only when the diff actually touches those surfaces or creates a concrete product risk.

## Non-Goals

Do not do any of these:

- Do not run a compliance gauntlet.
- Do not spawn agents for migration, deployment, support, automation parity, or knowledge capture unless the changed code truly needs that review.
- Do not review requirements documents or implementation plans as the primary target.
- Do not flag pre-existing issues unless a changed line directly depends on them or makes them worse.
- Do not report speculative future-work concerns.
- Do not route findings to owners, create JSON contracts, or produce machine-actionable artifact payloads.
- Do not praise the work or add filler.

## Step 0: Pre-Flight

Before deep review, establish that the changeset is reviewable.

Parse arguments before resolving the target:

- `quick` means run the passes in the parent agent and keep the report short.
- `base:<ref>` selects the diff base for the current checkout.
- `plan:<path>` is an optional intent source; read it for requirements context when it exists.
- Legacy tokens such as `mode:agent`, `mode:headless`, `mode:report-only`, and `mode:autofix` are ignored. They do not change output format, apply behavior, or create artifacts.

1. Determine the review target.
   - `base:<ref>` means review the current checkout against that base. Use `git merge-base HEAD <ref>` when possible; otherwise use `<ref>` directly.
   - A PR number or URL means review that PR without checking it out. Use `gh pr view` and `gh pr diff --color=never` when available.
   - A branch name means review that branch without switching branches. Prefer an open PR for the branch when one exists; otherwise diff the resolved branch ref against the default branch.
   - No argument means review the current branch against its PR base if an open PR exists; otherwise review against the default branch.
2. Collect the changed file list and full diff.
3. Exclude submodules, generated files, lockfiles, and vendored/minified assets unless the change is specifically about them.
4. Include staged and unstaged tracked changes for current-checkout reviews. List untracked files as excluded unless the user explicitly asked to include them.
5. Find project instruction files that govern the changed files, especially `AGENTS.md` and `CLAUDE.md` ancestors.
6. If an obvious fast lint, typecheck, or touched-surface test command exists, run it first. If basics fail, report those failures before deeper review. Continue only when the user explicitly wants conceptual review despite red checks.

When command output is unavailable, continue with the closest reliable source and state the limitation in the review.

## Step 1: Understand Intent

Write a two- or three-line intent summary before judging the code.

Use the conversation, branch name, commit messages, PR title/body, linked issue text, plan snippets, and the diff itself. If intent is uncertain, say what you inferred and review against that inferred contract.

The intent summary should answer:

- What product or engineering outcome is this change trying to create?
- What behavior must not regress?
- Which files or modules own the change?

## Step 2: Read For Context

Read changed files in full when they are reasonably sized. Use the diff to distinguish new or modified behavior from existing code.

For exported functions, public components, API handlers, hooks, schemas, commands, or shared utilities, inspect the nearest callers/importers when the changed contract may affect them.

Do not let caller spelunking become an unrelated repo audit. Follow blast radius only as far as needed to decide whether this change is correct.

When the diff is broad enough that an independent codebase read would improve the review, use `repoprompt` review mode to map blast radius and cross-module impact. Fold the result into the main review; do not mechanically forward findings that lack file/line evidence.

## Step 3: Review Passes

For small changes, run these passes yourself. For medium or large changes, use parallel read-only sub-agents when the platform supports them, one pass per agent. If sub-agents are unavailable, run the passes sequentially.

Each pass returns at most five findings, ranked by impact. A pass with no issues says `No issues.`

Every pass uses this shared bar:

- Only flag issues introduced or materially affected by this changeset.
- Cite a specific file and line.
- Explain the concrete consequence.
- Give a specific fix direction.
- Suppress anything that is merely preference, unsupported speculation, or a duplicate of another pass.

### Context-Isolated Agent Routing

For medium or large reviews, delegate the context-heavy passes to existing
reviewer agents instead of loading every lens into the parent thread. The parent
keeps review intent, severity, deduplication, and final verdict ownership.

Dispatch the smallest useful set:

- `correctness-reviewer` for product intent, logic, state transitions, async
  ordering, error propagation, and edge cases.
- `maintainability-reviewer` for traceability, data flow, coupling, naming,
  abstraction debt, and broad code-shape concerns.
- `code-simplicity-reviewer` when the implementation looks over-built, includes
  scaffolding, or needs a final minimalism pass.
- `project-standards-reviewer` for AGENTS.md/CLAUDE.md and local instruction
  compliance.
- `testing-reviewer` for changed-code test gaps, weak assertions, brittle
  tests, and missing proof.
- `react-test-architect` only when the review needs a broader React test
  strategy, suite reshaping, or CI test-performance assessment.
- `kieran-typescript-reviewer` for TypeScript diffs where type safety,
  compile-time contracts, casts, nullability, helper boundaries, or TS-specific
  maintainability are material.
- `kieran-python-reviewer` for Python diffs.
- `api-contract-reviewer` for API routes, request/response schemas,
  serialization, versioning, exported type signatures, and public contracts.
- `reliability-reviewer` for retries, timeouts, async handlers, background jobs,
  health checks, circuit breakers, and failure modes.
- `performance-reviewer` for query shapes, caching, I/O volume, hot paths,
  loops over large data, bundle impact, or frequently rendered UI.
- `previous-comments-reviewer` when an open PR has prior review comments or
  review threads.
- `julik-frontend-races-reviewer` for JavaScript, Stimulus, Turbo, DOM
  lifecycle, or timing-sensitive frontend diffs.
- `architecture-strategist` when the diff changes boundaries, service shape,
  shared interfaces, module layering, or architectural direction.
- `design-implementation-reviewer` when the task includes matching a Figma
  design or visual implementation fidelity.
- `adversarial-reviewer` for large or high-risk diffs where constructing
  failure scenarios is likely to find issues the normal passes miss.

Do not dispatch an agent solely because it exists. If a concern is small enough
to evaluate in the parent context, run it inline. If an agent returns findings,
deduplicate and re-check them against this skill's evidence bar before
including them in the final review.

### Pass 1: Product Intent And Correctness

Ask whether the implementation actually satisfies the intended product contract.

Look for:

- wrong conditions, comparisons, or edge-case handling
- broken state transitions or inconsistent data after early returns
- API misuse, ignored return values, unchecked failures, or async ordering mistakes
- UI state and rendered output drifting apart
- missing behavior from the stated or inferred requirement

This pass is the most important. If the code is clean but solves the wrong problem, that is a must-fix.

### Pass 2: Traceability And Data Flow

Ask whether a reader can follow what the code does without holding the whole system in their head.

Look for:

- helpers that accept broad objects but only use one field
- hidden store/context reads buried inside pure-looking helpers
- duplicated derived state
- deeply nested conditionals, callbacks, or ternaries
- vague names that describe type rather than intent
- comments compensating for structure that should be clearer

Prefer explicit dependencies and flat data flow. Do not demand extraction for its own sake.

### Pass 3: Elegance And Minimalism

Ask whether less code would do the same thing just as clearly.

Look for:

- dead code, unused exports, or leftover scaffolding
- unnecessary wrappers, adapters, indirection, or configuration layers
- over-generalization for hypothetical future cases
- duplicate logic that should share an existing local helper
- verbose patterns with an obvious idiomatic alternative
- undisclosed broad refactors hiding inside a narrow product change (a deliberate, surfaced restructure that produces a simpler result is not this)

This is the taste pass. It should improve the shape of the implementation, not make it clever.

For UI diffs, include the `frontend-design` taste bar: the implementation should
match the existing system, expose expected states, avoid generic AI chrome, and
prove the rendered surface when a route, story, or preview exists.

### Pass 4: Project Conventions

Read the governing `AGENTS.md` and `CLAUDE.md` files. Check only rules relevant to the changed files.

Look for:

- ownership-boundary violations
- TypeScript or React conventions ignored by new code
- test harness conventions violated by new tests
- local naming, file placement, or helper patterns bypassed without reason
- forbidden shortcuts such as `any`, non-null assertions, weakened tests, or broad casts

Project conventions are evidence, not bureaucracy. If the local pattern is bad but entrenched, name the tradeoff instead of blindly enforcing it.

### Pass 5: Tests And Proof

Ask whether the changed contract is proven at the lowest meaningful seam.

Look for:

- missing test coverage for changed behavior
- tests that only prove wiring or mocks
- weak assertions that would pass if the bug remained
- browser/runtime proof missing for UI behavior when a route, story, or preview surface exists
- backend/request contracts not exercised with representative data

Do not demand tests for pure formatting or non-behavioral churn. Do not treat passing commands as product proof when the product surface still needs checking.

### Pass 6: Performance And Operational Cost

Run this pass proportionally. It is not a license to invent scale concerns.

Look for:

- N+1 queries, redundant network fetches, or repeated expensive transforms
- unnecessary allocations, copies, or conversions in hot paths
- unstable React references or avoidable rerenders in frequently used UI
- avoidable bundle impact
- polling, subscriptions, or cache invalidation that can duplicate work

Flag only when the cost is likely to matter for this product surface.

### Pass 7: Security And Robustness

Run this pass on real trust boundaries, not every line of code.

When the diff touches a boundary, first map what crosses it: external inputs,
auth/authz decisions, persistence or session state, external calls, and any
crypto, secrets, or private data.

Look for:

- unvalidated external input crossing a boundary
- auth/authz gaps
- injection, XSS, path traversal, command execution, or secret leakage
- error messages exposing private internals
- failure paths that leave persistent state inconsistent

Before reporting a finding, check whether the local owner already validates,
guards, escapes, or tests that path. Report the real gap, not the checklist
item.

If the diff does not touch a trust boundary, this pass should usually have no findings.

### Pass 8: Blast Radius

Ask whether changed public behavior has affected callers.

Early exit when no exported symbol, API shape, schema, shared state, public component contract, config default, or externally observable behavior changed.

Otherwise inspect likely callers/importers and look for:

- stale assumptions about argument order, return shape, side effects, defaults, or error behavior
- fixtures, mocks, schemas, or tests that should have changed
- re-exports or barrels exposing stale names
- shared state shape changes that consumers silently depend on
- migrations, deployment, or rollback concerns only when migration/schema/backfill files are actually in scope

Do not turn this into a production-support checklist. Stay tied to changed contracts.

## Step 4: Synthesize

Collect findings from the passes, deduplicate them, and drop anything that does not meet the bar.

Severity:

- `must-fix` - correctness, security, data integrity, or product-contract issue that should block shipping
- `should-fix` - meaningful maintainability, traceability, test, performance, or convention issue worth fixing before review/merge
- `nit` - small style or cleanup issue that is safe to ignore

Verdict:

- `Ship it` - no findings, or only ignorable nits
- `Minor nits` - only nits remain
- `Needs changes` - any `should-fix` or one contained `must-fix`
- `Rethink approach` - multiple `must-fix` findings, or one must-fix that undermines the core design

## Output

Start with findings. Keep the report dense and useful.

Use this shape:

```markdown
## Findings

### must-fix

| File | Issue | Fix |
| --- | --- | --- |
| `path/file.ts:42` | The changed resolver drops saved filters when the URL has no tab param. | Preserve the existing tab state before applying URL defaults. |

### should-fix

| File | Issue | Fix |
| --- | --- | --- |
| `path/file.ts:88` | The helper takes the whole chart but only reads `dateMode`. | Pass `dateMode` directly so the dependency is honest. |

## Verdict

Needs changes.

## Checks

- Typecheck: passed
- Touched tests: not run - no focused test command found
- Browser proof: not applicable
```

Rules:

- If there are no issues, say `No findings.` clearly.
- Always include a verdict.
- Always include checks/proof status, including what was not run.
- Keep issue text specific and short.
- Do not include time estimates.
- Do not include separate support, migration, deployment, or residual-risk sections unless the changed contract genuinely requires them.
- Do not apply fixes in this skill.

## Final Quality Gate

Before delivering, re-read every finding and ask:

- Is this introduced or materially affected by the changeset?
- Did I cite the right file and line?
- What actually breaks, gets worse, or becomes harder to maintain?
- Is the suggested fix concrete?
- Am I flagging this because it matters to the product/code, or because a checklist told me to?

Drop anything that fails those questions.
