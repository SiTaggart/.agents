---
name: find-skills
description: Route the user to the right local skill loop. Use when the user asks what skill to use, how the agent workflows fit together, what is available, or how to approach a task with the current shelf.
---

# Skill Loop Map

Use this skill to choose a local loop. Do not recommend installing more skills
unless the user explicitly asks to search outside this shelf.

## Core Loops

### Explore And Decide

Use when the user is shaping an idea, product change, research question, or
ambiguous feature.

1. `qmd` or `obsidian-vault` - pull prior notes, interviews, transcripts,
   research summaries, PRDs, kickoff docs, and agent session artifacts when they
   are relevant.
2. `repoprompt` - build context when the frame depends on broad or unfamiliar
   codebase ownership.
3. `ce-brainstorm` - decide what should be built or changed.
4. `ce-grill` - pressure-test branchy requirements before planning.
5. `document-review` - review the requirements doc when it needs a quality pass.
6. `ce-plan` - turn settled requirements into an implementation plan.

### Learn Over Time

Use when the user wants to learn a topic, skill, or concept across multiple
sessions, or asks for lessons, reference materials, teaching state, or a durable
learning workspace.

1. `teach` - maintain the `.ai/teach/` mission, resources, glossary, lessons,
   reference docs, and learning records.

### Plan And Build

Use when the task is clear enough to execute or already has a plan.

1. `ce-plan` - for multi-step or risky work that needs an implementation plan.
2. `repoprompt` - build planning context when owner boundaries or data flow are
   broad or unfamiliar.
3. `ce-work` - build, fix, or finish the accepted contract.
4. `frontend-design` - fold in as guidance when the work touches UI, workflows,
   components, visual polish, accessibility, or responsive behavior.
5. `ce-quality-gate` - make touched files clean for lint, format, type, and
   focused tests after code edits.
6. `ce-simplify-code` - simplify recent code when the behavior is already
   correct but the shape can be cleaner.

### Review And Ship

Use when implementation exists as a branch, PR, or local diff.

1. `ce-review` - review the changed work for correctness, product fit, taste,
   traceability, tests, and proof.
2. `ce-simplify-code` - address shape issues that are worth fixing.
3. `git-commit`, `git-commit-push-pr`, `resolve-pr-feedback`, or `gh-fix-ci` -
   run git and PR operations only when the user asks for that ops step.

### Remember And Reuse

Use after meaningful work, research, or debugging that should improve future
runs.

1. `ce-compound` - capture durable lessons from solved work.
2. `ce-compound-refresh` - update stale lessons against current code.
3. `ce-sessions` or `chronicle` - recover context from prior agent sessions.
4. `obsidian-vault`, `obsidian-markdown`, `obsidian-bases`, and `json-canvas` -
   publish notes, research, interviews, meeting artifacts, and structured views.

### Debug And Investigate

Use when behavior is broken or unknown.

1. `ce-debug` - find root cause before fixing.
2. `repoprompt` - gather broad codebase context when the owner boundary is not
   obvious.
3. `ce-work` - apply the smallest correct fix once the contract is understood.
4. `ce-review` - review substantial or risky fixes before shipping.

## Selection Rules

- If the user has a vague idea, start with `ce-brainstorm`.
- If the user wants to learn a topic over multiple sessions, use `teach` instead
  of routing the learning workflow through brainstorm or planning loops.
- If the user has branchy requirements, run `ce-grill` before `ce-plan`.
- If the user has a written requirements or plan artifact, use
  `document-review`, not `ce-review`.
- If code has changed, use `ce-review`, not `document-review`.
- If code has been written, run `ce-quality-gate` before review or shipping.
- If the work touches UI, use `frontend-design` as a guide inside the active
  loop rather than as a separate destination.
- If the answer depends on notes, meetings, transcripts, PRDs, prior sessions,
  or research summaries, use `qmd` or Obsidian before inventing context.
- If the user asks for git, branch, PR, or CI operations, treat that as ops and
  use the git/GitHub skills directly.

## Response Shape

When asked what to use, answer with the shortest useful route:

```markdown
Use: `ce-brainstorm` -> `ce-grill` if branchy -> `ce-plan` -> `document-review`

Why: the product shape is still unresolved, so planning would invent decisions.
```

Do not list every skill unless the user asks for the full shelf.
