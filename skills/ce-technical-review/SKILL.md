---
name: ce-technical-review
description: Run a rigorous multi-pass technical code review of recent changes. Use when the user asks for ce-technical-review, a technical review, a deep code review, quadruple-checking implementation quality, or a strict pre-commit audit focused on correctness, performance, traceability, elegance, conventions, security, adversarial cases, and blast radius.
---

# Technical Review

Run a rigorous, multi-pass technical review of the current changeset. Every
finding must cite a specific file and line.

This skill is review-only. Do not edit files, commit, push, open PRs, file
tickets, or apply fixes while using it.

## Step 0: Pre-Flight

Before spawning review agents, verify the code is in a reviewable state.

1. Run typecheck and lint for the touched surface when obvious, such as
   `pnpm tsc --noEmit` plus `pnpm lint` for TypeScript projects or
   `ruff check .` for Python projects.
2. If either fails, stop and report the failures. Do not proceed to the review
   passes; fix the basics first, then re-invoke.
3. If the repo has a fast test command that covers the changed area, run it.
   Slow or full suites can be skipped.

## Step 1: Identify The Changeset

1. Build the changed-file list from both tracked and untracked work:
   `git diff HEAD --name-only` plus `git ls-files --others --exclude-standard`.
   Filter out submodules, generated files, lockfiles, and vendored/minified
   assets unless the change is specifically about them. Before including
   untracked file contents, explicitly exclude likely secret or local config
   paths such as `.env*`, `.npmrc`, `.pypirc`, `*.pem`, `*.key`, `*.p12`,
   `*.pfx`, `id_rsa*`, `*_rsa`, `*credentials*`, `*secret*`, `*.local.*`, and
   `config.local.*` unless the review is specifically about that file and the
   sensitive values are redacted.
2. Run `git diff HEAD -- <tracked-files>` and keep the full tracked diff. For
   each untracked file in scope, include its full contents or a
   `git diff --no-index -- /dev/null <file> || true` patch so every review pass
   sees new files that have not been staged. Exit status 1 is expected for this
   command when the file has content; treat the patch output as success.
3. Note which files are new, untracked, or modified.
4. Find every governing instruction file from the repo root down to the deepest
   changed directory, especially `AGENTS.md` and `CLAUDE.md`.
5. This is the review scope: review only changed files and only issues
   introduced or materially affected by this changeset.

## Step 2: Decide Whether To Add Thermo-Nuclear Review

Optionally use `$ce-thermo-nuclear-code-quality-review` as an additional
maintainability pass when the implementation shape is a primary risk.

Use it when the diff includes any of these:

- large files or files crossing roughly 1000 lines
- sprawling new conditionals or special-case branches
- major refactors or changed ownership boundaries
- new abstractions, wrappers, state models, or shared helpers
- cast-heavy, loosely typed, or optionality-heavy code
- code that appears to work but feels tangled, indirect, or hard to trace

Do not use the thermo-nuclear pass for small, direct changes where correctness,
contracts, or tests are the main questions. If you use it, clearly label its
findings separately during synthesis and deduplicate them against the normal
technical passes.

## Step 3: Launch Review Passes

Run the eight technical passes in parallel when sub-agents are available. Use
the smallest reliable agent model that can read the diff and changed files. If
sub-agents are unavailable, run the passes sequentially in the parent agent.

Each pass must receive:

- the changed file paths
- the full diff from Step 1
- the governing `AGENTS.md` and `CLAUDE.md` paths relevant to the changed files
- the pass-specific review lens below
- this shared instruction:

> Read each changed file in full for context when reasonably sized. The diff is
> provided; use it to distinguish introduced lines from pre-existing code. Reason
> from the diff, changed files, and the check output already gathered in Step 0;
> do not rerun lint, typecheck, or tests yourself, because a read-only review
> sandbox rejects the temp files and sockets that tsx, Vite, and Vitest need to
> start. If a needed check never ran, report it as blocked rather than as a
> product test failure. Only flag issues introduced or materially affected by
> this changeset. Do not flag
> pre-existing issues unless a changed line directly interacts with them. Return
> at most 5 findings, ranked by severity. Report a flat list: severity
> (`must-fix`, `should-fix`, or `nit`), file path, line number, concrete
> description, and specific fix direction. If no issues, say `No issues.` No
> praise, no filler.

If the current repository has pass prompt files such as
`.claude/review/prompts/passes/*.md`, use those as the detailed pass
definitions. Otherwise use these pass lenses:

1. Correctness: product logic, state transitions, async ordering, error
   propagation, edge cases, API misuse, and behavior missing from the stated or
   inferred requirement.
2. Performance: query shapes, repeated expensive work, avoidable I/O,
   unnecessary allocations, hot paths, frequently rendered UI, cache behavior,
   and bundle impact.
3. Traceability: explicit data flow, honest helper signatures, hidden
   dependencies, duplicated derived state, nesting, vague naming, and comments
   compensating for unclear structure.
4. Elegance: minimalism, dead code, unnecessary wrappers, over-generalization,
   duplicate logic, and broad refactors hiding inside narrow changes.
5. Conventions: relevant `AGENTS.md` and `CLAUDE.md` rules, local patterns,
   test harness conventions, naming, placement, typing rules, and project
   boundaries.
6. Security: trust boundaries, external input validation, auth/authz,
   injection, XSS, path traversal, command execution, secret leakage, and
   private internal error exposure.
7. Adversarial: plausible failure scenarios inside the changed files, including
   surprising inputs, partial failures, races, nullish values, and malformed
   state.
8. Blast radius: changed exported symbols, public components, API shapes,
   schemas, shared state, config defaults, fixtures, mocks, re-exports, and
   likely callers/importers that depend on the changed contract.

## Step 4: Synthesize

Collect findings from all passes into one report.

1. Deduplicate findings. If multiple passes flag the same issue, keep it in the
   most relevant pass and note the other pass parenthetically.
2. Drop findings about unchanged code unless the changeset materially interacts
   with that code.
3. Re-check every finding against the evidence bar: specific line, introduced
   or affected by the diff, concrete consequence, and specific fix direction.

Severity:

- `must-fix`: correctness, security, data integrity, or product-contract issue
  that should block shipping.
- `should-fix`: meaningful performance, traceability, convention,
  maintainability, test-proof, or blast-radius issue worth fixing before merge.
- `nit`: small cleanup or style issue that is safe to ignore.

Verdict:

- `Ship it`: zero findings, or only trivially ignorable nits.
- `Minor nits`: only `nit` findings remain.
- `Needs changes`: any `should-fix` or one contained `must-fix` finding.
- `Rethink approach`: two or more `must-fix` findings, one `must-fix` that
  implicates the core design, or thermo-nuclear findings that show clear
  structural regression.

## Output

Start with findings. Use one section per pass that produced findings. Omit
empty pass sections unless every pass had no findings, in which case say
`No findings.`

End with:

- `Verdict`: one of the four verdicts above
- `Top issues`: up to three, ranked by impact
- `Suggested fixes`: one line per top issue
- `Checks`: lint, typecheck, tests, and any proof that was run or skipped

Keep the report dense and specific. Do not include time estimates. Do not apply
fixes.

## Next Step

After the verdict, recommend what to run next and fire it — do not end on a bare report. The menu is gated by the verdict, not a fixed list: show only the options that fit, mark the recommended one, and renumber so options stay contiguous from 1.

Use the platform's blocking question tool (`AskUserQuestion` in Claude Code, `request_user_input` in Codex, `ask_user` in Gemini, `ask_user` in Pi (requires the `pi-ask-user` extension)). In Claude Code, call `ToolSearch` with `select:AskUserQuestion` first if its schema isn't loaded — a pending schema load is not a reason to fall back. Fall back to a numbered chat list ("Pick a number or describe what you want.") only when no blocking tool exists or the call errors. Never end the turn without collecting a response. Act on the selection — invoke the routed skill via the platform's skill primitive — do not merely name it.

Gate the options on the verdict:

- **`Ship it` / `Minor nits`:** `git-commit-push-pr` to ship (recommended), or `git-commit` for a local commit only. Add `ce-simplify-code` only when nits worth cleaning remain.
- **`Needs changes`:** `ce-work` to address the findings (recommended), or `ce-debug` when the findings are bugs, regressions, or failing tests. After the fix lands, re-run the relevant passes on the changed surface.
- **`Rethink approach`:** `ce-plan` to rework the approach (recommended), or `ce-brainstorm` / `ce-grill` when the product framing itself is in question. Offer `ce-work` only for any contained finding safe to fix in place.

Always include a `Done for now` option that ends the turn without follow-up work.

**Sub-step guard:** When another skill invoked this as a sub-step (e.g., `ce-work` owns the finish), skip the menu — return the verdict and findings and let the caller route. Present the menu only when this skill owns the turn's endpoint.

This skill is review-only — routing to `ce-work` or `ce-debug` is the apply path; never apply fixes from here.
