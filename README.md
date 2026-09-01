# agent-kit

Git-installable plugin for shared coding-agent skills and hooks.

The GitHub repo stays `.agents`. The plugin id is `agent-kit`.

One `PluginBundle` owns the tree.

```
{
  id: "agent-kit",
  skillsDir: "skills/",
  hooksDir: "hooks/",
  manifests: { cursor, claude, codex, grok }
}
```

Harness adapters are thin JSON manifests over that one tree. Skills are not copied per harness.

`AGENTS.md` is repo documentation. Plugin install does not copy it into Claude, Codex, or Cursor as always-on rules.

Prefer project-scoped install. An account-wide Cursor install applies this plugin to every cloud agent.

## Install

### Claude Code

```text
/plugin marketplace add SiTaggart/.agents
/plugin install agent-kit@agent-kit
```

Choose project scope in the install prompt.

To add the marketplace for everyone who trusts the project folder, put this in that project's `.claude/settings.json`.

```json
{
  "extraKnownMarketplaces": {
    "agent-kit": {
      "source": {
        "source": "github",
        "repo": "SiTaggart/.agents"
      }
    }
  },
  "enabledPlugins": {
    "agent-kit@agent-kit": true
  }
}
```

Turn it off for a native-harness A/B with `/plugin disable agent-kit@agent-kit` or `/plugin uninstall agent-kit@agent-kit`.

### Codex

```bash
codex plugin marketplace add SiTaggart/.agents
```

Then install `agent-kit` from that marketplace. Codex caches the plugin under `~/.codex/plugins`. The clone does not need to live at `~/.agents`.

Turn it off in the Codex plugin directory, or run `codex plugin marketplace remove agent-kit`.

### Cursor and Grok

Grok Bot in Cursor uses the Cursor plugin. There is no second skills tree.

The official Cursor marketplace is review-gated and is not part of this repo. Public GitHub is the source.

Cursor private marketplaces are a Teams feature. Import `https://github.com/SiTaggart/.agents` there and enable `agent-kit` on the project. Prefer project scope. Account-wide install hits every cloud agent.

Turn it off in Cursor plugin settings for a native-harness A/B.

## Edit skills

Edit files under `skills/` once.

Claude, Cursor, Codex, and Grok consume those files as-is through the plugin manifests.

Do not add a second copy of a skill folder under a harness directory.

## Hooks

`hooks/scripts/prevent-main-commit.sh` is the shared policy script.

Claude and Codex load `hooks/hooks.json` (`PreToolUse` / `Bash`).

Cursor loads `hooks/cursor.json` (`beforeShellExecution`). The two JSON shapes are not compatible.

## Validate

Reviewers can rerun this without installing a harness.

```bash
bun run validate
bun test
bun run lint
bun run type-check
```

The validator checks that manifests parse, required fields exist, `skills/` and named hook files exist, `AGENTS.md` is not a plugin component, and the retired `plugins/marketplace.json` catalog is gone.

## Adding third-party skills

Use `npx skills` for third-party skills that should retain skills.sh update provenance. Current `skills` writes project provenance to `skills-lock.json`.

To add a skill into this repo's canonical `skills/` shelf, run the installer from the repo and target `openclaw`.

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
| Review and ship | `ce-review` on changed work, delegating medium/large passes to reviewer personas -> `ce-triage-pr-feedback` when comments arrive -> approved fixes and proof -> git skills for authorized ops; `ce-simplify-code` when shape needs cleanup; `pr-review-canvas` for an interactive walkthrough of someone else's PR; `ce-thermo-nuclear-code-quality-review` when the change needs an unusually strict maintainability pass |
| Remember and reuse | `ce-compound` / `ce-compound-refresh` -> `.ai` -> QMD retrieval in a later discovery pass |
| Debug and investigate | `ce-debug` -> `repoprompt` when broad context is needed -> `ce-work` -> `ce-review` |
| Improve the agent shelf | QMD retros / focused `ce-sessions` evidence -> `ce-improve-skills` -> one owner-skill patch or proposal -> later retro measurement |

## Context Delegation

Skills own loops. Bounded, context-heavy phase work goes to sub-agents spawned
with a persona — a plain markdown file the sub-agent reads and applies.
Personas ship inside skills (reviewer and worker personas as `references/`
files, researchers as their own skills). Claude, Cursor, Codex, and Grok load
the same files through the plugin.

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
| `ce-triage-pr-feedback` | Evaluate PR comments before fixing, rejecting, or deferring them |
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

## Key files

- `skills/` is the canonical skill tree.
- `hooks/` holds the shared policy script plus harness hook JSON.
- `AGENTS.md` is human documentation for this repo. It is not a plugin component.
- `.cursor-plugin/`, `.claude-plugin/`, `.codex-plugin/`, and `.agents/plugins/` are harness adapters.

## License

MIT
