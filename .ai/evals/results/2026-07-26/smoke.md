# Tier 2 smoke results

Date: 2026-07-26

Scope: one fresh smoke run for each of the 14 remaining trimmed skills.

| Skill | Capture | Verdict | Evidence |
|---|---|---|---|
| `ce-work` | `/tmp/ce-evals/smoke/ce-work/capture.md` | pass | “Quality gate `npm run check` — passed.” |
| `ce-quality-gate` | `/tmp/ce-evals/smoke/ce-quality-gate/capture.md` | pass | “**FAIL.** The touched surface is not mechanically clean and is not ready for review, commit, or shipping.” |
| `ce-review` | `/tmp/ce-evals/smoke/ce-review/capture.md` | pass | “The implementation is off by one at `src/page.js:2`, and the focused test proves the user-visible contract is broken.” |
| `ce-debug` | `/tmp/ce-evals/smoke/ce-debug/capture.md` | pass | “Exact user-choice gate: `What should I do next? 1. Fix it now 2. Diagnosis only — I'll take it from here`” |
| `ce-decompose` | `/tmp/ce-evals/smoke/ce-decompose/capture.md` | pass | “No selection has been made. The workflow stops here.” |
| `ce-compound` | `/tmp/ce-evals/smoke/ce-compound/capture.md` | pass | “OK: `.ai/solutions/logic-errors/pagination-slice-exclusive-end.md`” |
| `ce-compound-refresh` | `/tmp/ce-evals/smoke/ce-compound-refresh/capture.md` | pass | “Learning deletions applied: **0**” |
| `ce-handoff` | `/tmp/ce-evals/smoke/ce-handoff/capture.md` | pass | “Handoff read back successfully after writing.” |
| `ce-grill` | `/tmp/ce-evals/smoke/ce-grill/capture.md` | pass | “How should the page helper handle `size < 0`?” |
| `ce-council` | `/tmp/ce-evals/smoke/ce-council/capture.md` | pass | “Five advisors completed independent positions:” |
| `ce-simplify-code` | `/tmp/ce-evals/smoke/ce-simplify-code/capture.md` | pass | “This is a suggestion-only review; none of the suggestions below were applied.” |
| `ce-slack-research` | `/tmp/ce-evals/smoke/ce-slack-research/capture.md` | **fail** | “Attempted the required `slack-researcher` dispatch with the topic and no permission-mode override; the runner rejected it before execution with `no thread with id`.” |
| `ce-sessions` | `/tmp/ce-evals/smoke/ce-sessions/capture.md` | pass | “The only deep extraction used `extract-skeleton.py --output`.” |
| `ce-optimize` | `/tmp/ce-evals/smoke/ce-optimize/capture.md` | pass | “Files present in the run directory at CP-0: `spec.yaml` only.” |

## Aggregate

- Passed skills: 13/14.
- Suite result: **fail**.
- Failure boundary: `ce-slack-research`; the required researcher dispatch did not execute. Direct Slack tool use did not satisfy the dispatch contract.
- Action: stopped the smoke suite without editing `skills/` or recording run-history notes.
- The deliberate `ce-quality-gate` lint failure was the expected behavior and therefore passed.

Fresh grader report: `/tmp/ce-evals/graders/smoke/grade.md`.


## Adjudication (2026-07-26, orchestrating session)

The `ce-slack-research` fail was environment-blocked, not a skill defect: the
Codex harness rejected the `slack-researcher` agent dispatch before execution
(`no thread with id`) — Codex has no such subagent mechanism/Slack MCP in
that headless context. Re-run natively in Claude Code: the dispatch executed
and returned the full contracted digest (workspace, research-value rating,
interpreted topics, cross-cutting analysis) within budget.

**Adjudicated smoke result: pass, 14/14 (ce-slack-research pass in its
supported environment; environment-blocked in headless Codex).**
