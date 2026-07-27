---
name: ce-conventions
description: Shared conventions and references for the ce-* skill family. Read by other skills as a sibling directory; not invoked directly.
disable-model-invocation: true
---

# ce-* Shared Conventions

Skills deploy as sibling directories on every target (Claude Code, OpenCode,
Codex), so any skill can read this file and `references/` here via
`../ce-conventions/`.

## Sub-agent dispatch

Skills delegate persona work by spawning a sub-agent via the platform's
subagent primitive (`Agent` in Claude Code, `spawn_agent` in Codex, `task` in
OpenCode, `subagent` in Pi via the `pi-subagents` extension) with a prompt that
tells it to read a persona file and apply it. Rules every dispatch site
follows:

- **Resolve persona paths to absolute paths in the parent.** A spawned
  sub-agent starts in the user's project, not the skill directory, so a bare
  `references/<file>.md` in its prompt resolves to nothing and the persona
  silently never loads. The parent knows where its own SKILL.md lives; expand
  from there before writing the prompt.
- **Standalone-skill personas:** have the sub-agent load the skill by name;
  on platforms where sub-agents cannot load skills, point at the absolute
  path of `skills/<name>/SKILL.md` instead.
- **Prefer a read-only sub-agent** for research and review personas when the
  platform offers one.
- **Permissions:** do not override the sub-agent's permission mode — let the
  user's configured permission settings apply.
- **No sub-agents available:** run the persona inline and keep the report
  short.
- **Persona files are dispatch payloads, not skill references.** On harnesses
  whose skill contract says the parent reads a skill's references itself
  (Codex), do not load the persona into the parent — pass its absolute path to
  the sub-agent unread. The parent reads a persona only when running it
  inline.

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

Run Slack research (the `ce-slack-research` skill, which dispatches a sub-agent
reading its `../ce-slack-research/references/slack-researcher.md` persona) only
when the user asks for Slack context. Fold the returned digest into the current phase's material;
do not paste it raw.

## Shared references

- `references/markdown-rendering.md` — markdown presentation for ce-plan and
  ce-brainstorm documents.
- `references/html-rendering.md` — HTML presentation for the same documents.
