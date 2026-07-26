# ce-grill capture

## Input

Instruction:

> Invoke ce-grill on PLAN.md. Stop at the first substantive interview question; do not answer it or modify the plan. Never commit. Do not edit skills.

Plan:

> # Pagination contract plan
>
> Add validation to the page helper.
>
> - Reject negative `start`.
> - Decide what negative `size` should mean.
> - Preserve existing behavior for valid inputs.
> - Add focused tests.

## Framing

This is a pagination-contract decision, not yet an implementation-ready plan. The behavior of negative `size` is explicitly unresolved and determines the helper's observable result, validation rule, and focused tests. The workspace contains no implementation, callers, tests, or commit history from which to derive the existing contract.

## Issues identified before questioning

- Negative `size` has no defined behavior.
- The validation error type for negative inputs is not specified.
- "Valid inputs" and their existing behavior cannot be verified from the files provided.
- Test cases depend on the negative-`size` contract and should follow that decision.

## Exact first question and options

How should the page helper handle `size < 0`?

1. **Reject it (Recommended)** — raise the same validation error used for negative `start`; both pagination offsets and limits must be non-negative.
2. **Treat it as unbounded** — return all available results from `start`; this gives negative `size` a sentinel meaning.
3. **Clamp it to zero** — return an empty page; this avoids errors but can hide caller bugs.

## Why it is decision-relevant

This choice defines the public pagination contract. It changes whether callers receive an error or data, determines compatibility expectations, and controls the assertions needed in the focused tests.

## Counts

- Questions asked: 1
- Plan edits: 0
- Skill edits: 0
- Commits: 0

## Final turn

How should the page helper handle `size < 0`?

1. **Reject it (Recommended)** — raise the same validation error used for negative `start`; both pagination offsets and limits must be non-negative.
2. **Treat it as unbounded** — return all available results from `start`; this gives negative `size` a sentinel meaning.
3. **Clamp it to zero** — return an empty page; this avoids errors but can hide caller bugs.
