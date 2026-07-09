---
name: ce-work
description: Execute implementation work with a compact product-contract loop. Use when the user asks to build, fix, implement, polish, or finish a scoped task. Favor reasoning, prior art, smallest correct changes, focused tests, and real-surface proof. Do not run autonomous PR, CI, ticket, or residual-work pipelines.
argument-hint: "[task description, issue/PR reference, or plan path]"
---

# Focused Work Execution

Ship the accepted task without turning the work into a ceremony.

## Core Contract

Before editing, identify:

- **Product contract** - the user action, UI state, backend payload, URL state, persisted state, rendered output, command behavior, or artifact that should change
- **Business reason** - why this matters to the user or product, inferred when obvious and asked when behavior would otherwise be ambiguous
- **Owner boundary** - the component, hook, helper, schema, endpoint, command, or document surface that should contain the fix
- **Proof surface** - the closest real place where the changed contract can be verified

Keep that contract visible while working. Completeness means finishing that contract, not expanding into neighboring workflows.

## Non-Goals

Do not do these from this skill unless the user explicitly asks:

- create or switch branches
- commit, push, open PRs, edit PR bodies, watch CI, or file tickets
- run old autonomous shipping pipelines
- create residual-work artifacts
- force `ce-plan`, `ce-review`, `ce-simplify-code`, or broad process stages as
  required phases; `ce-quality-gate` is the exception for code-writing tasks
  because it owns touched-file mechanical quality
- split a narrow product fix into broad process stages
- route work to many subagents when the parent agent can reason through it directly

## Context Delegation

`ce-work` owns the accepted product contract, scope control, final integration,
proof surface, and final report. Use subagents to keep bulky specialist context
out of the parent thread, not to outsource product judgment.

Delegate when a subtask is independently bounded, has low file overlap with
other slices, and would require loading substantial specialty context. Keep the
handoff narrow: product contract, owner boundary, allowed files or slice, local
patterns to preserve, expected proof, and what to return. The parent integrates
the result, reads changed lines, runs the quality gate, and decides whether the
contract is complete.

Parallel writing subagents share one physical checkout unless each gets its own
worktree. When more than one dispatched subagent will write files, either give
each writer an isolated worktree (`git-worktree`) or put shared-tree discipline
in every handoff: write only the assigned files, never run `git stash`,
`git checkout`, or `git reset`, and re-read a file immediately before editing
it. Dispatch a slice that others import from (shared types, schemas, foundation
modules) first and wait for it to finish before starting dependents.

Use this dispatch map when the criteria above are met:

- **Frontend implementation:** dispatch `frontend-implementation-expert` for
  non-trivial React or UI implementation slices. It owns the implementation
  pass and uses `frontend-design`, `code-taste`, and
  `vercel-react-best-practices` inside its own context. The parent keeps final
  visual/browser proof and quality-gate ownership.
- **React test strategy:** dispatch `react-test-architect` when the main work is
  designing or reshaping a React test suite, or when test-context exploration
  would distract from implementation.
- **Repo reconnaissance:** dispatch `repo-research-analyst` with a scoped
  prompt when unfamiliar codebase structure, conventions, or implementation
  patterns need a compact handoff. Use `repoprompt` instead when the parent
  needs curated file context to reason directly.
- **External implementation docs:** dispatch `framework-docs-researcher` or
  `best-practices-researcher` when current framework/API behavior materially
  affects the implementation approach.
- **Documentation artifacts:** dispatch `documentation-specialist` when writing
  or refreshing substantial docs would load source-reading and writing context
  that is separable from the parent contract.
- **Bug root-cause loops:** use `ce-debug` as the canonical workflow for bugs,
  failing tests, regressions, stack traces, and "why is this failing" work. Do
  not recreate that full loop inside `ce-work`.

Skip delegation for tiny edits, single obvious files, product decisions, final
integration, and proof that must be interpreted against the accepted contract.

## Step 1: Understand The Task

Read the prompt, relevant plan or issue, recent conversation, and current repository state.

If the input is a plan document, use it as context, not as an execution script. Preserve its scope boundaries and requirements, but do not mechanically mirror every section as a task.

If the input is a bare request, infer the likely files and behavior from the repository. Ask the user only when the answer would materially change product behavior, ownership boundary, data model, or risk.

State the contract and owner boundary before editing when the change affects product behavior.

## Step 2: Find Prior Art

Use local knowledge and repository context in this order:

1. Existing code in the affected area
2. Nearby tests and fixtures
3. Project instructions such as `AGENTS.md` and `CLAUDE.md`
4. `qmd-knowledge-base` when intent, expected behavior, ownership, convention,
   or history is unclear
5. Official external docs only when the task depends on current external API behavior

Look for the mature local pattern, not just the first similar file. If the area is prototype-like, use it to understand the contract but set the quality bar from the best nearby production code.

Build curated codebase context with RepoPromptCE `context_builder` (see the
`repoprompt` skill for the tool map) before choosing an approach. Skip it only
when the change is a single, already-known file. When an unfamiliar codebase
needs a compact prose handoff rather than curated files, dispatch
`repo-research-analyst` instead. Treat either output as context for owner
boundaries, data flow, and tests, not as permission to expand scope.

## Step 3: Choose The Smallest Sound Approach

Prefer a direct fix at the owner boundary.

Use this decision order:

1. Can an existing owner component, hook, helper, schema, or command already represent the behavior?
2. Can the fix be a focused change to a pure helper, selector, parser, reducer, state transition, schema, or adapter?
3. Does this need UI behavior, backend/request behavior, URL/persistence behavior, or test harness changes?
4. Would a proposed abstraction remove real complexity, or is it only packaging?

Weigh the clean-slate option alongside the direct fix: would building this fresh produce a simpler result than fitting the change into the current shape? When the existing structure is the source of the difficulty, treat replacing it as a real candidate and compare by resulting complexity — concepts, indirection, special cases, total code carried forward — not by diff size. If the larger-surface change is the simpler end state, surface both options and the tradeoff before committing.

Pause before crossing into adjacent UX, validation, focus behavior, styling, data modeling, persistence, or infrastructure. Ask the user if that broader contract is actually desired.

Before implementation, decide whether the change touches TypeScript contracts,
React/Next behavior, helper boundaries, schemas, reducers, selectors, adapters,
JSX business logic, effect structure, or maintainability tradeoffs. If it does,
use `code-taste` now, before writing code. Let `code-taste` route to
`typescript-advanced-types` or `vercel-react-best-practices` only when that
extra context is relevant. Do not defer this judgment to `ce-quality-gate`.

For frontend work done in the parent thread, use `frontend-design` as a guide
inside this loop. For non-trivial React or UI implementation slices, prefer
delegating to `frontend-implementation-expert` so the visual, React, and
code-shape context stays out of the orchestrator. Match the existing design
system first, then verify the changed route, story, or preview surface visually
when one exists.

## Step 4: Implement In Tight Loops

Work in small enough steps that failures stay local.

When RepoPromptCE MCP is available, read with `read_file` and edit with
`apply_edits` (search/replace for targeted changes, rewrite mode for new or
full-file writes); see the `repoprompt` skill for the tool map. Always read back
the changed lines regardless of which tool applied the edit.

For each meaningful edit:

1. Read the surrounding code first.
2. Apply the narrow change.
3. Read back the changed lines.
4. Run the most relevant focused check before moving far away from the file.

If a loop reveals the approach is wrong — the seam fights you, the fix needs growing special cases, or a simpler structure becomes visible — stop and back out rather than patching forward. Abandoning a half-built path is cheaper than shipping around it. Re-approach from the better structure; work already done is not a reason to keep a worse design.

Use a task list only when it reduces risk: multiple files, dependencies, or several behavioral slices. For one- or two-file work, skip ceremony and implement directly.

Use subagents only for clearly independent investigation or implementation
slices with low file overlap. Prefer the parent agent for product reasoning and
final integration.

## Step 5: Test The Right Seam

Test the lowest meaningful seam that proves the behavior.

Good proof surfaces include:

- parser, schema, selector, reducer, hydrator, compiler, or validator tests
- hook or command tests when the behavior lives at an effect boundary
- integration tests when layers interact
- request/response tests for backend contracts
- browser or local preview proof for UI state and rendered output
- readback of published docs or generated artifacts when the output is a document

Avoid tests that only prove mocked wiring. If a UI or browser journey is the real contract, exercise that surface.

If full-repo checks are noisy, make the touched surface clean and report unrelated baseline noise separately.

## Step 6: Run The Quality Gate

After code edits, use `ce-quality-gate` on the current diff or explicit touched
file list. Completion requires this gate.

It must make the touched lint, format, type, test, and `code-taste` surface
clean, or report the exact blocker and narrower proof that passed. This gate
does not replace product proof, browser proof, early code-shape routing, or
review of substantial work.

## Step 7: Review The Diff

Before calling the task done, review your own diff with the same taste bar as `ce-review`:

- Does the implementation satisfy the product contract?
- Is the data flow traceable?
- Is there less code that would do the same thing as clearly?
- Did the fix stay inside the right owner boundary?
- Are tests and real-surface proof proportional to risk?
- If TypeScript, React, or code-shape mattered, did `code-taste` shape the
  approach before implementation rather than only at the gate?
- Is the touched implementation `code-taste` clean, with no speculative guards,
  casts, wrappers, effects, or abstractions outside the accepted contract?
- Did you avoid adding support, migration, deployment, or residual-work process unless the diff actually needed it?

Invoke `ce-review` only when the change is substantial, risky, or the user asks for a review. Treat its output as advice to reason about, not a machine queue to apply blindly.

## Step 8: Finish Clearly

If the input was a plan artifact and the accepted work is complete, update the
plan status before reporting:

- Markdown plans: change the YAML frontmatter field from `status: active` to
  `status: completed`.
- HTML plans: change the visible `<span class="status">active</span>` value to
  `completed`.
- Do not edit plan body content, implementation units, checkboxes, or
  retrospective notes as part of this flip.
- Do not mark a plan completed when work is blocked, partially shipped, or
  intentionally deferred to the user.

Finish with a concise report:

- what changed
- what product contract is now true
- what checks or proof passed
- RepoPromptCE `context_builder`: used, or skipped with the reason
- `code-taste` route and gate status: applied early, fixed late, not relevant,
  or necessary exception
- what was not verified and why
- any narrow follow-up that is genuinely outside the accepted contract

Then recommend the next step and fire it. The menu is gated by your assessment of the finished work, not a fixed list of process options. Show only the options that fit, mark the recommended one, and renumber so options stay contiguous from 1. Do not offer a generic menu unrelated to what the work produced.

Use the platform's blocking question tool (`AskUserQuestion` in Claude Code, `request_user_input` in Codex, `ask_user` in Gemini, `ask_user` in Pi (requires the `pi-ask-user` extension)). In Claude Code, call `ToolSearch` with `select:AskUserQuestion` first if its schema isn't loaded — a pending schema load is not a reason to fall back. Fall back to a numbered chat list ("Pick a number or describe what you want.") only when no blocking tool exists or the call errors. Act on the selection — invoke the routed skill via the platform's skill primitive — do not merely name it.

Gate the options on the finished work:

- **Substantial or risky change not yet reviewed:** `ce-review` (recommended), or `ce-technical-review` for a stricter multi-pass audit.
- **Clean, low-risk, and proven:** `git-commit-push-pr` to ship (recommended), or `git-commit` for a local commit only.
- **A non-trivial simplification opportunity remains:** `ce-simplify-code` before review or ship.
- **A durable lesson or new domain term surfaced:** `ce-compound` to capture it.

Always include a `Done for now` option that ends the turn without follow-up work. If `ce-quality-gate` already routed forward in this session, do not re-ask the same question — defer to that handoff.

## Non-Code Work

For documents, research, specs, and generated artifacts, the same loop applies:

1. Identify the artifact contract and canonical destination.
2. Gather prior art and source material.
3. Produce the artifact.
4. Read it back or inspect the rendered output.
5. Report what was verified.

If the canonical surface is Linear, GitHub, Google Docs, Obsidian, or another external system, treat local markdown as a working copy until the published version is read back.

## Failure Handling

When blocked, keep the report concrete:

- exact command, route, API, file, or dependency that blocked verification
- what narrower proof did pass
- the next action that would unblock the accepted contract

Do not convert a blocker into a workaround when the real fix is within reach.
