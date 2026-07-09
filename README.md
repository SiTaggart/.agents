# .agents

Shared AI agent configuration synced across projects. Contains agents, skills, and hooks that extend AI coding assistants.

## Local CLI

Use the local Bun CLI to render target-specific files and link tool configs to
those generated outputs:

```bash
bun run sync opencode
bun run sync claude
bun run sync codex
```

Generated target trees live under `.generated/` and are intentionally ignored by
git. Canonical source remains in `agents/`, `skills/`, and `hooks/`.

Codex loads canonical skills and `AGENTS.md` natively. The Codex sync target
renders custom subagent TOML files and hook adapters into Codex-native
locations.

## Configuration Ownership

This repository is the source of truth for sharable coding-harness
configuration on a machine. Agents, skills, hooks, and the shared instructions
file come from this repo; do not maintain parallel custom versions under
`~/.claude`, `~/.config/opencode`, or `~/.codex`. Move sharable config here,
then run sync.

The sync step may replace harness links and hook config for those owned
surfaces. It also removes obsolete repo-managed `commands` and `rules` links;
those are no longer synchronized surfaces.

**Edit only the canonical sources** (`agents/`, `skills/`, `hooks/`, and the
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

## Components

| Component  | Count |
| ---------- | ----- |
| Agents     | 30    |
| Skills     | 73    |

## Operating Loops

The shelf is organized around a few tight loops rather than standalone skills:

| Loop | Route |
| ---- | ----- |
| Explore and decide | `qmd-knowledge-base` / Obsidian when prior context may affect the frame -> `repoprompt` when broad codebase context matters -> `ce-brainstorm` -> `ce-grill` when branchy -> `document-review` when a requirements doc needs polish -> `ce-plan` |
| Plan and build | `qmd-knowledge-base` when prior context could affect the plan -> `ce-plan` with `repo-research-analyst` / `repoprompt` when broad -> `document-review` for markdown plans -> `ce-work` with early `code-taste` routing; delegate non-trivial frontend slices to `frontend-implementation-expert`; finish with `ce-quality-gate` |
| Review and ship | `ce-review` on changed work, delegating medium/large passes to reviewer agents -> `ce-simplify-code` when shape needs cleanup -> git skills for ops; `pr-review-canvas` for an interactive walkthrough of someone else's PR; `ce-thermo-nuclear-code-quality-review` when the change needs an unusually strict maintainability pass |
| Remember and reuse | `ce-compound` / `ce-compound-refresh` -> `.ai` -> QMD retrieval in a later discovery pass |
| Debug and investigate | `ce-debug` -> `repoprompt` when broad context is needed -> `ce-work` -> `ce-review` |
| Improve the agent shelf | QMD retros / focused `ce-sessions` evidence -> `ce-improve-skills` -> one owner-skill patch or proposal -> later retro measurement |

## Context Delegation

Skills own loops. Agents own bounded, context-heavy phase work. Supporting
skills provide specialist doctrine inside the delegated agent when that keeps
the orchestrator smaller.

Examples:

- `ce-work` owns product contract, scope, final integration, proof, and final
  report.
- `frontend-implementation-expert` owns delegated React/UI implementation
  slices and uses `frontend-design`, `code-taste`, and
  `vercel-react-best-practices` inside its own context.
- `ce-plan` owns the plan artifact and delegates codebase, Slack, web,
  documentation, and flow research to specialist agents.
- `ce-review` owns severity, deduplication, and verdict, while reviewer agents
  isolate correctness, TypeScript, testing, reliability, performance, API, and
  standards context for medium/large diffs.

## Agents

### Review (15)

| Agent                            | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `adversarial-reviewer`           | Construct failure scenarios for large or high-risk diffs        |
| `api-contract-reviewer`          | Review diffs touching API routes, types, or versioning for breaking changes |
| `architecture-strategist`        | Analyze architectural decisions and compliance                  |
| `code-simplicity-reviewer`       | Final pass for simplicity and minimalism                        |
| `correctness-reviewer`           | Review code for logic errors, edge cases, and state management bugs |
| `design-implementation-reviewer` | Verify UI implementations match Figma designs                   |
| `julik-frontend-races-reviewer`  | Review JavaScript/Stimulus code for race conditions             |
| `kieran-python-reviewer`         | Python code review with strict conventions                      |
| `kieran-typescript-reviewer`     | TypeScript code review with strict conventions                  |
| `maintainability-reviewer`       | Review code for premature abstraction, dead code, and coupling  |
| `pattern-recognition-specialist` | Analyze code for patterns and anti-patterns                     |
| `performance-reviewer`           | Review diffs touching queries, caching, or I/O for performance  |
| `previous-comments-reviewer`     | Check whether prior PR feedback has been addressed in current diff |
| `project-standards-reviewer`     | Audit changes against CLAUDE.md and AGENTS.md standards         |
| `reliability-reviewer`           | Review error handling, retries, and failure modes for production reliability |

### Research (8)

| Agent                       | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `best-practices-researcher` | Gather external best practices and examples         |
| `framework-docs-researcher` | Research framework documentation and best practices |
| `git-history-analyzer`      | Analyze git history and code evolution              |
| `learnings-researcher`      | Search past solutions in .ai/solutions/ for institutional knowledge |
| `repo-research-analyst`     | Research repository structure and conventions       |
| `session-historian`         | Analyze past agent sessions across Claude Code / Codex / Cursor |
| `slack-researcher`          | Research organizational context from Slack workspaces |
| `web-researcher`            | Research external documentation and web references  |

### Design (2)

| Agent                            | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `design-iterator`                | Iteratively refine UI through systematic design iterations |
| `frontend-implementation-expert` | Implement frontend code changes in React applications      |

### Development (3)

| Agent                            | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `documentation-specialist`       | Create, update, and improve documentation              |
| `react-test-architect`           | Design and implement React test strategies             |
| `testing-reviewer`               | Review code for test coverage gaps and weak assertions  |

### Workflow (2)

| Agent                        | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `pr-comment-resolver`        | Address PR comments and implement fixes           |
| `spec-flow-analyzer`         | Analyze user flows and identify gaps in specs     |

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
| `onboarding`                | Generate ONBOARDING.md for new contributors          |
| `repo-research-analyst`     | Analyze repository structure and patterns            |
| `typescript-advanced-types` | Master TypeScript's advanced type system             |

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

> **Browser automation:** install the standalone `vercel-labs/agent-browser` plugin when using design workflows that still depend on it. `design-iterator` and `design-implementation-reviewer` expect the `agent-browser` CLI to be on your `$PATH`.

## Key Files

- **`AGENTS.md`** -- Global agent instructions: code style, workflow orchestration, task management, QMD prior-art search, and core principles

## License

MIT
