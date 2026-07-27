---
title: "refactor: Retire custom subagents into skill-owned personas"
type: refactor
status: completed
date: 2026-07-27
---

# refactor: Retire custom subagents into skill-owned personas

## Summary

Retire all 27 agent definitions in `agents/`, move each persona body into a
skill-owned home (reference file or standalone skill), make every dispatch
site harness-neutral, and delete the agents render/link machinery from the
dotagents CLI. Personas then travel to Claude, Codex, and OpenCode as plain
skill files with no per-harness rendering.

## Problem Frame

Persona content lives in two homes: `agents/*.md` (Claude-native, bridged to
Codex/OpenCode through per-harness render code) and `skills/` (loaded natively
by every harness). The bridge costs ~250 lines of CLI, a render target that
exists almost only for agents, and 27 always-loaded agent descriptions per
Claude session. Skills already cross-reference each other portably
(`../ce-conventions/SKILL.md`), so skill-owned personas need no bridge at all.

---

## Requirements

Persona content:

- R1. Every persona body from `agents/*.md` lives in exactly one skill-owned
  home. Content moves verbatim except frame edits: agent-voice to
  reference-voice, and harness-specific tool names to neutral phrasing.
- R2. The five researchers become standalone skills whose descriptions are
  their routing triggers; `skills/repo-research-analyst/` is rewritten from
  the agent's fresher `Scope:` contract (inline return, no handoff file).
- R3. The 15 reviewer personas live under
  `skills/ce-review/references/reviewers/` with a persona index in ce-review
  stating when each lens applies.

Dispatch:

- R4. Every dispatch site points at the new home using harness-neutral
  language ("the platform's subagent primitive"), never Claude-specific tool
  or parameter names.
- R5. Context isolation is preserved: dispatch instructions say to spawn a
  sub-agent (read-only where the platform offers one) that reads the persona
  file, with an inline fallback when sub-agents are unavailable.

Teardown:

- R6. `agents/` (including `agents/session-history-scripts/`) is deleted and
  a repo-wide search finds no stale agent references outside historical
  `.ai/` documents.
- R7. The CLI renders and links no agents for any target; the codex target
  reduces to hooks; previously linked agents directories are added to the
  obsolete-path cleanup; lint, type-check, and `bun test` pass.
- R8. `README.md` replaces its agent inventory with skill-persona pointers
  and drops the four listed agents that no longer have files.

---

## Key Technical Decisions

- Researchers become standalone skills; reviewers become ce-review
  references: researchers are dispatched from four different skills and earn
  a skill-index entry; reviewers have one owner and should not cost always-on
  context. (User decision.)
- ce-review is the canonical review path: all registry personas retire and
  the built-in `/code-review` flow falls back to its default behavior. (User
  decision.)
- Persona files are plain markdown with no frontmatter tool or model
  constraints: `tools:` lists become prose ("this is a read-only pass");
  `model: sonnet` becomes a dispatch-site hint ("suits a mid-tier model when
  the platform supports model selection").
- `slack-researcher` merges into `ce-slack-research` instead of becoming a
  sixth standalone skill: that skill is already a thin wrapper over the
  agent, so the merge removes an indirection.
- The codex render target survives as hooks-only: Codex loads skills and
  AGENTS.md natively, but hook adapters still need rendering.
- Agent-file deletion is consolidated into the teardown phase rather than
  per-phase: dispatch edits land first, so no unit leaves a skill pointing at
  a deleted file.
- `pr-comment-resolver`'s structured return contract (`verdict:` /
  `feedback_id:` block) moves verbatim: `resolve-pr-feedback` parses it.

---

## High-Level Technical Design

Destination map for all 27 agents:

| Agents | New home |
| --- | --- |
| adversarial, api-contract, architecture-strategist, code-simplicity, correctness, design-implementation, julik-frontend-races, kieran-python, kieran-typescript, maintainability, performance, previous-comments, project-standards, reliability, testing (15 reviewers) | `skills/ce-review/references/reviewers/<name>.md` |
| repo-research-analyst | rewrite of `skills/repo-research-analyst/SKILL.md` |
| web-researcher, docs-researcher, learnings-researcher, git-history-analyzer | new standalone skills `skills/<name>/SKILL.md` |
| slack-researcher | merged into `skills/ce-slack-research/` |
| session-historian | `skills/ce-sessions/references/session-historian.md` |
| pr-comment-resolver | `skills/resolve-pr-feedback/references/pr-comment-resolver.md` |
| spec-flow-analyzer | `skills/ce-plan/references/spec-flow-analyzer.md` |
| frontend-implementation-expert, documentation-specialist | `skills/ce-work/references/<name>.md` |
| design-iterator | `skills/ce-polish/references/design-iterator.md` |

Canonical dispatch shape (used at every site, wording adapted in place):

> Spawn a sub-agent via the platform's subagent primitive — read-only where
> the platform offers one — with a prompt that tells it to read
> `<persona path>` and apply it to `<scope>`. If sub-agents are unavailable,
> run the pass inline and keep the report short.

---

## Implementation Units

### Phase A — Review personas

### U1. Create the reviewer persona library and index in ce-review

- Goal: ce-review owns all 15 reviewer personas and routes them from its own
  index instead of the agent registry.
- Requirements: R1, R3, R4, R5.
- Dependencies: none.
- Files: `skills/ce-review/references/reviewers/*.md` (15 new),
  `skills/ce-review/SKILL.md` (modify §Context-Isolated Agent Routing,
  lines ~140–155).
- Approach: port each agent body, dropping frontmatter and converting
  `tools:` to prose. Add a persona index (always-on: correctness,
  maintainability, testing, project-standards; conditional: the other 11 with
  their trigger conditions harvested from agent descriptions). Rewrite the
  routing section to dispatch from the index using the canonical dispatch
  shape. Two content-level frame edits: `adversarial-reviewer` lines 71–77
  hand scope to six sibling agents — repoint at sibling reference files;
  `project-standards-reviewer` line 32 flags "stale or non-existent agent
  names" — reword to check skill and reference paths.
- Patterns to follow: existing `skills/ce-review/references/` layout;
  `../ce-conventions/SKILL.md` cross-reference style.
- Test scenarios: none — instruction files. Verify: every persona file
  reachable from the index; no `subagent_type` or other Claude parameter
  names in ce-review.

### U2. Repoint external reviewer consumers

- Goal: skills outside ce-review reference reviewer personas by path.
- Requirements: R4, R5.
- Dependencies: U1.
- Files: `skills/ce-compound/SKILL.md` (lines ~228–229),
  `skills/ce-plan/references/deepening-workflow.md` (line ~49, reviewer names
  only).
- Approach: replace `code-simplicity-reviewer`, `performance-reviewer`,
  `architecture-strategist`, `maintainability-reviewer` mentions with
  `../ce-review/references/reviewers/<name>.md` dispatch language. Leave
  researcher names in deepening-workflow for U5.
- Test scenarios: none — instruction files.

### Phase B — Researchers

### U3. Rewrite the repo-research-analyst skill from the agent contract

- Goal: one repo-research-analyst, carrying the contract callers rely on.
- Requirements: R1, R2.
- Dependencies: none.
- Files: `skills/repo-research-analyst/SKILL.md` (rewrite).
- Approach: port the agent body (six named `Scope:` values, inline markdown
  return, repo-relative paths mandate, monorepo handling). Drop the stale
  skill's handoff-file contract, prescriptive shell recipes, and hardcoded
  "current year is 2025" note. Description leads with the trigger: scoped
  repo reconnaissance for planning and implementation.
- Patterns to follow: description style from `qmd-knowledge-base` (trigger
  first, then what it does).
- Test scenarios: none — instruction files. Verify: `Scope:` names match
  what `ce-plan` and `ce-work` pass.

### U4. Create four standalone researcher skills

- Goal: web-researcher, docs-researcher, learnings-researcher, and
  git-history-analyzer are discoverable from the skill index in every
  harness.
- Requirements: R1, R2.
- Dependencies: none.
- Files: `skills/web-researcher/SKILL.md`, `skills/docs-researcher/SKILL.md`,
  `skills/learnings-researcher/SKILL.md`,
  `skills/git-history-analyzer/SKILL.md` (new).
- Approach: port each agent body. Descriptions lead with the trigger
  condition. Neutralize harness specifics: docs-researcher's
  `mcp__context7__*` becomes "use the documentation tools available (context7
  MCP, Ref, web search)"; the `model: sonnet` on web-researcher moves to a
  body note ("suits a mid-tier model"). learnings-researcher keeps its
  `.ai/solutions/` layout dependency as stated.
- Test scenarios: none — instruction files.

### U5. Repoint researcher dispatch sites

- Goal: all researcher dispatches route to the skills.
- Requirements: R4, R5.
- Dependencies: U3, U4.
- Files: `skills/ce-plan/SKILL.md` (lines ~132, ~146, ~152 researcher
  names), `skills/ce-plan/references/deepening-workflow.md` (line ~49
  researcher names), `skills/ce-ideate/SKILL.md` (lines ~68, ~88, ~90),
  `skills/ce-ideate/references/universal-ideation.md` (line ~3),
  `skills/ce-optimize/SKILL.md` (lines ~147, ~284).
- Approach: replace agent names with skill names plus the canonical dispatch
  shape ("spawn a sub-agent that loads the `web-researcher` skill" or, where
  skills cannot be loaded by sub-agents, "reads
  `../web-researcher/SKILL.md`"). `ce-work`'s delegation list is deliberately
  excluded — U7 rewrites it once.
- Test scenarios: none — instruction files.

### Phase C — Singles

### U6. Merge slack-researcher into ce-slack-research

- Goal: one Slack research surface; the wrapper indirection is gone.
- Requirements: R1, R4, R5.
- Dependencies: none.
- Files: `skills/ce-slack-research/SKILL.md` (modify),
  `skills/ce-slack-research/references/slack-researcher.md` (new),
  `skills/ce-conventions/SKILL.md` (line ~48).
- Approach: move the agent body (output template, research-value levels) into
  the reference; ce-slack-research dispatches a sub-agent that reads it
  (Slack digests are context-heavy, so isolation stays). The `model: sonnet`
  hint becomes a dispatch-site note. Update ce-conventions' opt-in line to
  name the skill, not the agent.
- Test scenarios: none — instruction files.

### U7. Move the remaining worker personas into their owner skills

- Goal: session-historian, pr-comment-resolver, spec-flow-analyzer,
  frontend-implementation-expert, documentation-specialist, and
  design-iterator live under their loop owners; ce-work's delegation list is
  rewritten once.
- Requirements: R1, R4, R5.
- Dependencies: U3, U4 (ce-work's list also names researchers).
- Files: `skills/ce-sessions/references/session-historian.md` (new),
  `skills/ce-sessions/SKILL.md` (line ~151),
  `skills/resolve-pr-feedback/references/pr-comment-resolver.md` (new),
  `skills/resolve-pr-feedback/references/full-mode.md` (lines ~59, ~69),
  `skills/resolve-pr-feedback/references/targeted-mode.md` (line ~27),
  `skills/ce-plan/references/spec-flow-analyzer.md` (new),
  `skills/ce-plan/SKILL.md` (line ~168),
  `skills/ce-work/references/frontend-implementation-expert.md` (new),
  `skills/ce-work/references/documentation-specialist.md` (new),
  `skills/ce-work/SKILL.md` (lines ~58–66),
  `skills/ce-polish/references/design-iterator.md` (new),
  `skills/ce-polish/SKILL.md` (minimal dispatch trigger).
- Approach: port bodies verbatim with frame edits. session-historian keeps
  its strict input contract; its dispatch line already says "platform's
  subagent primitive" — keep, pointing at the reference. pr-comment-resolver
  keeps the `verdict:`/`feedback_id:` return block byte-for-byte.
  frontend-implementation-expert keeps composing `frontend-design`,
  `code-taste`, and `vercel-react-best-practices`, phrased as "load these
  skills, or read their SKILL.md files where sub-agents cannot load skills."
  design-iterator gets the minimal ce-polish trigger from
  `.ai/agent-loop-reference-inventory.md` (iterative visual refinement,
  "isn't coming together", N polish passes); keep its `agent-browser` CLI
  dependency note.
- Test scenarios: none — instruction files. Verify: resolve-pr-feedback's
  parsing instructions still match the moved return block.

### Phase D — Teardown

### U8. Delete agents/ and sweep for stale references

- Goal: the agents shelf is gone and nothing points at it.
- Requirements: R6.
- Dependencies: U1–U7.
- Files: delete `agents/` (27 `.md` files plus `session-history-scripts/`);
  `skills/ce-sessions/evals/README.md` (prose mentions of the subagent).
- Approach: delete, then `rg` for every agent name and for `agents/` across
  the repo; fix hits outside `.git` and historical `.ai/` docs.
- Test scenarios: repo-wide search for each of the 27 names returns no
  dispatch references.

### U9. Remove agent machinery from the CLI and tests

- Goal: the CLI renders skills and hooks only; codex is hooks-only.
- Requirements: R7.
- Dependencies: U8.
- Files: `src/render/claude.ts`, `src/render/codex.ts`,
  `src/render/opencode.ts`, `src/render/source.ts`, `src/render/content.ts`,
  `src/link/index.ts`, `src/cli.ts`, `src/types.ts`,
  `tests/render-opencode.test.ts`, `tests/linking.test.ts`.
- Approach: remove `renderClaudeMarkdown`, `loadMarkdownSources`/
  `loadMarkdownSource`, `deriveMarkdownName`, `parseToolNames` + `TOOL_MAP`,
  the agent-suffix regex in `flattenOpenCodeAgentReferences`,
  `renderOpenCodeAgent` + its frontmatter/permission builders, the codex
  agent-TOML path (`renderCodexAgent`, `codexOptionalModelLines`,
  `codexSandboxLines`, `formatTomlString`, `CODEX_WRITE_TOOLS`),
  `SourceMarkdownFile`, the three agents link entries, and the codex
  completion-message special-casing. Add the previously linked agents target
  directories to `removeObsoletePaths` so stale symlinks are cleaned on next
  link. Amend tests per the migration inventory: salvage skill/hook
  assertions, delete agent fixtures and the codex sandbox/model tests,
  repoint the kind-mismatch fixture at `skills`.
- Test scenarios: `bun test` green; generated target trees contain no
  `agents/` directories; a link run against a tree with a stale agents
  symlink removes it; `bunx oxlint src tests` and `tsc --noEmit` clean.

### U10. Update README and re-render targets

- Goal: docs match the new shape and deployed harness dirs are refreshed.
- Requirements: R7, R8.
- Dependencies: U9.
- Files: `README.md`; run `bun run render` and `bun run link`.
- Approach: replace the agent inventory tables and Context Delegation section
  with a short "personas live in their owner skills" section pointing at the
  ce-review reviewer index and the researcher skills; drop the four listed
  agents with no files; move the `agent-browser` install note next to the
  design personas' new homes. Re-render and re-link all targets.
- Test scenarios: none beyond U9's suite. Verify: a fresh Claude session
  lists the new researcher skills and no custom agent types.

---

## Scope Boundaries

- Persona content is moved, not improved — frame edits only. Rewrites of
  reviewer checklists or researcher methods are out.
- Vendored skills (`skills-lock.json` entries) are untouched.
- ce-review's mode logic (quick/standard/deep) and lens set are unchanged.

### Deferred to Follow-Up Work

- Extra ce-work triggers for design-implementation-reviewer and
  git-history-analyzer (prior inventory recommendations 2–3).
- Full design-iterator integration into ce-polish beyond the minimal trigger.
- Retiring the codex render target entirely if hooks stop needing it.

---

## Risks & Dependencies

- Built-in `/code-review` loses the custom personas and falls back to default
  behavior — accepted; ce-review is canonical.
- Harnesses without sub-agents run passes inline — the fallback clause in the
  canonical dispatch shape is load-bearing; omitting it at any site breaks
  those harnesses.
- Deployed `~/.claude/skills` copies drift from the repo until U10's
  re-render/link runs; do the link step in the same sitting as the merge.
- `design-implementation-reviewer` and `design-iterator` depend on the
  external `agent-browser` CLI; their reference files must keep that
  dependency visible.

---

## Sources

- `.ai/agent-loop-reference-inventory.md` — agent-to-loop ownership map
  (June 2026; stale on four renamed agents, superseded by the fresh sweep).
- Fresh dispatch-site sweep (2026-07-27): ~20 dispatch instructions across 10
  skills; CLI blast radius ~200–260 src lines, 2 test files;
  `agents/session-history-scripts/` unreferenced;
  `skills/repo-research-analyst/` stale predecessor; orca-multi-review and
  orca-super-review have zero coupling to `agents/`.
