---
name: ce-conventions
description: Shared conventions and references for the ce-* skill family. Read by other skills as a sibling directory; not invoked directly.
disable-model-invocation: true
---

# ce-* Shared Conventions

Skills deploy as sibling directories on every target (Claude Code, OpenCode,
Codex), so any skill can read this file and `references/` here via
`../ce-conventions/`.

## Blocking questions

Use the platform's blocking question tool: `AskUserQuestion` in Claude Code
(load it via `ToolSearch` first if its schema isn't loaded), `request_user_input`
in Codex, `ask_user` in Gemini and Pi (Pi requires the `pi-ask-user` extension).
Fall back to numbered options in chat only when no blocking tool exists or the
call errors — not because a schema load is required. Never silently skip a
required question, and act on the selection rather than just announcing it.

## Next-step menus

After finishing, recommend the natural next skill for what the work proved and
offer to run it. Always include a "Done for now" option. Route by judgment:
never offer shipping routes while behavior is unproven, and never offer
commit/checkout routes for targets reviewed remotely. Skip the menu entirely
when invoked as a sub-step from another skill — return results to the caller.

## Output-mode resolution (document-producing skills)

`OUTPUT_FORMAT` resolves: `output:` CLI token > the skill's own active config
key in `.compound-engineering/config.local.yaml` (`plan_output`,
`brainstorm_output`; commented lines are never active) > `md`. Unknown values
fall through with a one-line note naming the format actually resolved.
Pipeline and sub-step invocations always force `md`. Only literal flag tokens
(`output:`, `mode:`, `delegate:`) are consumed from arguments — `feat:`-style
prefixes pass through as description text. Regression evals for this contract
live in `../ce-plan/evals/`.

## Artifact paths

Use repo-relative paths inside written artifacts. Confirm a created artifact
to the user with its absolute path so the reference is clickable.

## Slack context (opt-in)

Dispatch `slack-researcher` only when the user asks for Slack context. Fold
the returned digest into the current phase's material; do not paste it raw.

## Shared references

- `references/markdown-rendering.md` — markdown presentation for ce-plan and
  ce-brainstorm documents.
- `references/html-rendering.md` — HTML presentation for the same documents.
