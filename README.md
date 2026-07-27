# .agents

Shared AI agent configuration synced across projects. Contains skills and hooks that extend AI coding assistants; specialist personas live inside their owner skills as plain reference files.

## Local CLI

Use the local Bun CLI to render target-specific files and link tool configs to
those generated outputs:

```bash
bun run sync opencode
bun run sync claude
bun run sync codex
```

Generated target trees live under `.generated/` and are intentionally ignored by
git. Canonical source remains in `skills/` and `hooks/`.

Codex loads canonical skills and `AGENTS.md` natively. The Codex sync target
renders hook adapters into Codex-native locations.

## Configuration Ownership

This repository is the source of truth for sharable coding-harness
configuration on a machine. Skills, hooks, and the shared instructions
file come from this repo; do not maintain parallel custom versions under
`~/.claude`, `~/.config/opencode`, or `~/.codex`. Move sharable config here,
then run sync.

The sync step may replace harness links and hook config for those owned
surfaces. It also removes obsolete repo-managed `agents`, `commands`, and
`rules` links; those are no longer synchronized surfaces.

**Edit only the canonical sources** (`skills/`, `hooks/`, and the
root `AGENTS.md`). Generated target trees under `.generated/` and any mirrored
copies under `~/.config/opencode`, `~/.claude`, or `~/.codex` are overwritten
by `bun run sync` — edits made there are lost. Make the change in the
canonical file, then run `bun run sync` to propagate all targets, or
`bun run sync opencode` for one target.

Render without linking:

```bash
bun run render opencode
bun run render claude
bun run render codex
```

Link previously rendered outputs:

```bash
bun run link opencode
bun run link claude
bun run link codex
```

## Installing External Skills

Use `npx skills` for third-party skills that should retain skills.sh update
provenance. Current `skills` writes project provenance to `skills-lock.json`.
The older `.skill-lock.json` is legacy installer state and is not updated by
current `npx skills` commands.

To install into only the shared `.agents/skills` project surface, target one of
the universal agents such as `codex`, `opencode`, `cursor`, `cline`,
`gemini-cli`, `github-copilot`, `warp`, `zed`, or `universal`. Do not use
`claude-code`, `--agent '*'`, or `--all` when the goal is to avoid
harness-specific project folders such as `.claude/skills`.

This repository is itself `~/.agents`, so running a universal project install
from this directory would create `~/.agents/.agents/skills`. To update this
repo's canonical `skills/` shelf from inside the repo, target `openclaw`:

```bash
npx skills add vercel-labs/agent-skills \
  --skill vercel-react-best-practices \
  --agent openclaw \
  --copy \
  -y
```

## Operating Loops

The shelf is organized around a few tight loops rather than standalone skills:

| Loop | Route |
| ---- | ----- |
| Explore and decide | `qmd-knowledge-base` / Obsidian when prior context may affect the frame -> `repoprompt` when broad codebase context matters -> `ce-brainstorm` -> `ce-grill` when branchy -> `document-review` when a requirements doc needs polish -> `ce-plan` |
| Plan and build | `qmd-knowledge-base` when prior context could affect the plan -> `ce-plan` with `repo-research-analyst` / `repoprompt` when broad -> `document-review` for markdown plans -> `ce-work` with early `code-taste` routing; delegate non-trivial frontend slices via `skills/ce-work/references/frontend-implementation-expert.md`; finish with `ce-quality-gate` |
| Review and ship | `ce-review` on changed work, delegating medium/large passes to reviewer personas -> `ce-simplify-code` when shape needs cleanup -> git skills for ops; `pr-review-canvas` for an interactive walkthrough of someone else's PR; `ce-thermo-nuclear-code-quality-review` when the change needs an unusually strict maintainability pass |
| Remember and reuse | `ce-compound` / `ce-compound-refresh` -> `.ai` -> QMD retrieval in a later discovery pass |
| Debug and investigate | `ce-debug` -> `repoprompt` when broad context is needed -> `ce-work` -> `ce-review` |
| Improve the agent shelf | QMD retros / focused `ce-sessions` evidence -> `ce-improve-skills` -> one owner-skill patch or proposal -> later retro measurement |

## Context Delegation

Skills own loops. Bounded, context-heavy phase work goes to sub-agents spawned
with a persona — a plain markdown file the sub-agent reads and applies. Because
personas are ordinary skill files, every harness (Claude Code, Codex, OpenCode)
gets the same ones with no per-harness rendering.

Examples:

- `ce-work` owns product contract, scope, final integration, proof, and final
  report; it delegates React/UI slices via
  `skills/ce-work/references/frontend-implementation-expert.md`.
- `ce-plan` owns the plan artifact and delegates codebase, Slack, web,
  documentation, and flow research to the researcher skills below.
- `ce-review` owns severity, deduplication, and verdict, while reviewer
  personas isolate correctness, TypeScript, testing, reliability, performance,
  API, and standards context for medium/large diffs.

## Personas

Reviewer personas (15) live in `skills/ce-review/references/reviewers/`; the
Reviewer Index in `skills/ce-review/SKILL.md` says when each lens applies.

Researchers are standalone skills, dispatchable from any loop:
`repo-research-analyst`, `web-researcher`, `docs-researcher`,
`learnings-researcher`, and `git-history-analyzer`.

Single-owner worker personas live under their loop skill's `references/`:

| Persona | Home |
| --- | --- |
| `slack-researcher` | `skills/ce-slack-research/references/` |
| `session-historian` | `skills/ce-sessions/references/` |
| `pr-comment-resolver` | `skills/resolve-pr-feedback/references/` |
| `spec-flow-analyzer` | `skills/ce-plan/references/` |
| `frontend-implementation-expert`, `documentation-specialist` | `skills/ce-work/references/` |
| `design-iterator` | `skills/ce-polish/references/` |

## Skills

### Architecture and Design

| Skill                          | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `code-taste`                   | TypeScript, React, and code-shape guidance             |
| `frontend-design`              | Create production-grade frontend interfaces            |
| `improve-codebase-architecture` | Find architecture deepening opportunities              |
| `vercel-react-best-practices`  | React and Next.js performance optimization from Vercel |

### Code Quality

| Skill              | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `ce-quality-gate`  | Make touched code clean for lint, format, type, and tests    |
| `ce-thermo-nuclear-code-quality-review` | Unusually strict maintainability review hunting for code-judo restructuring moves |
| `deslop`           | Remove AI-generated code slop from current branch            |
| `security-review`  | Security code review for vulnerabilities (OWASP)             |
| `skill-scanner`    | Scan agent skills for security issues and prompt injection   |

### Development Tools

| Skill                       | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `docs-researcher`           | Research official docs and version constraints       |
| `git-history-analyzer`      | Trace git history to explain code evolution          |
| `learnings-researcher`      | Search `.ai/solutions/` for past learnings           |
| `onboarding`                | Generate ONBOARDING.md for new contributors          |
| `repo-research-analyst`     | Scoped repo reconnaissance with inline summary       |
| `typescript-advanced-types` | Master TypeScript's advanced type system             |
| `web-researcher`            | Iterative web research with structured grounding     |

### Codebase Exploration

| Skill                  | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `repoprompt`           | Use RepoPromptCE / rpce-cli for token-efficient context |

### Documentation

| Skill              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `agents-md`        | Create and maintain AGENTS.md / CLAUDE.md files      |
| `document-review`  | Review requirements and plan documents before handoff |

### Knowledge Search

| Skill | Description |
| ----- | ----------- |
| `qmd` | Operate QMD search and retrieval across markdown knowledge bases |
| `qmd-knowledge-base` | Route this machine's project collections and interpret their evidence |

### Learning

| Skill   | Description                                                  |
| ------- | ------------------------------------------------------------ |
| `teach` | Create stateful learning workspaces with lessons and records |

### Obsidian

| Skill               | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `obsidian-vault`     | Manage Obsidian vaults via CLI (notes, tasks, properties)|
| `obsidian-cli`       | CLI interaction with Obsidian including plugin dev        |
| `obsidian-markdown`  | Obsidian-flavored markdown (wikilinks, callouts, embeds) |
| `obsidian-bases`     | Create and edit Obsidian Bases (.base files)             |
| `json-canvas`        | Create and edit JSON Canvas files (.canvas)              |

### Workflow and Git

| Skill                        | Description                                              |
| ---------------------------- | -------------------------------------------------------- |
| `git-clean-gone-branches`    | Clean up local branches whose remote is gone             |
| `git-commit`                 | Create value-led Conventional Commits                    |
| `git-commit-push-pr`         | Commit, push, and open a PR with a conventional title    |
| `git-worktree`               | Manage Git worktrees for parallel development            |
| `resolve-pr-feedback`        | Resolve PR review feedback by evaluating and fixing in parallel |

### Workflow Skills

| Skill                  | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `ce-brainstorm`        | Explore requirements through collaborative dialogue            |
| `ce-compound`          | Document solved problems to compound team knowledge            |
| `ce-compound-refresh`  | Refresh stale learnings and pattern docs against current codebase |
| `ce-debug`             | Systematic debugging with anti-patterns and investigation techniques |
| `ce-decompose`         | Carve an oversized diff into a reviewable stack, or rebuild it in increments |
| `ce-grill`             | Clarify branchy requirements before planning                   |
| `ce-handoff`           | Compact current work into a continuation brief                 |
| `ce-ideate`            | Generate and evaluate grounded improvement ideas for a project |
| `ce-optimize`          | Auto-research loop for tuning prompts and evaluating solutions |
| `ce-plan`              | Transform requirements into structured implementation plans    |
| `ce-review`            | Review branch, PR, or local work before shipping               |
| `pr-review-canvas`     | Generate an interactive HTML PR walkthrough from `gh api` data |
| `ce-simplify-code`     | Simplify recent code changes while preserving behavior         |
| `ce-sessions`          | Cross-platform session history analysis                        |
| `ce-slack-research`    | Research organizational context from Slack                     |
| `ce-work`              | Execute work efficiently while maintaining quality             |

### Integrations

| Skill                           | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `linear`                        | Manage issues, projects, and team workflows in Linear          |

### Image Generation

| Skill             | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `imagegen`        | Generate or edit images via the OpenAI Image API         |

> **Browser automation:** install the standalone `vercel-labs/agent-browser` plugin when using design workflows that still depend on it. The `design-iterator` persona (`skills/ce-polish/references/`) and the `design-implementation` reviewer persona (`skills/ce-review/references/reviewers/`) expect the `agent-browser` CLI to be on your `$PATH`.

## Key Files

- **`AGENTS.md`** -- Global agent instructions: code style, workflow orchestration, task management, QMD prior-art search, and core principles

## License

MIT
