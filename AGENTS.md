# AGENTS.md

Global instructions for coding agents. Project-level `AGENTS.md` or `CLAUDE.md`
files add local context and override only overlapping instructions.

## Context Gate

- For project, code, docs, planning, review, and debugging work, gather context
  before answering, planning, or editing. No cold answers from memory.
- Start each session or task with the closest applicable context pass:
  - Read the local `AGENTS.md` or `CLAUDE.md`, task docs, and relevant project
    files.
  - Run QMD against durable knowledge for non-trivial work, broad explanations,
    plans, reviews, or any task where history may matter. Search exact terms
    first; add semantic or expanded searches when vocabulary is uncertain.
  - Use RepoPromptCE for non-trivial codebase context. Prefer MCP tools:
    `file_search`, `get_file_tree`, `read_file`, `get_code_structure`,
    `context_builder`, and `manage_selection`. If MCP is unavailable, use
    `rpce-cli`. Fall back to `rg` and shell reads only when RepoPromptCE is
    unavailable or the scope is exact and small.
- Inspect source files to verify drift-prone or implementation-level details
  surfaced by QMD or RepoPromptCE.
- State what context was checked in the final answer. If QMD or RepoPromptCE was
  skipped, state the concrete reason.

## Working Style

- Work with a senior Design Engineer specializing in TypeScript and React.
- Aim for the smallest *resulting* system, not the smallest diff. Size is the
  essential complexity carried forward — concepts, indirection, special cases,
  total code — measured after the change, not the distance from the current
  shape. A refactor that removes more complexity than it adds is a smaller
  change than a one-line patch that props up a structure that should not exist.
- Treat the current shape as a candidate, not a constraint. Before patching, ask
  whether you would arrive at this structure building it fresh today. When the
  difficulty comes from the existing architecture, name replacing it as an
  option and surface the tradeoff — do not silently engineer around a shape that
  should be torn out.
- Wake up smarter than yesterday. Hold your own plan loosely: when new evidence
  shows the approach is wrong, back out the bad path and re-approach from the
  better structure rather than patching forward to protect work already done.
  Sunk effort is not a reason to ship a worse design.
- Understand the business reason before optimizing the code shape.
- Find root causes. Do not ship temporary fixes unless explicitly asked.
- Preserve local intent, naming, ownership boundaries, and file conventions in
  code you are not deliberately reshaping. The structure you are fixing is fair
  game; surrounding code is not.
- Do not drift into refactoring unrelated code. Reshaping the structure that
  causes the problem is in scope; tidying neighboring code the task does not
  touch is not.
- Prefer compile-time guarantees over runtime checks when the type system can
  prevent the bug.
- Do not add abstractions, wrappers, adapters, type guards, defensive helpers, or
  edge-case handling for hypothetical future needs. Add them only when the
  current contract, a real runtime boundary, or existing duplication requires it.
- Rely on TypeScript inference and existing typed boundaries. Parse or guard once
  at actual untyped or untrusted boundaries, then keep the interior code direct.
- Remove filler. Comments explain why, not what.

## Product Contract

- Before editing, identify the contract being changed: user action, UI state,
  backend payload, URL state, persisted state, rendered output, command behavior,
  or published artifact.
- Identify the owner boundary that should contain the change.
- Prove the changed contract at the closest real surface:
  - UI state and rendered output agree.
  - UI changes are checked in a real browser or local browser automation when a
    route, story, or preview surface exists.
  - Backend and request contracts are exercised with real or representative data.
  - Docs are updated in the canonical destination and read back.
  - Touched files are clean for relevant lint, format, type, test, and
    `code-taste` gates.
- State what was proven and what was not. Do not let passing commands stand in
  for user-facing verification.

## Scope

- Completeness means fully solving the accepted product contract, not expanding
  the contract.
- Boil the ocean inside the agreed boundary: finish the accepted task, with tests
  and proof, without drifting into neighboring workflows.
- Prefer direct edits over new abstractions. Stop when the accepted contract is
  proven.
- Do not improve adjacent UX, focus behavior, validation, styling, data modeling,
  persistence, or ownership boundaries unless the user explicitly asks or the
  accepted contract cannot work without it.
- If a fix grows past 3-4 files, pause — not automatically to shrink it, but to
  decide which change is smaller in carried complexity. If the larger-surface
  change is the simpler end state, surface both options and the tradeoff rather
  than defaulting to the smaller diff. Explain why the chosen surface is
  necessary.

## Product Architecture

- Prefer contract-oriented code: a typed domain core with explicit IO, UI, and
  imperative-integration boundaries.
- Treat user actions, URL state, persisted state, backend payloads, mutations,
  subscriptions, cache invalidation, and rendered output as product contracts.
- Encode contracts with TypeScript types, schemas, endpoint metadata,
  discriminated unions, or explicit state-machine actions.
- Put deterministic behavior in named, typed, testable modules: schemas, parsers,
  reducers, selectors, validators, compilers, hydrators, adapters, and model
  helpers.
- Keep React components and hooks focused on rendering, user interaction,
  external subscriptions, IO coordination, cache coordination, navigation,
  analytics, dialogs, and imperative interop.
- Treat `useEffect` as a code smell. Avoid it for product/domain state,
  derivation, event handling, data loading, backend shaping, or parent-child
  synchronization; use event handlers, reducers/selectors, query/mutation hooks,
  framework data APIs, or explicit subscriptions instead.
- Centralize IO behind query, mutation, or command adapters. Do not scatter
  fetches, saves, invalidation, or backend shaping through UI components.
- Pass honest dependencies into helpers. Avoid broad courier objects unless the
  function owns a broad transition or invariant.
- Use `code-taste` before implementation for tactical TypeScript, React,
  helper-boundary, and code-shape decisions.

## Non-Negotiables

- Never commit `.env`, secrets, API keys, credentials, or private tokens.
- Never push directly to `main` or `master`.
- Never use `any` to silence TypeScript errors. Fix the type boundary.
- Never use `!` non-null assertions. Handle the null case.
- Never delete, weaken, or skip tests to make a change pass.
- Never assume an edit succeeded. Read back changed lines after editing.
- Never run destructive git commands or revert user changes unless explicitly
  asked.
- Run the relevant linter, type-checker, and tests before marking work done, or
  report the exact blocker and the narrower verification that passed.

## Phase Skills

- Discover/context: use `qmd`, Obsidian skills, `ce-sessions`,
  `ce-slack-research`, and `repoprompt` when broad codebase context is needed.
- Frame: use `ce-brainstorm`; add `ce-grill` for branchy or strategic
  ambiguity; use `document-review` for requirements docs.
- Plan: use `ce-plan`; layer in `repoprompt` for broad codebase context and
  `document-review` for markdown plans.
- Work: use `ce-work`; route TypeScript, React, or code-shape decisions through
  `code-taste` before implementation; fold in `frontend-design` for UI; run
  `ce-quality-gate` after code edits. Code-taste cleanliness is part of the
  completion gate for touched code.
- Review: use `ce-review` for built work; use `code-taste` for maintainability
  and implementation-shape judgment; use `ce-simplify-code` for cleanup; use
  `security-review` only for real trust-boundary or security asks.
- Ship/feedback: use `git-commit`, `git-commit-push-pr`, `gh-fix-ci`, and
  `resolve-pr-feedback` for git and PR ops.
- Remember: use `ce-compound`, `ce-compound-refresh`, QMD, and Obsidian for
  durable knowledge.

## Tooling

- Use RepoPromptCE for non-trivial codebase exploration and review when
  available:
  `file_search`, `get_file_tree`, `read_file`, `get_code_structure`,
  `context_builder`, and `manage_selection`.
- If RepoPromptCE MCP is unavailable, use `rpce-cli`; then fall back to shell
  tools.
- Prefer `rg` and `rg --files` for shell search.
- Use direct, non-interactive commands.
- For frontend changes, open the relevant route, story, or preview surface when
  available. Exercise the changed state and inspect the final rendered result.
- If browser tooling or the server is unavailable, use the closest available
  proof surface and report the blocker.

## Task Artifacts

- Keep generated agent artifacts under `.ai/`.
- Create durable todos or lesson notes only when the task genuinely needs them
  or a user correction reveals a repeatable pattern.
- For upstream instructions that mention bare `docs/` paths for agent artifacts,
  prefix them with `.ai/`.
- For docs, specs, research, and PR descriptions, identify the canonical
  publishing surface before editing. If Linear or GitHub is canonical, treat
  local markdown as the working copy and read back the published version.
