---
name: architect
description: "Sketch types, signatures, and module structure before code, then stop for approval unless implementation was explicitly requested. Use for /architect, 'architect this', 'design this', or non-trivial work where jumping to code would lock in the wrong shape."
disable-model-invocation: true
---

# Architect

Adapted from pstack for host-neutral Codex and Claude workflows. Approval is the default boundary.

Design before implementing. Sketch types, function signatures, class shapes, and module boundaries with `not implemented` bodies and pseudocode. Synthesize the options, then stop for approval unless the user already asked for implementation. If implementation later proves the sketch wrong, throw it out and redesign.

## Start

Open a task list with one entry per phase when the work is complex enough to need it.

1. Ground
2. Sketch
3. Agree
4. Implement
5. Scrap

## Phase A: Ground the problem

Build a real mental model of every system the new code touches. Run the **how** skill over the relevant subsystems. Critique mode if existing structure is the constraint or the design must push back on it.

Naming a file isn't grounding. Produce the traced model `how` prescribes. If the design redefines ownership or layering, also run the **why** skill on the existing shape so the rationale becomes a constraint, not a guess.

Skip Phase A only when the work is genuinely greenfield with no surrounding system to integrate.

## Phase B: Sketch

For a non-trivial design, use the host's available subagent or delegation feature to produce two independent sketches in parallel. Give each runner `references/runner-prompt.md` plus the Phase A grounding artifacts. Do not require a particular model or provider. If delegation is unavailable, write two distinct sketches directly. Each candidate produces a design package shaped per `references/rationale-template.md`: the caller's usage written first, then the type sketch, function signatures, module map, and prose rationale derived from it.

Design it twice for consequential or cross-cutting work. For a small local change with one obvious shape, one sketch is enough. Alternatives must differ in whole shape, not just point fixes inside one shape.

Screen every candidate against [`references/design-red-flags.md`](references/design-red-flags.md) before synthesis. Reject or revise shallow modules, information leakage, temporal decomposition, and pass-through methods.

Compare viable candidates on interface depth. Prefer the design that hides more complexity behind a smaller, simpler public surface. A rich interface can keep call chains short by concentrating capability instead of scattering it across layers.

Synthesize the viable candidates into one design package. Record the decision in the rationale's "Synthesis decision" section.

## Phase C: Agree

Default: present the synthesized design and stop for approval.

Proceed directly only when the user's original request explicitly authorizes both design and implementation. A request to design, review, assess, or architect is not implementation approval.

Do not create files, commits, branches, or pull requests for the synthesis unless the user asked for them. For adversarial pressure, use an available review skill or independent read-only reviewers.

If the human pushes back on the shape (in a checkpoint or after the fact), treat that as Phase A evidence. Re-ground and re-run Phase B before writing more code.

## Phase D: Implement against the sketch

Enter this phase only after explicit implementation authorization.

Replace `not implemented` bodies with code, pseudocode with logic. The synthesized sketch is the contract.

Deviations from the sketch are signal worth surfacing, not friction to absorb silently. If a function needs a parameter the sketch didn't anticipate, ask whether the sketch was wrong, the requirement was missed, or the implementation is overreaching. Surface it; don't bolt it on.

## Phase E: Scrap when the architecture is wrong

If implementation keeps producing friction the sketch can't absorb, throw the sketch out. Don't bolt fixes onto a wrong design.

The signal is a *pattern*, not single instances. Tells:

- The same shape of workaround appearing repeatedly across unrelated code.
- Multiple unrelated edge cases that all need special-case branches.
- Types that need escape hatches (`any`, casts, optional fields always set in practice) to compile.
- The "we need a lock" reflex when the sketch said the state wasn't shared.
- Callers having to know the abstraction's internal rules to use it.
- Two or more independent Phase D deviations of the same shape across the implementation. Surfacing deviations is Phase D's job; a repeated pattern of them is Phase E's trigger.

Use judgment. A few edge cases don't condemn an architecture. Some problems are legitimately complex; complexity in the data is not complexity in the design. The rewrite signal is repeated friction of the same shape, not single hard cases.

When you scrap:

1. Re-run the **how** skill over what's been built. The implementation lessons enter the new design as inputs, not vibes.
2. Redesign as if the new constraints had been day-one assumptions.
3. Subtract before adding. The new sketch should be smaller than the old one before it grows.
4. Return to Phase B and compare the new alternatives.

## Outputs

The caller's usage is written first and the type sketch derived from it. Use one response or requested design file for small changes; use a module map plus type definitions for larger work. Shape the rationale with `references/rationale-template.md`, including the usage sketch and synthesis decision.
