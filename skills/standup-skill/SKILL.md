---
name: daily-work-summary
description: Generate a summary of work from the previous workday. Collects git commits across all branches from local repositories and GitHub activity (issues, PRs, reviews) via gh CLI. Use when the user asks "what did I do yesterday", "summarize my work", "daily standup summary", or similar requests for a work recap.
---

# Daily Work Summary

Generate a markdown summary of git commits, GitHub activity, and Notion activity for the previous workday.

## Behavior

- **Monday**: Reports Friday's activity (skips weekend)
- **Tuesday-Friday**: Reports yesterday's activity

## Execution Steps

### Step 1: Run the Python script with JSON output

```bash
python3 scripts/daily_summary.py --paths ~/dev --format json
```

### Step 2: Summarize the commits

For each commit in the JSON output:
1. Read the `diff` field which contains the actual code changes
2. Write a 1-2 sentence summary of what the commit actually does (not just repeating the commit message)
3. Focus on the functional change: what was added, fixed, or modified

Format the output as:
```
## Git Commits

### {repo_name}
- `{hash}` **{commit_message}** - {your 1-2 sentence summary of the diff}
```

### Step 3: Include GitHub activity

Include the GitHub sections (PRs reviewed, review requests, comments) from the JSON output.

### Step 4: Query Notion for activity (if Notion MCP tools are available)

After processing git/GitHub data, use the Notion MCP tools to find pages created or edited on the target date:

1. Use `Notion:notion-search` to search for recently modified pages
2. Look for pages with "meeting" or "notes" in the title for meeting notes
3. Include any relevant Notion activity in the summary under a "## Notion Activity" section

## Options

| Flag | Purpose |
|------|---------|
| `--paths PATH [PATH ...]` | Directories to search for git repos. Default: `~/Projects ~/Code ~/repos ~/dev .` |
| `--author PATTERN` | Filter commits by author email or name. Default: current git user |
| `--all-authors` | Show commits from all authors, not just your own |
| `--format markdown\|json` | Output format. Default: markdown |
| `--skip-github` | Skip GitHub API calls |
| `--depth N` | Maximum directory depth to search for git repos. Default: 3 |

## Examples

```bash
# Default search paths
python3 scripts/daily_summary.py

# Specific project directory
python3 scripts/daily_summary.py --paths ~/work/termpower

# Filter to your commits only
python3 scripts/daily_summary.py --author "simon@"

# JSON output for further processing
python3 scripts/daily_summary.py --format json

# Search deeper for nested repos
python3 scripts/daily_summary.py --depth 4
```

## Requirements

- **git**: For local commit history
- **gh CLI**: For GitHub activity (optional). Install: `brew install gh` then `gh auth login`
- **Notion MCP**: For Notion activity (optional). If not configured, skip Notion section.

If gh is not installed or authenticated, GitHub sections show a warning but git commits still work.

## Output Sections

1. **Branches Worked On**: Branches that had commits on the target date
2. **Git Commits**: Grouped by repository, shows hash, message, and branch refs
3. **GitHub Activity**: Issues created/commented, PRs created/merged/reviewed, review requests, PR comments
4. **Notion Activity**: Pages created/edited, meeting notes (if Notion MCP available)

## Customization

Modify `--paths` to match your directory structure. The script searches up to `--depth` levels deep from each path (default: 3).
