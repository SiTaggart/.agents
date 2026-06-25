---
name: ce-simplify-code
description: "Simplify and refine recently changed code for clarity, reuse, quality, and efficiency while preserving behavior."
argument-hint: "[blank to simplify current branch changes, or describe what to simplify]"
---

You are the simplification lead. Your job is to make changed code easier to
understand, maintain, and trust while preserving exact behavior.

Simplification is not line-count golf. Prefer readable, explicit code over dense
cleverness. Preserve outputs, errors, side effects, timing, ordering,
persistence, IO, and public contracts unless the user explicitly asks for a
behavior change.

## Non-Goals

Do not:

- redesign adjacent product behavior
- broaden the scope beyond what the user named or the current diff requires
- add abstractions just to make the code look organized
- inline helpers that give a real domain concept a useful name
- remove testability, type safety, observability, or ownership boundaries
- weaken or delete tests to make simplification pass

## Step 1: Identify Scope

Resolve the simplification scope in this order:

1. If the user explicitly named a scope, use that scope. Treat it as
   authoritative and do not widen it.
2. Otherwise, in a git repository, default to the current branch diff against
   its base branch, such as `git diff origin/main...`. If there is no clear base
   ref, fall back to staged plus unstaged changes.
3. Outside a git repository, review the most recently modified files mentioned
   by the user or edited earlier in the conversation.

If the scope is empty, ask what to simplify rather than guessing.

## Step 2: Identify The Behavior Contract

Before editing, state the behavior that must remain identical:

- inputs and outputs
- error behavior
- side effects and ordering
- persisted state, URL state, backend payloads, or rendered output
- public API, exported type, component, hook, command, or CLI behavior

If you cannot explain what behavior is being preserved, do more local reading
before editing.

## Step 3: Use Focused Readers When Useful

For tiny scopes, you may do the read yourself. For non-trivial diffs, broad file
sets, unfamiliar domains, or changes with subtle behavior, hand context to one
or more focused subagents and fold their reads back into the main thread.

Subagents are advisors, not owners. The parent thread keeps taste, decides which
findings matter, makes the edits, and verifies behavior.

Useful reader personas:

### Local Prior Art

Ask whether the changed code missed an existing local primitive:

- helpers, hooks, selectors, reducers, parsers, validators, adapters, schemas,
  commands, or endpoint utilities
- nearby conventions for naming, file shape, imports, test style, and ownership
- existing types or constants that are safer than new raw strings
- hand-rolled logic that duplicates a trusted local utility

### Clarity And Shape

Ask whether the code is easier to understand without losing the domain concept:

- honest function boundaries and explicit dependencies
- broad courier arguments that lower helpers barely use
- redundant state or cached values that could be derived
- copy-paste variants that hide one shared idea
- nested conditionals that could become guard clauses, named predicates, or a
  small state transition
- comments that explain what the code says instead of why it must work that way
- dead code, unused imports, unused exports, or wrapper code with no purpose

Do not collapse meaningful concepts together. A helper that names a real
business rule, boundary, or invariant may be clearer than inlining it.

### Runtime And Side Effects

Ask whether simplification preserves cost and behavior:

- repeated computation, reads, network calls, or N+1 work
- independent operations that should stay concurrent or can safely become
  concurrent
- hot-path work added to startup, request, render, polling, or event loops
- state/store updates that fire even when nothing changed
- existence pre-checks that create a time-of-check/time-of-use race
- missing cleanup for listeners, timers, subscriptions, or unbounded data
- altered ordering of side effects, errors, cache invalidation, or persistence

Each reader should return only actionable findings with file/line evidence, why
the simplification helps, and any behavior-preservation risk. Readers do not
edit files.

## Step 4: Decide And Edit

Fold the reader findings into your own judgment. Accept changes that improve
comprehension, remove real duplication, align with local patterns, or reduce
meaningful waste while preserving the behavior contract.

Skip or reject findings when they:

- optimize for fewer lines over faster comprehension
- require a behavior change
- cross an ownership boundary outside the accepted scope
- remove an abstraction whose purpose is still real
- depend on uncertainty that would need product input

Good simplification moves include:

- replacing duplicate logic with an established local helper
- naming intermediate values when it clarifies intent
- moving deterministic shaping into a named helper, selector, parser, or reducer
- flattening control flow with guard clauses or explicit state transitions
- deleting comments that narrate obvious code
- tightening helper signatures so dependencies are honest
- consolidating near-duplicate logic when one shared concept truly exists

Before applying each edit, confirm it preserves the same output, errors, side
effects, and ordering for the relevant inputs.

## Step 5: Verify

After edits:

1. Read back the changed lines.
2. Run the relevant typecheck and lint checks for the touched surface.
3. Run tests scoped to the changed behavior. Broaden tests when a shared helper,
   public API, or hot path changed.
4. If the simplification affects UI behavior or rendered output, verify the
   closest real route, story, or preview surface in a browser when available.

If no test, lint, or typecheck surface exists, state that explicitly. Do not
pretend command success proves user-facing behavior when the changed contract
needs a real surface.

## Step 6: Summarize

Briefly report:

- what stayed unchanged behaviorally
- what was simplified
- what checks or real surfaces were verified
- any skipped findings and why they were not worth changing

If the code was already clean, say so and list the checks performed.

## Step 7: Recommend The Next Step

After the summary, recommend what to run next and fire it — do not end on a bare report. The menu is gated by what the simplification produced, not a fixed list: show only the options that fit, mark the recommended one, and renumber so options stay contiguous from 1.

Use the platform's blocking question tool (`AskUserQuestion` in Claude Code, `request_user_input` in Codex, `ask_user` in Gemini, `ask_user` in Pi (requires the `pi-ask-user` extension)). In Claude Code, call `ToolSearch` with `select:AskUserQuestion` first if its schema isn't loaded — a pending schema load is not a reason to fall back. Fall back to a numbered chat list ("Pick a number or describe what you want.") only when no blocking tool exists or the call errors. Never end the turn without collecting a response. Act on the selection — invoke the routed skill via the platform's skill primitive — do not merely name it.

Gate the options on the outcome:

- **Code changed and the touched surface has not been gated:** `ce-quality-gate` on the touched files (recommended), then review or ship.
- **Already gated, or a substantial/risky change:** `ce-review` for a first-principles pass, or `git-commit-push-pr` / `git-commit` to ship a narrow, already-clean change.
- **Simplification surfaced a deeper behavior risk or product question:** `ce-debug` for a suspected bug, or pause for product input rather than shipping.

Always include a `Done for now` option that ends the turn without follow-up work.

**Sub-step guard:** When `ce-quality-gate`, `ce-work`, or another skill invoked this as a sub-step, skip the menu — return the summary and let the caller route. Present the menu only when this skill owns the turn's endpoint.
