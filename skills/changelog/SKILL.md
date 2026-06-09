---
name: changelog
description: Write concise, source-backed changelog summaries from recently merged PRs or commits.
argument-hint: "[daily|weekly|N days|since YYYY-MM-DD]"
disable-model-invocation: true
---

# Changelog

Create a clear changelog from recently merged work. The output should help a
reader understand what changed, what matters, and whether anything needs action.

## Scope

Resolve the requested window:

- `daily`: merged in the last 24 hours
- `weekly`: merged in the last 7 days
- `N days`: merged in the last N days
- `since YYYY-MM-DD`: merged since that date
- no argument: default to `daily`

Use the repository's default branch when it is obvious. Otherwise prefer `main`,
then `master`.

## Evidence

Gather source data before writing:

1. Use `gh pr list` for merged PRs in the window when GitHub is available.
   Include PR number, title, URL, author, merged time, labels, and body.
2. For important or unclear PRs, use `gh pr view <number>` to inspect linked
   issues, files, commits, and review context.
3. If GitHub is unavailable, fall back to `git log --first-parent` over the
   target branch and state that PR metadata was unavailable.
4. Do not infer product impact from titles alone. Use PR body, labels, linked
   issues, changed files, and commit messages to separate user-facing changes
   from internal work.

Never post externally, call webhooks, or update files unless the user explicitly
asks for that side effect.

## Classification

Group entries by impact. Omit empty sections.

- **Action Required**: breaking changes, migrations, environment variables,
  manual deploy steps, dependency bumps requiring attention, or rollout notes.
- **User-Facing Changes**: new features, UX changes, product behavior, visible
  fixes, or workflow improvements.
- **Fixes**: bug fixes that are not already covered as major user-facing items.
- **Performance And Reliability**: speed, stability, observability, CI, or
  operational improvements.
- **Developer Experience**: tooling, tests, refactors, documentation, cleanup,
  and internal ergonomics.

If a PR belongs in multiple sections, place it where the reader most needs to
notice it and mention the secondary impact in the entry text.

## Output

Write markdown, not XML wrappers.

Recommended shape:

```markdown
# Changelog: <period>

<one-sentence summary of the window>

## Action Required

- <impact first>. <short detail>. [#123](url)

## User-Facing Changes

- <impact first>. <short detail>. [#124](url)

## Fixes

- <bug fixed and who benefits>. [#125](url)

## Performance And Reliability

- <operational or reliability improvement>. [#126](url)

## Developer Experience

- <internal change and why it matters>. [#127](url)

## Sources Checked

- <count> merged PRs from <date> to <date>
- GitHub PR metadata available: yes/no
```

Keep entries compact: one bullet per meaningful PR or cluster of tightly related
PRs. Include PR numbers and links when available. Include contributor names only
when the audience asked for shoutouts or authorship matters.

## Tone

- Be direct, calm, and specific.
- Lead with user or operational impact, then implementation detail.
- Avoid jokes, fun facts, emojis, hype, and filler.
- Do not invent certainty. If impact is unclear, label it as internal or say
  what the source actually showed.
- Match the requested audience if given: product, engineering, leadership, or
  release notes.

## Empty Or Partial Data

If no merged PRs are found, return:

```markdown
# Changelog: <period>

No merged PRs found for this window.
```

If metadata is incomplete, still produce the best summary from available git
history and include a brief `Sources Checked` note describing the limitation.
