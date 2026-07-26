# Council capture

## Advisor count and lenses

Five advisors completed independent positions:

1. Contrarian — failure modes, ambiguity, and regression risk.
2. First Principles Thinker — the underlying pagination-domain contract.
3. Expansionist — future implementation freedom and adjacent upside.
4. Outsider — hidden assumptions and compatibility traps.
5. Executor — the smallest feasible contract and test sequence.

## Anonymization method

Advisor identities were shuffled once with Python's `secrets.SystemRandom`, then replaced with letters before peer review. Reviewers received only the neutral question and Responses A–E. The audit mapping was A = Contrarian, B = Outsider, C = Executor, D = First Principles Thinker, E = Expansionist. Five independent reviewers assessed the lettered responses before identities were restored for chairman synthesis.

## Advisor positions

- Contrarian: reject every supported negative `size` with `ValueError`; validate at the public boundary, preserve valid/default behavior and current type rules, define start-first precedence, and test all boundaries.
- First Principles Thinker: a negative maximum result count has no coherent pagination meaning; require nonnegative values, keep zero valid and empty, and avoid inventing new type or message contracts.
- Expansionist: reject negatives before backend access so storage and slicing quirks never become API semantics; retain current sentinel/default behavior and prove valid-input invariance.
- Outsider: reject negative `size`, but first determine whether `-1` is already a documented or de facto unlimited sentinel; if so, use an explicit migration instead of a silent break.
- Executor: make one boundary validation rule, keep existing type handling, validate `start` before `size`, and add focused tests proving no downstream work occurs for invalid inputs.

## Synthesis

The intended contract is: after existing type rules are applied, every supported `size < 0` raises `ValueError`; negative values never mean unlimited, reverse slicing, or zero. `size == 0` remains valid and produces an empty page using the existing result shape. Positive, omitted, and already-supported sentinel behavior remains unchanged. Validation happens before downstream work, with `start` checked before `size`.

## Disagreements

The material disagreement is not the target rule but whether it can be enforced immediately. If `-1` already means unlimited, unconditional rejection is a breaking change and needs deprecation or versioning. Reviewers also rejected any attempt to finalize type/coercion precedence without first inspecting current behavior for booleans, floats, strings, `Decimal`, integer-like values, `None`, and mixed-invalid arguments.

## Recommendation

Audit documentation, tests, implementation, released behavior, and callers for negative `size`—especially `-1`—then require `ValueError` for every supported negative value while preserving existing type, default, return-shape, metadata, and valid-input behavior. If the audit finds an existing negative sentinel, migrate it explicitly before enforcement.

## Artifact paths

- Council report: `.ai/council/council-report-20260725-211841.html`
- Capture: `capture.md`

## Edits count

2 files created, 0 existing files modified, 0 files deleted. The pre-existing untracked `PLAN.md` was not edited. No skill file was edited. No commit was created.

## Final turn

Council complete. Recommendation: audit current negative-`size` behavior—especially `-1`—then require `ValueError` for supported negative values while preserving existing type/default behavior. Report: `.ai/council/council-report-20260725-211841.html`. Capture: `capture.md`.
