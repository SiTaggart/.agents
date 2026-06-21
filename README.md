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

## Components

| Component  | Count |
| ---------- | ----- |
| Agents     | 40    |
| Skills     | 59    |

## Operating Loops

The shelf is organized around a few tight loops rather than standalone skills:

| Loop | Route |
| ---- | ----- |
| Explore and decide | `qmd` / Obsidian / `repoprompt` when broad codebase context matters -> `ce-brainstorm` -> `ce-grill` when branchy -> `document-review` when a requirements doc needs polish -> `ce-plan` |
| Plan and build | `ce-plan` with `repoprompt` when broad -> `document-review` for markdown plans -> `ce-work` -> `ce-quality-gate`; fold in `frontend-design` for UI work |
| Review and ship | `ce-review` on changed work -> `ce-simplify-code` when shape needs cleanup -> git skills for ops |
| Remember and reuse | `ce-compound` / `ce-compound-refresh` -> Obsidian or QMD for durable knowledge |
| Debug and investigate | `ce-debug` -> `repoprompt` when broad context is needed -> `ce-work` -> `ce-review` |

## Agents

### Review (18)

| Agent                            | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `adversarial-reviewer`           | Construct failure scenarios for large or high-risk diffs        |
| `api-contract-reviewer`          | Review diffs touching API routes, types, or versioning for breaking changes |
| `architecture-strategist`        | Analyze architectural decisions and compliance                  |
| `cli-agent-readiness-reviewer`   | Review CLI source for AI agent readiness using severity rubric  |
| `cli-readiness-reviewer`         | Review CLI command diffs for agent optimization                 |
| `code-simplicity-reviewer`       | Final pass for simplicity and minimalism                        |
| `correctness-reviewer`           | Review code for logic errors, edge cases, and state management bugs |
| `data-migration-reviewer`        | Review migrations, schema changes, backfills, and data transforms |
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

### Research (9)

| Agent                       | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `best-practices-researcher` | Gather external best practices and examples         |
| `framework-docs-researcher` | Research framework documentation and best practices |
| `git-history-analyzer`      | Analyze git history and code evolution              |
| `issue-intelligence-analyst`| Analyze GitHub issues for recurring themes and pain patterns |
| `learnings-researcher`      | Search past solutions in .ai/solutions/ for institutional knowledge |
| `repo-research-analyst`     | Research repository structure and conventions       |
| `session-historian`         | Analyze past agent sessions across Claude Code / Codex / Cursor |
| `slack-researcher`          | Research organizational context from Slack workspaces |
| `web-researcher`            | Research external documentation and web references  |

### Design (4)

| Agent                            | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `design-iterator`                | Iteratively refine UI through systematic design iterations |
| `figma-design-sync`              | Synchronize web implementations with Figma designs         |
| `frontend-implementation-expert` | Implement frontend code changes in React applications      |
| `ankane-readme-writer`           | Create READMEs following Ankane-style template             |

### Development (7)

| Agent                            | Description                                            |
| -------------------------------- | ------------------------------------------------------ |
| `codebase-pattern-finder`        | Find similar implementations and patterns in codebase  |
| `debug-specialist`               | Troubleshoot errors, test failures, unexpected behavior|
| `deployment-verification-agent`  | Produce Go/No-Go deployment checklists with rollback procedures |
| `documentation-specialist`       | Create, update, and improve documentation              |
| `implementation-architect`       | Break down requirements into technical plans           |
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
| `frontend-design`              | Create production-grade frontend interfaces            |
| `improve-codebase-architecture` | Find architecture deepening opportunities              |
| `vercel-react-best-practices`  | React and Next.js performance optimization from Vercel |

### Code Quality

| Skill              | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `ce-quality-gate`  | Make touched code clean for lint, format, type, and tests    |
| `deslop`           | Remove AI-generated code slop from current branch            |
| `security-review`  | Security code review for vulnerabilities (OWASP)             |
| `skill-scanner`    | Scan agent skills for security issues and prompt injection   |

### Development Tools

| Skill                       | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `claude-settings-audit`     | Generate recommended Claude Code settings.json       |
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

| Skill       | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `qmd`       | Search markdown knowledge bases, notes, and documentation    |

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
| `standup-skill`              | Generate a summary of work from the previous workday     |

### Task Management

| Skill              | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `todo-create`      | Create durable work items and track findings across sessions   |
| `todo-resolve`     | Batch-resolve approved todos after code review or triage       |
| `todo-triage`      | Review pending todos for approval and prioritization           |

### Workflow Skills

| Skill                  | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `ce-brainstorm`        | Explore requirements through collaborative dialogue            |
| `ce-compound`          | Document solved problems to compound team knowledge            |
| `ce-compound-refresh`  | Refresh stale learnings and pattern docs against current codebase |
| `ce-debug`             | Systematic debugging with anti-patterns and investigation techniques |
| `ce-decompose`         | Carve an oversized diff into a reviewable stack, or rebuild it in increments |
| `find-skills`          | Route tasks to the right local skill loop                    |
| `ce-grill`             | Clarify branchy requirements before planning                   |
| `ce-handoff`           | Compact current work into a continuation brief                 |
| `ce-ideate`            | Generate and evaluate grounded improvement ideas for a project |
| `ce-optimize`          | Auto-research loop for tuning prompts and evaluating solutions |
| `ce-plan`              | Transform requirements into structured implementation plans    |
| `ce-review`            | Review branch, PR, or local work before shipping               |
| `ce-simplify-code`     | Simplify recent code changes while preserving behavior         |
| `ce-sessions`          | Cross-platform session history analysis                        |
| `ce-slack-research`    | Research organizational context from Slack                     |
| `ce-work`              | Execute work efficiently while maintaining quality             |
| `changelog`            | Write source-backed changelogs from recent merges              |

### Integrations

| Skill                           | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `linear`                        | Manage issues, projects, and team workflows in Linear          |

### Image Generation

| Skill             | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `imagegen`        | Generate or edit images via the OpenAI Image API         |

> **Browser automation:** install the standalone `vercel-labs/agent-browser` plugin when using design workflows that still depend on it. `design-iterator`, `design-implementation-reviewer`, and `figma-design-sync` expect the `agent-browser` CLI to be on your `$PATH`.

## Key Files

- **`AGENTS.md`** -- Global agent instructions: code style, workflow orchestration, task management, QMD prior-art search, and core principles

## License

MIT
