# ce-plan regression results

Date: 2026-07-26

Scope: output-mode evals 1–6.

| Eval | Run | Capture | Expected | Observed | Special condition | Verdict |
|---|---:|---|---|---|---|---|
| 1 | 1 | `/tmp/ce-evals/ce-plan/eval-1/run-1/capture.md` | `.md` | `.md` | Commented config ignored | pass |
| 1 | 2 | `/tmp/ce-evals/ce-plan/eval-1/run-2/capture.md` | `.md` | `.md` | Commented config ignored | pass |
| 2 | 1 | `/tmp/ce-evals/ce-plan/eval-2/run-1/capture.md` | `.md` | `.md` | `output:md` overrode HTML config | pass |
| 2 | 2 | `/tmp/ce-evals/ce-plan/eval-2/run-2/capture.md` | `.md` | `.md` | `output:md` overrode HTML config | pass |
| 3 | 1 | `/tmp/ce-evals/ce-plan/eval-3/run-1/capture.md` | `.html` | `.html` | Active HTML config applied | pass |
| 3 | 2 | `/tmp/ce-evals/ce-plan/eval-3/run-2/capture.md` | `.html` | `.html` | Active HTML config applied | pass |
| 4 | 1 | `/tmp/ce-evals/ce-plan/eval-4/run-1/capture.md` | `.md` plus note | `.md` plus note | Unknown `pdf` ignored | pass |
| 4 | 2 | `/tmp/ce-evals/ce-plan/eval-4/run-2/capture.md` | `.md` plus note | `.md` plus note | Unknown `pdf` ignored | pass |
| 5 | 1 | `/tmp/ce-evals/ce-plan/eval-5/run-1/capture.md` | `.md` | `.md` | Parent pipeline dispatch overrode HTML config | pass |
| 5 | 2 | `/tmp/ce-evals/ce-plan/eval-5/run-2/capture.md` | `.md` | `.md` | Parent pipeline dispatch overrode HTML config | pass |
| 6 | 1 | `/tmp/ce-evals/ce-plan/eval-6/run-1/capture.md` | `.md`, preserve `feat:` | `.md`, preserved `feat:` | Prefix remained feature text | pass |
| 6 | 2 | `/tmp/ce-evals/ce-plan/eval-6/run-2/capture.md` | `.md`, preserve `feat:` | `.md`, preserved `feat:` | Prefix remained feature text | pass |

## Aggregate

- Evals 1–6: **pass**, 12/12 runs.
- Suite result: **pass**.

Fresh grader report: `/tmp/ce-evals/graders/ce-plan/grade.md`.
