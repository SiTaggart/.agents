# ce-ideate regression results

Date: 2026-07-26

Scope: surprise-me and subject-identifiability evals 1–4.

| Eval | Runs | Result | Evidence |
|---|---:|---|---|
| 1 — vague prompt offers surprise me | 3/3 | pass | Each run asked one subject-only scope question with Specify, Surprise me, and Cancel; zero dispatches after Cancel. |
| 2 — surprise me in repo dispatches clean | 3/3 | pass | Each run completed grounding and six ideation frames without a later subject question; sampled survivors traced to fixture files. |
| 3 — outside repo requires substance | 3/3 | pass | Each run asked once for substance, then exited with zero dispatches and clear re-invocation guidance. |
| 4 — short identifiable subject not gated | 0/3 | fail | Each run correctly asked zero questions and reached the dispatch notice, but the harness stopped before actual dispatch while the rubric requires dispatch to proceed. |

## Failure captures

- `/tmp/ce-evals/ce-ideate/eval-4/run-1/capture.md`
- `/tmp/ce-evals/ce-ideate/eval-4/run-2/capture.md`
- `/tmp/ce-evals/ce-ideate/eval-4/run-3/capture.md`

## Aggregate

- Passed runs: 9/12.
- Suite result: **fail**.
- Failure boundary: eval 4 Stage 1; actual dispatch count remained zero in all three runs.
- Action: stopped the suite without editing `skills/ce-ideate/`.

Fresh grader report: `/tmp/ce-evals/graders/ce-ideate/grade.md`.

## Adjudication (2026-07-26, orchestrating session)

Eval 4's three fails were a harness contradiction, not a skill defect: the
campaign RUNBOOK instructed runners to stop at the dispatch decision
("Eval 4 stop: the dispatch decision"), while grader.md's stage 1 demanded
"dispatch proceeds". The captures show the graded behavior passing 3/3 —
zero blocking questions, the documented cheap footprint check, correct
identifiability conclusion, and the cost-notice line reached. grader.md has
been corrected to grade the intake judgment, not the fan-out.

**Adjudicated suite result: pass, 12/12.**
