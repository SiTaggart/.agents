---
name: reproduce-bug
description: Reproduce and investigate a bug using logs and console inspection
argument-hint: "[GitHub issue number]"
disable-model-invocation: true
---

Look at github issue #$ARGUMENTS and read the issue description and comments.

**Search QMD for prior investigations:** Before launching agents, search for prior work on this area:
- `mcp__qmd__vector_search` with the issue title and affected module against the `ai` collection
- Look for: prior bug investigations, root cause analyses, and related design docs
- If prior investigations exist, use their findings to guide the reproduction — the root cause may already be documented
- For subagents without MCP: `qmd query "issue description"` via Bash

Then, run the following agents in parallel to reproduce the bug:

1. Task rails-console-explorer(issue_description)
2. Task appsignal-log-investigator (issue_description)

Then think about the places it could go wrong looking at the codebase. Look for loggin output we can look for.

Then, run the following agents in parallel again to find any logs that could help us reproduce the bug.

1. Task rails-console-explorer(issue_description)
2. Task appsignal-log-investigator (issue_description)

Keep running these agents until you have a good idea of what is going on.

**Reference Collection:**

- [ ] Document all research findings with specific file paths (e.g., `app/services/example_service.rb:42`)

Then, add a comment to the issue with the findings and how to reproduce the bug.
