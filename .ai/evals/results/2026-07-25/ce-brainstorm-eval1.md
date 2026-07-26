# ce-brainstorm eval 1 (deep-preload-routes-path-b) — first execution, 2026-07-25

12 cold runs across 3 fixture iterations, run manually from the trim session
(Claude Code runners). Raw captures were lost to a /tmp reset the next day —
this file reconstructs the verdict; the run history is also recorded in
`skills/ce-brainstorm/evals/evals.json` notes.

## Verdict

- **Regression dimension (the must_not): PASS, 12/12.** No run produced the
  guarded defect — a 1-3 sentence announce followed by a same-turn doc write.
  No run wrote a requirements doc before a user checkpoint. No run answered
  its own question.
- **Tier-signal isolation: INCONCLUSIVE by fixture.** Every run stopped at
  exactly one Phase 1.3 blocking question — each a genuine, distinct gap in
  the eval prompt, not re-litigation:
  - iter-1 (buggy fixture): planted global-vs-per-channel snooze
    contradiction (3/3 caught it).
  - iter-2: quiet-hours precedence direction; thread @-mention precedence;
    evidence probe on two irreversible decisions.
  - iter-3 (airtight-attempt prompt): unmuted-thread-inside-muted-channel
    composition; non-preset backfilled expiry vs preset-only picker;
    quiet-hours blast radius for unmuted users.

## Lesson (recorded in evals.json)

Verify-before-claiming plus the integration check closes the "zero questions
needed" corridor for any decision-dense prompt. To isolate the tier signal,
shrink the pre-load to ~5 fully orthogonal decisions — or accept the
question-signal route as the tested path. Fixture rules now live in the
eval's `setup` field.

## Follow-up

Codex's 2026-07-26 campaign ran brainstorm evals 2-3 (pass 6/6) — see
`../2026-07-26/`.
