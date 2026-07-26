# ce-ideate regression grade

## Overall: FAIL

9/12 runs pass. Evals 1–3 pass at 3/3; eval 4 fails at 0/3 because every run stops before dispatch. The suite requires 3/3 passing runs for every eval.

The Phase 6 `Refine / Brainstorm / Save and end` handoff is treated as an allowed terminal menu, not as a prohibited subject-identification or subject-characterization question.

## Eval 1 — vague-prompt-offers-surprise-me

**Aggregate: PASS (3/3)**

- **Run 1 — PASS.** Stage 1: exactly one pre-dispatch scope question offered Specify, Surprise me, and Cancel; the scripted Cancel produced 0 dispatches. Stage 2: the question only identified the subject and did not ask about constraints, audience, tone, or success criteria.
- **Run 2 — PASS.** Stage 1: exactly one scope question with all three required choices; Cancel ended with 0 dispatches. Stage 2: the prompt asked only what subject to improve.
- **Run 3 — PASS.** Stage 1: exactly one scope question with all three required choices; Cancel ended with 0 dispatches. Stage 2: the prompt was subject-identifying only.

## Eval 2 — surprise-me-in-repo-dispatches-clean

**Aggregate: PASS (3/3)**

- **Run 1 — PASS.** Stage 1: after Surprise me, no further intake, narrowing, or characterization question appeared; 3 grounding and 6 ideation frames dispatched. The later Phase 6 handoff menu is allowed. Stage 2 sample, verified against the fixture: (1) Explainable delivery planner traces to the shared `userId`/`channelId` fields in `src/notifications.ts` and `src/snooze.ts` plus the README's fan-out/snooze claim; (2) Contract-first runnable CLI traces to `package.json` exposing raw `src/cli.ts` and the CLI handling only `help`; (3) Focus-preserving snooze lifecycle traces to the timestamp-only predicate and absent CLI lifecycle.
- **Run 2 — PASS.** Stage 1: no post-selection intake or characterization question; repo grounding and all 6 ideation frames dispatched. The attempted Phase 6 handoff is allowed. Stage 2 sample, verified against the fixture: (1) Explainable attention router traces to the disconnected pure notification and snooze functions; (2) Snooze-to-digest handoff traces to `untilTs` being the entire snooze model with no re-entry behavior; (3) Policy rehearsal traces to the pure functions, injected `nowTs`, and absence of tests or command examples beyond `help`.
- **Run 3 — PASS.** Stage 1: no mode-confirmation, substance, narrowing, or characterization question followed Surprise me; 3 grounding and 6 ideation agents dispatched. The recorded Phase 6 menu is allowed. Stage 2 sample, verified against the fixture: (1) Verified vertical slice traces to the README's three capability claims, disconnected CLI, and raw TypeScript bin; (2) Delivery-policy compiler traces to repeated user/channel identity fields and singleton `fanOut`; (3) Delete the CLI until it exists traces to the advertised bin whose implementation only handles `help` and imports neither domain module.

All nine sampled survivors name concrete Chatter subjects and are supported by files that actually exist in their respective run fixtures. The run-1 durable ideation artifact and all three scratch `survivors.md` checkpoints agree with the captures.

## Eval 3 — surprise-me-outside-repo-requires-substance

**Aggregate: PASS (3/3)**

- **Run 1 — PASS.** Stage 1: one substance ask, 0 dispatches, clean stop, and explicit re-invocation paths. Stage 2: the question requested only a URL, description, or paste.
- **Run 2 — PASS.** Stage 1: one substance ask, 0 dispatches, clean stop, and explicit re-invocation paths. Stage 2: the question was substance-supplying only.
- **Run 3 — PASS.** Stage 1: one substance/subject ask, 0 dispatches, clean stop, and explicit re-invocation paths. Stage 2: asking for software plus a URL, description, draft, or paste identifies and supplies grounding; it does not characterize the solution, audience, tone, constraints, or success criteria.

## Eval 4 — short-identifiable-subject-not-gated

**Aggregate: FAIL (0/3)**

- **Run 1 — FAIL.** Stage 1: correctly asked 0 blocking questions, but only announced that 9 agents “would dispatch”; actual dispatch count is 0. The required dispatch did not proceed.
- **Run 2 — FAIL.** Stage 1: correctly asked 0 blocking questions and correctly classified dark mode, but explicitly stopped at the cost notice with 0 actual dispatches.
- **Run 3 — FAIL.** Stage 1: correctly asked 0 blocking questions and planned the expected grounding/ideation agents, but actual dispatch count is 0.

Stage 2 raises no question-intent concern for eval 4, but Stage 1 failure is decisive for every run.
