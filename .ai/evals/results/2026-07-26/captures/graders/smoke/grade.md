# Tier 2 Smoke Grade

Overall verdict: **FAIL — 13 PASS, 1 FAIL.**

The deliberate lint failure in `ce-quality-gate` is the expected test outcome and therefore a smoke **PASS**. The suite fails only because `ce-slack-research` did not complete its required dispatch.

| Skill | Grade | Quoted evidence | Reasoning |
|---|---|---|---|
| `ce-work` | **PASS** | “Quality gate `npm run check` — passed.” | Implemented the flag, stated the product contract and proof surface, passed focused and full checks on rerun, and offered no shipping path. |
| `ce-quality-gate` | **PASS** | “**FAIL.** The touched surface is not mechanically clean and is not ready for review, commit, or shipping.” | Correctly attributed the planted touched-file lint error, limited its health claims, and withheld review/commit/shipping. This inner gate failure is expected, not a smoke failure. |
| `ce-review` | **PASS** | “The implementation is off by one at `src/page.js:2`, and the focused test proves the user-visible contract is broken.” | Cited file and line with a concrete consequence, ended with verdict and checks, and preserved all fixture hashes. |
| `ce-debug` | **PASS** | “Exact user-choice gate: `What should I do next? 1. Fix it now 2. Diagnosis only — I'll take it from here`” | Used the fast path: concrete cause, one-line fix, existing regression check, choice gate, and no debug-document ceremony. |
| `ce-decompose` | **PASS** | “No selection has been made. The workflow stops here.” | Verified a two-commit range with two-dot semantics, measured 4,488 changed lines, proposed a carve, and performed no history-changing action before confirmation. |
| `ce-compound` | **PASS** | “OK: `.ai/solutions/logic-errors/pagination-slice-exclusive-end.md`” | Asked one mode question, created exactly one solution document, and the canonical frontmatter validator and fixture test both exited 0 on rerun. |
| `ce-compound-refresh` | **PASS** | “Learning deletions applied: **0**” | Identified the overlap, recommended Consolidate with a canonical target, presented the documented choice, and left both planted learnings byte-identical. |
| `ce-handoff` | **PASS** | “Handoff read back successfully after writing.” | Wrote the compact handoff with all six tiny-template sections, explicit status, unresolved decision, verification state, and starter prompt. |
| `ce-grill` | **PASS** | “How should the page helper handle `size < 0`?” | Asked one substantive, decision-relevant interview question with a recommendation and alternatives; the plan remained unchanged. |
| `ce-council` | **PASS** | “Five advisors completed independent positions:” | The HTML artifact contains five advisor sections and five anonymized peer-review blocks, followed by synthesis and recommendation. |
| `ce-simplify-code` | **PASS** | “This is a suggestion-only review; none of the suggestions below were applied.” | Proposed only the behavior-preserving removal of a one-use helper, explicitly rejected semantic changes, passed the test, and changed no fixture files. |
| `ce-slack-research` | **FAIL** | “Attempted the required `slack-researcher` dispatch with the topic and no permission-mode override; the runner rejected it before execution with `no thread with id`.” | Explicit opt-in was present, but no researcher dispatch executed. Direct Slack tool use was a substitute path and does not satisfy the Tier 2 dispatch condition. This is a smoke-run/orchestration failure. |
| `ce-sessions` | **PASS** | “The only deep extraction used `extract-skeleton.py --output`.” | Used the prescribed discovery/extraction path, excluded the current session, selected one of at most five sessions, kept bulk content file-mediated, and dispatched synthesis. |
| `ce-optimize` | **PASS** | “Files present in the run directory at CP-0: `spec.yaml` only.” | The input matches the bundled example byte-for-byte, the saved spec matches both, and no baseline, probe, branch, worktree, or experiment ran before CP-0. |

## Coverage caveats

- `ce-slack-research` successfully reached Slack directly, but that cannot substitute for the required `slack-researcher` dispatch; its research content was not used to override the failed shape check.
- `ce-sessions` covered one Claude Code session in a seven-day window; it found no matching Codex, Cursor, or Hermes history, so this proves guardrail shape rather than broad recall quality.
- `ce-decompose` used a real 93-file, 4,488-line two-commit range rather than a toy-sized fixture. It still exercised the specified Git semantics and confirmation gate, but at higher-than-smoke complexity.
- Artifact verification was local. Slack source contents and the freshness/isolation of runner sessions were not independently replayed from external systems.
