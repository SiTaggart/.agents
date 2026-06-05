---
name: ce-promote
description: "Draft user-facing announcement and marketing copy for a feature that just shipped: an X post or thread, changelog blurb, LinkedIn post, email, blog intro, or short demo script. Use when the user says 'promote this', 'draft the announcement', 'write the launch copy', 'market this feature', 'announce this feature', 'write the release tweet', or 'ce-promote'."
argument-hint: "[optional: what shipped and/or channels, e.g. 'a tweet thread and a LinkedIn post']"
---

# /ce-promote

Turn a shipped feature into copy-pasteable, user-facing announcement copy inside the engineering workflow.

## Purpose

After shipping, messaging should not wait for a separate marketing pass. `ce-promote` figures out what shipped, picks the right channels, and drafts copy that explains the user-facing value.

**This skill drafts only. It never posts, publishes, commits, or opens PRs.** Posting is a human action. The output is always drafts for review and editing.

## Usage

```bash
/ce-promote
/ce-promote [free-form description]
/ce-promote a tweet thread and a LinkedIn post
/ce-promote 3 tweet options for the new export feature
```

## Phase 1: Figure Out What Shipped

If the user gave a free-form description of the feature, use it as the source of truth.

Otherwise, derive it from context. Use what is available; do not block on any one source:

- **Merged or active PR**: `gh pr view --json title,body,url 2>/dev/null`
- **The diff**: `git diff main...HEAD --stat` and notable changes
- **Changelog**: the top `[Unreleased]` entry in `.ai/changelog.md`, `CHANGELOG.md`, or similar
- **Recent commits**: `git log --oneline -15`

Then write a 1-3 sentence summary of the **user-facing value**: what a user can now do that they could not before, and why it matters. Describe the outcome, not the implementation.

If you cannot confidently tell what shipped, ask the user one short question rather than guessing.

## Phase 2: Pick Channels

Default to a small, sensible set:

- **An X post or short thread**: lead with the value; thread only if the change warrants multiple beats.
- **A one-line changelog or release blurb**: plain, declarative, and specific.

Scale to what the change warrants and to what the user asked for. If they named channels such as LinkedIn, email, a blog intro, or a short demo script, draft those instead of or in addition to the defaults. A small fix needs one or two short drafts; a flagship feature can justify a cross-channel set. Do not force a fixed template.

## Phase 3: Draft The Copy

Use concise editorial and social-media fundamentals:

- Lead with the user-facing outcome: what someone can now do, not how it was built.
- One idea per piece. Cut windup, hedges, and throat-clearing.
- Be concrete and specific; show the value, do not assert it.
- Use plain, active language.
- Strip AI tells: "thrilled/excited to announce," "game-changer," "in today's fast-paced world," "unlock/leverage/seamless," and em-dash padding.
- Sanity check by reading it as if saying it to one user. If a person would not say it, rewrite it.

For social channels:

- The first line is the hook and must earn the next line.
- Match each channel's native shape and length; never reuse one draft verbatim across channels.
- Use one clear CTA where the channel supports it.
- Use 0-2 hashtags only where the channel expects them.

Per channel:

- **X**: value in the first line; 1-3 tight lines. Thread only when there is more than one beat worth its own line.
- **Changelog / release blurb**: one declarative line naming the new capability.
- **LinkedIn**: a short paragraph with the human angle first, then the what. Warmer than X.
- **Email**: benefit-stating subject, 2-4 sentence body, and one CTA.
- **Blog intro**: one strong opening paragraph framing the problem and new capability.
- **Demo script**: 3-6 spoken beats: hook, problem, action, payoff.

Draft one strong option per channel by default. Produce more only when asked, capped around three.

## Phase 4: Present The Drafts

Show every draft as a clean, copy-pasteable block, labeled by channel:

```markdown
### X post
<the copy>
```

Offer to revise tone, length, angle, variations, or channels.

Do not post, publish, schedule, commit, or open a PR. End by making clear the drafts are ready for human review and posting.
