---
name: ce-grill
description: "Clarify and stress-test a requirements doc, plan, design, or rough approach through a focused interview. Use when the user wants to be grilled, or before ce-plan when the requirements are too branchy, ambiguous, or strategically important to plan cleanly."
argument-hint: "[requirements doc path, plan path, or topic to stress-test]"
---

# Planning Clarity Gate

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
Use `repoprompt` when that codebase question is broad, unfamiliar, or crosses
multiple owner boundaries; keep the result as context for sharper questions, not
as a plan.

## Loop Role

`ce-grill` is the clarity gate before planning, not a replacement for planning.
Use it before `ce-plan` when the input has:

- unresolved scope or success criteria
- competing product directions
- hidden stakeholder or user-flow assumptions
- broad standard/deep work where the next decision affects many downstream units
- a requirements document that feels technically plannable but product-shaky
- a chosen approach or existing architecture that may itself be the constraint, not a fixed base to build on

Do not use it for narrow, already-clear implementation tasks. Let `ce-plan`
handle one or two ordinary clarifying questions directly.

## Stress the Frame, Not Just the Details

Grill whether this is the right approach at all, not only whether its parameters
are tuned. If the difficulty traces back to an existing structure or a settled
prior decision, put that decision back on the table — ask whether you would
arrive here building it fresh today, and weigh replacing it by resulting
complexity, not by how much already exists. A wrong turn already taken is not a
reason to keep walking; name it and let the user choose to reopen it.

## Handoff

When the interview is done, return a compact handoff:

- **Resolved decisions** - what is now settled
- **Remaining open questions** - only blockers that still prevent planning
- **Recommended planning input** - the exact summary or requirements path to pass to `ce-plan`
- **Ready for `ce-plan`** - yes/no, with the reason

Do not write the implementation plan here. If the result is ready, invoke
`ce-plan` when the caller asked to continue the loop.
