# ce-brainstorm regression results

Date: 2026-07-26

Scope: remaining evals 2–3. Eval 1 was completed on 2026-07-25.

| Eval | Run | Capture | Stage 1 shape | Stage 2 | Verdict | Evidence |
|---|---:|---|---|---|---|---|
| 2 | 1 | `/tmp/ce-evals/ce-brainstorm/eval-2/run-1/capture.md` | Path A | N/A | pass | “This is a lightweight, fully specified change. I’m skipping a requirements document…” |
| 2 | 2 | `/tmp/ce-evals/ce-brainstorm/eval-2/run-2/capture.md` | Path A | N/A | pass | “We’ll add a `--version` flag… I’m skipping a separate requirements document…” |
| 2 | 3 | `/tmp/ce-evals/ce-brainstorm/eval-2/run-3/capture.md` | Path A | N/A | pass | “I’m skipping a requirements document because… this single decision can flow directly into implementation.” |
| 3 | 1 | `/tmp/ce-evals/ce-brainstorm/eval-3/run-1/capture.md` | Path B | pass | pass | “A duplicate is an independent copy owned by the recipient, so later revocation or changes to the original do not affect it.” |
| 3 | 2 | `/tmp/ce-evals/ce-brainstorm/eval-3/run-2/capture.md` | Path B | pass | pass | “The shared original stays current with owner edits and disappears on revoke; duplicates are independent and remain.” |
| 3 | 3 | `/tmp/ce-evals/ce-brainstorm/eval-3/run-3/capture.md` | Path B | pass | pass | “A duplicated search remains the recipient's after revocation; revocation only removes access to the owner's original.” |

## Aggregate

- Eval 2: **pass**, 3/3 expected Path A.
- Eval 3: **pass**, 3/3 expected Path B; all Stage 2 checks passed.
- Suite result for the 2026-07-26 remainder: **pass**.

Fresh grader report: `/tmp/ce-evals/graders/ce-brainstorm/grade.md`.
