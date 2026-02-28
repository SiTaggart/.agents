# .agents

Shared AI agent configuration synced across projects. Contains agents, commands, skills, rules, and hooks that extend AI coding assistants.

## Components

| Component  | Count |
| ---------- | ----- |
| Agents     | 31    |
| Commands   | 19    |
| Skills     | 53    |
| Rules      | 2     |
| Hooks      | 3     |

## Agents

### Review (12)

| Agent                            | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `architecture-strategist`        | Analyze architectural decisions and compliance                  |
| `code-simplicity-reviewer`       | Final pass for simplicity and minimalism                        |
| `data-integrity-guardian`        | Database migrations and data integrity                          |
| `data-migration-expert`          | Validate ID mappings match production, check for swapped values |
| `julik-frontend-races-reviewer`  | Review JavaScript/Stimulus code for race conditions             |
| `kieran-rails-reviewer`          | Rails code review with strict conventions                       |
| `kieran-python-reviewer`         | Python code review with strict conventions                      |
| `kieran-typescript-reviewer`     | TypeScript code review with strict conventions                  |
| `pattern-recognition-specialist` | Analyze code for patterns and anti-patterns                     |
| `performance-oracle`             | Performance analysis and optimization                           |
| `security-sentinel`              | Security audits and vulnerability assessments                   |
| `design-implementation-reviewer` | Verify UI implementations match Figma designs                   |

### Research (5)

| Agent                       | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `best-practices-researcher` | Gather external best practices and examples         |
| `framework-docs-researcher` | Research framework documentation and best practices |
| `git-history-analyzer`      | Analyze git history and code evolution              |
| `repo-research-analyst`     | Research repository structure and conventions       |
| `rp-explorer`               | Token-efficient codebase exploration via RepoPrompt |

### Design (4)

| Agent                            | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `design-iterator`                | Iteratively refine UI through systematic design iterations |
| `figma-design-sync`              | Synchronize web implementations with Figma designs         |
| `frontend-implementation-expert` | Implement frontend code changes in React applications      |
| `ankane-readme-writer`           | Create READMEs following Ankane-style template             |

### Development (5)

| Agent                      | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `codebase-pattern-finder`  | Find similar implementations and patterns in codebase  |
| `debug-specialist`         | Troubleshoot errors, test failures, unexpected behavior|
| `documentation-specialist` | Create, update, and improve documentation              |
| `implementation-architect` | Break down requirements into technical plans           |
| `react-test-architect`     | Design and implement React test strategies             |

### Workflow (5)

| Agent                        | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `bug-reproduction-validator` | Reproduce and validate bug reports                |
| `lint`                       | Run linting and code quality checks               |
| `pr-comment-resolver`        | Address PR comments and implement fixes           |
| `spec-flow-analyzer`         | Analyze user flows and identify gaps in specs     |
| `task-orchestrator`          | Determine optimal delegation across sub-agents    |

## Commands

### Workflow

| Command               | Description                                         |
| --------------------- | --------------------------------------------------- |
| `/brainstorm`         | Explore requirements through collaborative dialogue |
| `/plan`               | Create implementation plans                         |
| `/review`             | Run comprehensive multi-agent code reviews          |
| `/work`               | Execute work items systematically                   |
| `/compound`           | Document solved problems to compound team knowledge |

### Utilities

| Command                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `/changelog`             | Create engaging changelogs for recent merges                 |
| `/create-agent-skill`    | Create or edit Claude Code skills                            |
| `/deepen-plan`           | Enhance plans with parallel research agents                  |
| `/deslop`                | Remove AI-generated code slop from current branch            |
| `/generate_command`      | Generate new slash commands                                  |
| `/heal-skill`            | Fix skill documentation issues                               |
| `/playwright-test`       | Run browser tests on PR-affected pages                       |
| `/report-bug`            | Report a bug                                                 |
| `/reproduce-bug`         | Reproduce bugs using logs and console                        |
| `/resolve_parallel`      | Resolve TODO comments in parallel                            |
| `/resolve_todo_parallel` | Resolve todos in parallel                                    |
| `/set-custom-rules`      | Set custom rules for the project                             |
| `/triage`                | Triage and prioritize issues                                 |
| `/verify-custom-rules`   | Verify custom rules for the project                          |

## Skills

### Architecture and Design

| Skill                          | Description                                            |
| ------------------------------ | ------------------------------------------------------ |
| `agent-native-architecture`    | Build AI agents using prompt-native architecture       |
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
| `create-agent-skills`       | Expert guidance for creating Claude Code skills      |
| `github-search`             | Search GitHub code, repos, issues, and PRs via CLI   |
| `repo-research-analyst`     | Analyze repository structure and patterns            |
| `skill-creator`             | Guide for creating effective skills                  |
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
| `compound-docs`    | Capture solved problems as categorized documentation |
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

### Orchestration

| Skill                  | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| `orchestrating-swarms` | Multi-agent swarm orchestration with TeammateTool and Tasks    |

### Workflow and Git

| Skill                  | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `commit`               | Create git commits with user approval                    |
| `create-pr`            | Create pull requests following conventions               |
| `describe_pr`          | Generate comprehensive PR descriptions                   |
| `file-todos`           | File-based todo tracking system                          |
| `git-worktree`         | Manage Git worktrees for parallel development            |
| `resolve-pr-parallel`  | Resolve all PR comments using parallel processing        |
| `setup`                | Configure review agents per project via interactive setup|
| `standup-skill`        | Generate a summary of work from the previous workday     |

### Integrations

| Skill                           | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `linear`                        | Manage issues, projects, and team workflows in Linear          |
| `notion-knowledge-capture`      | Transform conversations into structured Notion pages           |
| `notion-meeting-intelligence`   | Prepare meeting materials by gathering context from Notion     |
| `notion-research-documentation` | Search Notion workspace and create research documentation      |
| `notion-spec-to-implementation` | Turn specs into concrete Notion tasks for implementation       |
| `skills-sh-marketplace`         | Search, discover, and install skills from skills.sh            |

### Image Generation and Browser

| Skill             | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `agent-browser`   | Browser automation for web testing and interaction       |
| `gemini-imagegen` | Generate and edit images using Google's Gemini API       |
| `imagegen`        | Generate or edit images via the OpenAI Image API         |

## Rules

| Rule                      | Description                       |
| ------------------------- | --------------------------------- |
| `agent-orchestration.md`  | Rules for multi-agent coordination|
| `git-commits.md`          | Git commit conventions            |

## Hooks

| Hook                       | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `cm-reflect.sh`            | Run cass index + cm reflect on session end               |
| `prevent-main-commit.sh`   | Block direct commits to main/master                      |
| `trauma_guard.py`          | Guard against traumatic agent behaviors                  |

## Key Files

- **`AGENTS.md`** — Global agent instructions: code style, workflow orchestration, task management, QMD prior-art search, and core principles

## License

MIT
