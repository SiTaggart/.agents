---
name: ce-work
description: Execute implementation work with a compact product-contract loop. Use when the user asks to build, fix, implement, polish, or finish a scoped task. Favor reasoning, prior art, smallest correct changes, focused tests, and real-surface proof. Do not run autonomous PR, CI, ticket, or residual-work pipelines.
argument-hint: "[task description, issue/PR reference, or plan path]"
---

# Focused Work Execution

Ship the accepted task without turning the work into a ceremony. The skill should help the model reason better, not replace judgment with a workflow.

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

## Step 1: Understand The Task

Read the prompt, relevant plan or issue, recent conversation, and current repository state.

If the input is a plan document, use it as context, not as an execution script. Preserve its scope boundaries and requirements, but do not mechanically mirror every section as a task.

If the input is a bare request, infer the likely files and behavior from the repository. Ask the user only when the answer would materially change product behavior, ownership boundary, data model, or risk.

State the contract and owner boundary before editing when the change affects product behavior.

## Step 2: Find Prior Art

Search before building.

Use local knowledge and repository context in this order:

1. Existing code in the affected area
2. Nearby tests and fixtures
3. Project instructions such as `AGENTS.md` and `CLAUDE.md`
4. Existing docs, QMD, or `.ai/` artifacts when the task is broad or historical context matters
5. Official external docs only when the task depends on current external API behavior

Look for the mature local pattern, not just the first similar file. If the area is prototype-like, use it to understand the contract but set the quality bar from the best nearby production code.

When the task depends on product memory, search QMD or Obsidian notes for
interviews, transcripts, research summaries, PRDs, kickoff docs, or prior agent
sessions before inventing context.

When repo context is broad, unfamiliar, or crosses many files, use `repoprompt`
to build codebase context before choosing an approach. Treat its output as
context for owner boundaries, data flow, and tests, not as permission to expand
scope.

## Step 3: Choose The Smallest Sound Approach

Prefer a direct fix at the owner boundary.

Use this decision order:

1. Can an existing owner component, hook, helper, schema, or command already represent the behavior?
2. Can the fix be a focused change to a pure helper, selector, parser, reducer, state transition, schema, or adapter?
3. Does this need UI behavior, backend/request behavior, URL/persistence behavior, or test harness changes?
4. Would a proposed abstraction remove real complexity, or is it only packaging?

Pause before crossing into adjacent UX, validation, focus behavior, styling, data modeling, persistence, or infrastructure. Ask the user if that broader contract is actually desired.

For TypeScript and React:

- Prefer explicit object shapes with `interface` and unions/utilities with `type`
- Prefer function declarations for React components
- Avoid `any` and non-null assertions
- Pass honest helper arguments instead of broad courier objects
- Keep JSX from carrying business rules when a pure helper would make the contract clearer

For frontend work, use `frontend-design` as a guide inside this loop. Match the
existing design system first, then verify the changed route, story, or preview
surface visually when one exists.

## Step 4: Implement In Tight Loops

Work in small enough steps that failures stay local.

For each meaningful edit:

1. Read the surrounding code first.
2. Apply the narrow change.
3. Read back the changed lines.
4. Run the most relevant focused check before moving far away from the file.

Use a task list only when it reduces risk: multiple files, dependencies, or several behavioral slices. For one- or two-file work, skip ceremony and implement directly.

Use subagents only for clearly independent investigation or large implementation slices with low file overlap. Prefer the parent agent for product reasoning and final integration.

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
file list.

It must make the touched lint, format, type, and test surface clean, or report
the exact blocker and narrower proof that passed. This gate does not replace
product proof, browser proof, or review of substantial work.

## Step 7: Review The Diff

Before calling the task done, review your own diff with the same taste bar as `ce-review`:

- Does the implementation satisfy the product contract?
- Is the data flow traceable?
- Is there less code that would do the same thing as clearly?
- Did the fix stay inside the right owner boundary?
- Are tests and real-surface proof proportional to risk?
- Did you avoid adding support, migration, deployment, or residual-work process unless the diff actually needed it?

Invoke `ce-review` only when the change is substantial, risky, or the user asks for a review. Treat its output as advice to reason about, not a machine queue to apply blindly.

## Step 8: Finish Clearly

Finish with a concise report:

- what changed
- what product contract is now true
- what checks or proof passed
- what was not verified and why
- any narrow follow-up that is genuinely outside the accepted contract

Do not offer a generic menu. Do not ask the user to pick from process options after the work is complete.

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
