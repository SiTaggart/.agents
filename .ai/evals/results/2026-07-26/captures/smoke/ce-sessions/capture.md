# ce-sessions smoke capture

## Scope

- Question: What prior sessions worked on ce-plan output-mode resolution or its regression evals?
- Run date: 2026-07-25, America/Los_Angeles
- Repository: `/Users/staggart/orca/workspaces/.agents/bowhead`
- Branch: `SiTaggart/bowhead`
- Scan window: rolling 7 days. The window was not widened because the narrow scan found a strongly relevant candidate.
- Scratch directory: `/tmp/ce-sessions-zHmnb2`

## Inventory command and metadata

File-backed inventory:

```sh
bash skills/ce-sessions/scripts/discover-sessions.sh bowhead 7 | tr '\n' '\0' | xargs -0 python3 skills/ce-sessions/scripts/extract-metadata.py --cwd-filter bowhead
```

Metadata:

```json
{"_meta": true, "files_processed": 206, "parse_errors": 0, "filtered_by_cwd": 205}
```

Keyword inventory:

```sh
bash skills/ce-sessions/scripts/discover-sessions.sh bowhead 7 | tr '\n' '\0' | xargs -0 python3 skills/ce-sessions/scripts/extract-metadata.py --cwd-filter bowhead --keyword 'ce-plan,output-mode,output mode,regression eval'
```

Metadata:

```json
{"_meta": true, "files_processed": 206, "parse_errors": 0, "filtered_by_cwd": 205, "files_matched": 1}
```

Hermes prompt-only inventory:

```sh
hermes sessions export --cwd /Users/staggart/orca/workspaces/.agents/bowhead --only user-prompts --format jsonl --redact --yes /tmp/ce-sessions-zHmnb2/hermes-prompts.jsonl
```

Metadata: 0 prompts exported.

## Platforms

- Scanned file-backed stores: Claude Code, Codex, Cursor.
- Repository-filtered inventory: 1 Claude Code session, 0 Codex sessions, 0 Cursor sessions.
- Hermes: 0 prompt records.

## Selection

- Selected count: 1.
- Selected ID: `651efa4b-8134-4943-87d7-e0fb94ac5dbe`.
- Platform: Claude Code.
- Branch: `SiTaggart/bowhead`.
- Timestamp range: 2026-07-26 00:23:14Z to 02:07:50Z.
- Keyword matches: 33 total (`ce-plan`: 27, `output-mode`: 5, `output mode`: 0, `regression eval`: 1).
- Current session ID `019f9cab-d5f4-77e1-ac0a-e2411c5049fc` was excluded and was not present in the inventory.

## Extraction

- Path: `/tmp/ce-sessions-zHmnb2/651efa4b-8134-4943-87d7-e0fb94ac5dbe.skeleton.txt`
- Status: success.
- Bytes: 45,021.
- Lines: 973.
- Parse errors: 0.
- Errors-mode extraction: skipped because the question did not require investigation dead ends.

## Guardrail evidence

- Discovery used only the skill's discovery and metadata-extraction scripts.
- No whole session file was read into orchestrator or synthesizer context.
- The only deep extraction used `extract-skeleton.py --output`.
- Raw tool inputs, raw tool outputs, and reasoning blocks were not included in the synthesis.
- One prior session was selected, below the five-session cap.
- The current session was not selected.
- The synthesis subagent received only the extracted skeleton path and small discovery metadata.
- The synthesis subagent was instructed to perform no discovery and no writes.
- No skill or agent file was edited or committed by this workflow.

## Synthesis dispatch

- Subagent: `session-historian`.
- Model tier: balanced mid-tier (`gpt-5.6-terra`).
- Context fork: none.
- Result: completed.

## Synthesis result

## Provenance

One Claude session on branch `SiTaggart/bowhead`, 2026-07-26 00:23–02:07.

## What was tried before

- Added regression-eval suites for `ce-brainstorm`, `ce-plan`, and `ce-ideate` during the CE-suite cleanup.
- Defined a manual evaluation process: cold, isolated runner sessions; scripted replies for blocking questions; repeated runs to account for model variance.
- Planned `ce-plan` coverage as six mechanical evals, alongside deeper authored suites for brainstorm and ideate.
- Created `.ai/evals/RUNBOOK.md` to hand off the campaign, with result files intended under `.ai/evals/results/2026-07-26/`.

## What didn't work

- The documented “skill-creator framework” runner was not installed; the session used manual runner/grader orchestration instead.
- Early brainstorm fixtures contradicted their prompts or left genuine questions unresolved. The fixture was corrected and those requirements were recorded in `evals.json`.
- No direct finding on a `ce-plan` output-mode resolution defect appears in this session.

## Key decisions

- Run full authored regression suites for skills with defect history: `ce-brainstorm`, `ce-plan`, and `ce-ideate`.
- Use one smoke run for the remaining trimmed phase skills, rather than authoring deep suites for all of them.
- Do not patch a skill while running the eval campaign; collect results first.

## Related context

- The cleanup reduced `ce-plan`’s skill body from 817 to 275 lines while retaining stated contracts such as stable IDs, metadata, and section rubrics.
- Brainstorm’s completed regression iteration reported 12/12 passes for its confirmation-gate behavior; this validates the eval methodology, not `ce-plan` output mode.

## Coverage gaps

- The rolling 7-day scan does not cover older history.
- Hermes had no repository prompts in the window.
- No repository-matching Codex or Cursor session was inventoried.
- Only one relevant prior session was available, so there was no cross-session or cross-platform comparison.
- The selected session covered regression-eval planning but contained no direct evidence about an output-mode resolution defect.

## Write count

- Files written: 5 total.
- Scratch files: 4 (`file-inventory-7d.jsonl`, `file-keywords-7d.jsonl`, `hermes-prompts.jsonl`, and one skeleton extraction).
- Evaluator captures: 1 (`/tmp/ce-evals/smoke/ce-sessions/capture.md`).
- Workspace files written: 0.
- Commits: 0.

## Final turn

## Provenance

One Claude session on branch `SiTaggart/bowhead`, 2026-07-26 00:23–02:07.

## What was tried before

- Added regression-eval suites for `ce-brainstorm`, `ce-plan`, and `ce-ideate` during the CE-suite cleanup.
- Defined a manual evaluation process: cold, isolated runner sessions; scripted replies for blocking questions; repeated runs to account for model variance.
- Planned `ce-plan` coverage as six mechanical evals, alongside deeper authored suites for brainstorm and ideate.
- Created `.ai/evals/RUNBOOK.md` to hand off the campaign, with result files intended under `.ai/evals/results/2026-07-26/`.

## What didn't work

- The documented “skill-creator framework” runner was not installed; the session used manual runner/grader orchestration instead.
- Early brainstorm fixtures contradicted their prompts or left genuine questions unresolved. The fixture was corrected and those requirements were recorded in `evals.json`.
- No direct finding on a `ce-plan` output-mode resolution defect appears in this session.

## Key decisions

- Run full authored regression suites for skills with defect history: `ce-brainstorm`, `ce-plan`, and `ce-ideate`.
- Use one smoke run for the remaining trimmed phase skills, rather than authoring deep suites for all of them.
- Do not patch a skill while running the eval campaign; collect results first.

## Related context

- The cleanup reduced `ce-plan`’s skill body from 817 to 275 lines while retaining stated contracts such as stable IDs, metadata, and section rubrics.
- Brainstorm’s completed regression iteration reported 12/12 passes for its confirmation-gate behavior; this validates the eval methodology, not `ce-plan` output mode.

Capture written to [capture.md](/tmp/ce-evals/smoke/ce-sessions/capture.md).
