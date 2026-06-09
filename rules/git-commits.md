# Git Commit Rules

When the user asks to commit, push, or save changes to git:

## MUST Use Git Skills

**DO NOT** run `git commit` directly. Use the installed git skills instead:

```
Skill("git-commit")
```

For commit plus push and PR creation, use:

```
Skill("git-commit-push-pr")
```

The git skills:

1. Stage only the intended files
2. Use Conventional Commits for commit subjects and PR titles
3. Avoid committing secrets, generated noise, or unrelated user changes
4. Keep commit, push, and PR behavior explicit

## Conventional Commit Contract

- Commit subjects and PR titles must use `type(scope): summary`.
- Scope is optional, narrow, and kebab-case when useful.
- Use lowercase types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`,
  `perf`, `ci`, `style`, or `build`.
- Summaries are imperative, lowercase, under 72 characters, and have no trailing
  period.
- Prefer `fix` over `feat` when a change repairs broken or missing behavior.
- Do not use vague subjects like `update`, `changes`, `work`, or
  `address feedback`.

## Why This Matters

- Direct `git commit` bypasses the shelf's safety checks and message conventions
- The git skills preserve user intent and avoid sweeping in unrelated files
- PR creation belongs in the combined git ops flow, not in ad hoc shell commands

## Trigger Words

When you see these in user prompts, use the commit skill:

- "commit", "push", "save changes"
- "push to github", "push changes"
- "commit and push"
