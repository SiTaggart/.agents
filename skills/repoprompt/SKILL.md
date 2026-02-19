---
name: repoprompt
description: Use RepoPrompt CLI for token-efficient codebase exploration
allowed-tools: [Bash, Read]
---

# RepoPrompt Skill

## When to Use

- **Deep codebase understanding** — use `builder` (context_builder) as your primary tool
- **Explore codebase structure** (tree, codemaps)
- **Search code** with context lines
- **Get code signatures** without full file content (token-efficient)
- **Read file slices** (specific line ranges)

## Context Builder — Use This First

`builder` (the CLI equivalent of the `context_builder` MCP tool) is the most powerful exploration tool. It's a two-stage AI system: a research model explores and selects relevant files, then an analysis model provides deep insights from curated context.

**Use `builder` instead of manual exploration for any non-trivial task.**

```bash
# Understand a system
rp-cli -e 'builder "understand how authentication works" --response-type question'

# Plan changes
rp-cli -e 'builder "plan refactoring of the API layer" --response-type plan'

# Review changes
rp-cli -e 'builder "review recent changes to auth module" --response-type review'
```

Follow up in the same context with `chat` (pass `-t <tab_id>` from builder response):
```bash
rp-cli -t '<tab_id>' -e 'chat "How does X connect to Y?" --mode plan'
```

## Token Optimization

RepoPrompt is **more token-efficient** than raw file reads:

- `builder` → AI-curated file selection within token budget
- `structure` → signatures only (not full content)
- `read --start-line --limit` → slices instead of full files
- `search --context-lines` → relevant matches with context

## CLI Usage

```bash
# If installed to PATH (Settings → MCP Server → Install CLI to PATH)
rp-cli -e 'command'

# Or use the alias (configure in your shell)
repoprompt_cli -e 'command'
```

## Commands Reference

### File Tree

```bash
# Full tree
rp-cli -e 'tree'

# Folders only
rp-cli -e 'tree --mode folders'

# Selected files only
rp-cli -e 'tree --mode selected'
```

### Code Structure (Codemaps) - TOKEN EFFICIENT

```bash
# Structure of specific paths
rp-cli -e 'structure src/auth/'

# Structure of selected files
rp-cli -e 'structure --scope selected'

# Limit results
rp-cli -e 'structure src/ --max-results 10'
```

### Search

```bash
# Basic search
rp-cli -e 'search "pattern"'

# With context lines
rp-cli -e 'search "error" --context-lines 3'

# Filter by extension
rp-cli -e 'search "TODO" --extensions .ts,.tsx'

# Limit results
rp-cli -e 'search "function" --max-results 20'
```

### Read Files - TOKEN EFFICIENT

```bash
# Full file
rp-cli -e 'read path/to/file.ts'

# Line range (slice)
rp-cli -e 'read path/to/file.ts --start-line 50 --limit 30'

# Last N lines (tail)
rp-cli -e 'read path/to/file.ts --start-line -20'
```

### Selection Management

```bash
# Add files to selection
rp-cli -e 'select add src/auth/'

# Set selection (replace)
rp-cli -e 'select set src/api/ src/types/'

# Clear selection
rp-cli -e 'select clear'

# View current selection
rp-cli -e 'select get'
```

### Workspace Context

```bash
# Get full context
rp-cli -e 'context'

# Specific includes
rp-cli -e 'context --include prompt,selection,tree'
```

### Chain Commands

```bash
# Multiple operations
rp-cli -e 'select set src/auth/ && structure --scope selected && context'
```

### Workspaces

```bash
# List workspaces
rp-cli -e 'workspace list'

# List tabs
rp-cli -e 'workspace tabs'

# Switch workspace
rp-cli -e 'workspace switch "ProjectName"'
```

### AI Chat (uses RepoPrompt's models)

```bash
# Send to chat
rp-cli -e 'chat "How does the auth system work?"'

# Plan mode
rp-cli -e 'chat "Design a new feature" --mode plan'
```

### Context Builder (AI-powered file selection)

```bash
# Auto-select relevant files for a task
rp-cli -e 'builder "implement user authentication"'
```

## Workflow Shorthand Flags

```bash
# Quick operations without -e syntax
rp-cli --workspace MyProject --select-set src/ --export-context ~/out.md
rp-cli --chat "How does auth work?"
rp-cli --builder "implement user authentication"
```

## Script Files (.rp)

For repeatable workflows, save commands to a script:

```bash
# daily-export.rp
workspace switch Frontend
select set src/components/
context --all > ~/exports/frontend.md
```

Run with:

```bash
rp-cli --exec-file ~/scripts/daily-export.rp
```

## CLI Flags

| Flag                  | Purpose                       |
| --------------------- | ----------------------------- |
| `-e 'cmd'`            | Execute command(s)            |
| `-w <id>`             | Target window ID              |
| `-q`                  | Quiet mode                    |
| `-d <cmd>`            | Detailed help for command     |
| `--wait-for-server 5` | Wait for connection (scripts) |

## Note

Requires RepoPrompt app running with MCP Server enabled.
