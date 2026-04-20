# .agents

Shared AI agent configuration synced across projects. Contains agents, commands, skills, rules, and hooks that extend AI coding assistants.

## Components

| Component  | Count |
| ---------- | ----- |
| Agents     | 56    |
| Commands   | 4     |
| Skills     | 77    |
| Rules      | 2     |

## Agents

### Review (30)

| Agent                            | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `adversarial-document-reviewer`  | Challenge premises and stress-test decisions in large or high-stakes documents |
| `adversarial-reviewer`           | Construct failure scenarios for large or high-risk diffs        |
| `agent-native-reviewer`          | Ensure agent-native parity: any user action is also agent-accessible |
| `api-contract-reviewer`          | Review diffs touching API routes, types, or versioning for breaking changes |
| `architecture-strategist`        | Analyze architectural decisions and compliance                  |
| `cli-agent-readiness-reviewer`   | Review CLI source for AI agent readiness using severity rubric  |
| `cli-readiness-reviewer`         | Review CLI command diffs for agent optimization                 |
| `code-simplicity-reviewer`       | Final pass for simplicity and minimalism                        |
| `coherence-reviewer`             | Check planning documents for internal consistency and terminology drift |
| `correctness-reviewer`           | Review code for logic errors, edge cases, and state management bugs |
| `data-integrity-guardian`        | Database migrations and data integrity                          |
| `data-migration-expert`          | Validate ID mappings match production, check for swapped values |
| `data-migrations-reviewer`       | Review migration files, schema changes, and backfill scripts    |
| `design-implementation-reviewer` | Verify UI implementations match Figma designs                   |
| `design-lens-reviewer`           | Surface missing design decisions in planning documents          |
| `feasibility-reviewer`           | Evaluate whether proposed technical approaches will survive implementation |
| `julik-frontend-races-reviewer`  | Review JavaScript/Stimulus code for race conditions             |
| `kieran-rails-reviewer`          | Rails code review with strict conventions                       |
| `kieran-python-reviewer`         | Python code review with strict conventions                      |
| `kieran-typescript-reviewer`     | TypeScript code review with strict conventions                  |
| `maintainability-reviewer`       | Review code for premature abstraction, dead code, and coupling  |
| `pattern-recognition-specialist` | Analyze code for patterns and anti-patterns                     |
| `performance-oracle`             | Performance analysis and optimization                           |
| `performance-reviewer`           | Review diffs touching queries, caching, or I/O for performance  |
| `previous-comments-reviewer`     | Check whether prior PR feedback has been addressed in current diff |
| `product-lens-reviewer`          | Challenge problem framing and scope alignment in planning docs  |
| `project-standards-reviewer`     | Audit changes against CLAUDE.md and AGENTS.md standards         |
| `reliability-reviewer`           | Review error handling, retries, and failure modes for production reliability |
| `scope-guardian-reviewer`        | Flag unjustified complexity and scope creep in planning documents |
| `security-lens-reviewer`         | Evaluate planning documents for security gaps and threat model holes |

### Security (2)

| Agent                            | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `security-reviewer`              | Review diffs touching auth, endpoints, or user input for vulnerabilities |
| `security-sentinel`              | Security audits and vulnerability assessments                   |

### Research (10)

| Agent                       | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `best-practices-researcher` | Gather external best practices and examples         |
| `framework-docs-researcher` | Research framework documentation and best practices |
| `git-history-analyzer`      | Analyze git history and code evolution              |
| `issue-intelligence-analyst`| Analyze GitHub issues for recurring themes and pain patterns |
| `learnings-researcher`      | Search past solutions in .ai/solutions/ for institutional knowledge |
| `repo-research-analyst`     | Research repository structure and conventions       |
| `rp-explorer`               | Token-efficient codebase exploration via RepoPrompt |
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

### Workflow (3)

| Agent                        | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `pr-comment-resolver`        | Address PR comments and implement fixes           |
| `spec-flow-analyzer`         | Analyze user flows and identify gaps in specs     |
| `task-orchestrator`          | Determine optimal delegation across sub-agents    |

## Commands

| Command                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `/deslop`                | Remove AI-generated code slop from current branch            |
| `/playwright-test`       | Run browser tests on PR-affected pages                       |
| `/set-custom-rules`      | Set custom rules for the project                             |
| `/verify-custom-rules`   | Verify custom rules for the project                          |

## Skills

### Architecture and Design

| Skill                          | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `agent-native-architecture`    | Build AI agents using prompt-native architecture       |
| `agent-native-audit`           | Run comprehensive agent-native architecture review with scored principles |
| `frontend-design`              | Create production-grade frontend interfaces            |
| `web-design-guidelines`        | Review UI code for Web Interface Guidelines compliance |
| `vercel-react-best-practices`  | React and Next.js performance optimization from Vercel |

### Code Quality

| Skill              | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `code-simplifier`  | Simplify and refine code for clarity and maintainability     |
| `deslop`           | Remove AI-generated code slop from current branch            |
| `find-bugs`        | Find bugs, security vulnerabilities, and code quality issues |
| `security-review`  | Security code review for vulnerabilities (OWASP)             |
| `skill-scanner`    | Scan agent skills for security issues and prompt injection   |

### Development Tools

| Skill                       | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `claude-settings-audit`     | Generate recommended Claude Code settings.json       |
| `github-search`             | Search GitHub code, repos, issues, and PRs via CLI   |
| `onboarding`                | Generate ONBOARDING.md for new contributors          |
| `repo-research-analyst`     | Analyze repository structure and patterns            |
| `test-driven-development`   | Test-driven development workflows                    |
| `typescript-advanced-types` | Master TypeScript's advanced type system             |

### Codebase Exploration

| Skill                  | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `repoprompt`           | Use RepoPrompt CLI for codebase exploration           |
| `rp-explorer`          | Token-efficient codebase exploration using RepoPrompt |
| `rp-build-cli`         | Build with rp-cli context builder, chat, and implement|
| `rp-investigate-cli`   | Deep codebase investigation and architecture research |
| `rp-oracle-export-cli` | Export context for oracle consultation                |
| `rp-refactor-cli`      | Refactoring assistant using rp-cli                    |
| `rp-reminder-cli`      | Reminder to use rp-cli                                |
| `rp-review-cli`        | Code review workflow using rp-cli                     |

### Documentation

| Skill              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `agents-md`        | Create and maintain AGENTS.md / CLAUDE.md files      |
| `doc-coauthoring`  | Structured workflow for co-authoring documentation   |
| `document-review`  | Refine brainstorm or plan documents before next step |

### Knowledge Search

| Skill       | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `defuddle`  | Extract clean markdown from web pages, removing clutter      |
| `qmd`       | Search markdown knowledge bases, notes, and documentation    |

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
| `commit`                     | Create git commits with user approval                    |
| `create-pr`                  | Create pull requests following conventions               |
| `describe_pr`                | Generate comprehensive PR descriptions                   |
| `git-clean-gone-branches`    | Clean up local branches whose remote is gone             |
| `git-commit`                 | Create commits with clear, value-communicating messages  |
| `git-commit-push-pr`         | Commit, push, and open a PR in one step                  |
| `git-worktree`               | Manage Git worktrees for parallel development            |
| `resolve-pr-feedback`        | Resolve PR review feedback by evaluating and fixing in parallel |
| `standup-skill`              | Generate a summary of work from the previous workday     |

### Task Management

| Skill              | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `todo-create`      | Create durable work items and track findings across sessions   |
| `todo-resolve`     | Batch-resolve approved todos after code review or triage       |
| `todo-triage`      | Review pending todos for approval and prioritization           |

### Compound Engineering

| Skill                  | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `ce-brainstorm`        | Explore requirements through collaborative dialogue            |
| `ce-compound`          | Document solved problems to compound team knowledge            |
| `ce-compound-refresh`  | Refresh stale learnings and pattern docs against current codebase |
| `ce-debug`             | Systematic debugging with anti-patterns and investigation techniques |
| `ce-demo-reel`         | Capture demo reels via terminal / screenshot / browser pipelines |
| `ce-grill`             | Stress-test a plan or design through interview-style questions |
| `ce-ideate`            | Generate and evaluate grounded improvement ideas for a project |
| `ce-optimize`          | Auto-research loop for tuning prompts and evaluating solutions |
| `ce-plan`              | Transform requirements into structured implementation plans    |
| `ce-polish-beta`       | Human-in-the-loop polish phase between /ce:review and merge    |
| `ce-pr-description`    | Focused skill for generating high-quality PR descriptions      |
| `ce-release-notes`     | Browse plugin release history                                  |
| `ce-review`            | Structured code review with tiered persona agents              |
| `ce-sessions`          | Cross-platform session history analysis                        |
| `ce-setup`             | Unified setup skill with dependency management                 |
| `ce-slack-research`    | Research organizational context from Slack                     |
| `ce-update`            | Check plugin versions and bump references                      |
| `ce-work`              | Execute work efficiently while maintaining quality             |
| `ce-work-beta`         | Execute work with experimental Codex delegation support        |
| `changelog`            | Create engaging changelogs for recent merges                   |
| `proof`                | Verify claims and results before declaring work done           |

### Autonomous Workflows

| Skill              | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `lfg`              | Full autonomous engineering workflow                     |
| `test-browser`     | Run browser tests on pages affected by current PR        |

### Integrations

| Skill                           | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `linear`                        | Manage issues, projects, and team workflows in Linear          |
| `notion-knowledge-capture`      | Transform conversations into structured Notion pages           |
| `notion-meeting-intelligence`   | Prepare meeting materials by gathering context from Notion     |
| `notion-research-documentation` | Search Notion workspace and create research documentation      |
| `notion-spec-to-implementation` | Turn specs into concrete Notion tasks for implementation       |
| `skills-sh-marketplace`         | Search, discover, and install skills from skills.sh            |

### Image Generation

| Skill             | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `gemini-imagegen` | Generate and edit images using Google's Gemini API       |
| `imagegen`        | Generate or edit images via the OpenAI Image API         |

> **Browser automation:** install the standalone `vercel-labs/agent-browser` plugin — it bundles the CLI alongside its own skill. `test-browser`, `design-iterator`, `design-implementation-reviewer`, and `figma-design-sync` all expect the `agent-browser` CLI to be on your `$PATH`.

## Rules

| Rule                      | Description                       |
| ------------------------- | --------------------------------- |
| `agent-orchestration.md`  | Rules for multi-agent coordination|
| `git-commits.md`          | Git commit conventions            |

## Key Files

- **`AGENTS.md`** -- Global agent instructions: code style, workflow orchestration, task management, QMD prior-art search, and core principles

## License

MIT
