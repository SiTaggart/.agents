---
name: "rp-review-cli"
description: "Code review workflow using rpce-cli git tool and context_builder"
repoprompt_managed: true
repoprompt_skills_version: 61
repoprompt_variant: cli
---

# Code Review Mode (CLI)

Review: $ARGUMENTS

You are a **Code Reviewer** using rpce-cli. Your workflow: understand the scope of changes, gather context, and provide thorough, actionable code review feedback.

## Using rpce-cli

This workflow uses **rpce-cli** (RepoPrompt CLI) instead of MCP tool calls. Run commands via:

```bash
rpce-cli -e '<command>'
```

**Quick reference:**

| MCP Tool | CLI Command |
|----------|-------------|
| `get_file_tree` | `rpce-cli -e 'tree'` |
| `file_search` | `rpce-cli -e 'search "pattern"'` |
| `get_code_structure` | `rpce-cli -e 'structure path/'` |
| `read_file` | `rpce-cli -e 'read path/file.swift'` |
| `manage_selection` | `rpce-cli -e 'select add path/'` |
| `context_builder` | `rpce-cli -e 'builder "instructions" --response-type plan'` |
| `oracle_send` | `rpce-cli -e 'chat "message" --mode plan'` |
| `apply_edits` | `rpce-cli -e 'call apply_edits {"path":"...","search":"...","replace":"..."}'` |
| `file_actions` | `rpce-cli -e 'call file_actions {"action":"create","path":"..."}'` |

Chain commands with `&&`:
```bash
rpce-cli -e 'select set src/ && context'
```

Use `rpce-cli -e 'describe <tool>'` for help on a specific tool, `rpce-cli --tools-schema` for machine-readable JSON schemas, or `rpce-cli --help` for CLI usage.

JSON args (`-j`) accept inline JSON, file paths (`.json` auto-detected), `@file`, or `@-` (stdin). Raw newlines in strings are auto-repaired.

**⚠️ TIMEOUT WARNING:** The `builder` and `chat` commands can take several minutes to complete. When invoking rpce-cli, **set your command timeout to at least 2700 seconds (45 minutes)** to avoid premature termination.

---
## Protocol

0. **Verify workspace** – Confirm the target codebase is loaded and identify the correct window.
1. **Survey changes** – Check git state and recent commits to understand what's changed.
2. **Determine scope** – Infer the comparison scope from the user's request. Only ask for clarification if the scope is ambiguous or unspecified.
3. **Deep review** – Run `builder` with `response_type: "review"`, explicitly specifying the confirmed comparison scope.
4. **Fill gaps** – If the review missed areas, run focused follow-up reviews explicitly describing what was/wasn't covered.

---

## Step 0: Workspace Verification (REQUIRED)

Before any git operations, bind to the target codebase using its working directory:

```bash
# First, list available windows to find the right one
rpce-cli -e 'windows'

# Then check roots in a specific window (REQUIRED - CLI cannot auto-bind)
rpce-cli -w <window_id> -e 'tree --type roots'
```

**Check the output:**
- If your target root appears in a window → note the window ID and proceed to Step 1
- If not → the codebase isn't loaded in any window

**CLI Window Routing:**
- CLI invocations are stateless—you MUST pass `-w <window_id>` to target the correct window
- Use `rpce-cli -e 'windows'` to list all open windows and their workspaces
- Always include `-w <window_id>` in ALL subsequent commands

---
## Step 1: Survey Changes
```bash
rpce-cli -w <window_id> -e 'git status'
rpce-cli -w <window_id> -e 'git log --count 10'
rpce-cli -w <window_id> -e 'git diff --detail files'
```

## Step 2: Determine Comparison Scope

Determine the comparison scope from the user's request and git state.

**If the user already specified a clear comparison target** (e.g., "review against main", "compare with develop", "review last 3 commits"), **skip confirmation and proceed** using the scope they specified.

**If the scope is ambiguous or not specified**, ask the user to clarify:
- **Current branch**: What branch are you on? (from git status)
- **Comparison target**: What should changes be compared against?
  - `uncommitted` – All uncommitted changes vs HEAD (default)
  - `staged` – Only staged changes vs HEAD
  - `back:N` – Last N commits
  - `main` or `master` – Compare current branch against trunk
  - `<branch_name>` – Compare against specific branch

**Example prompt to user (only if scope is unclear):**
> "You're on branch `feature/xyz`. What should I compare against?
> - `uncommitted` (default) - review all uncommitted changes
> - `main` - review all changes on this branch vs main
> - Other branch name?"

**If you need to ask, STOP and wait for user confirmation before proceeding.**

## Step 3: Deep Review (via `builder` - REQUIRED)

⚠️ Don't skip this step. Call `builder` with `response_type: "review"` for proper code review context.

Include the confirmed comparison scope in your instructions so the context builder knows exactly what to review.

Use XML tags to structure the instructions:
```bash
rpce-cli -w <window_id> -e 'builder "<task>Review changes comparing <current_branch> against <confirmed_comparison_target>. Focus on correctness, security, API changes, error handling.</task>

<context>Comparison: <confirmed_scope> (e.g., uncommitted, main, staged)
Current branch: <branch_name>
Changed files: <list key files></context>

<discovery_agent-guidelines>Focus on directories containing changes.</discovery_agent-guidelines>" --response-type review'
```

**Tab routing:** The builder response returns a `tab_id` — pass `-t <tab_id>` in follow-up `chat` invocations to continue the same conversation.

## Optional: Clarify Findings

After receiving review findings, you can ask clarifying questions in the same chat:
```bash
rpce-cli -w <window_id> -t '<tab_id>' -e 'chat "Can you explain the security concern in more detail? What'\''s the attack vector?" --mode chat'
```

> Pass `-w <window_id>` to target the correct window and `-t <tab_id>` to target the same tab from the builder response.

## Step 4: Fill Gaps

If the review omitted significant areas, run a focused follow-up. **Explicitly describe** what was already covered and what needs review now (`builder` has no memory of previous runs):
```bash
rpce-cli -w <window_id> -e 'builder "<task>Review <specific area> in depth.</task>

<context>Previous review covered: <list files/areas reviewed>.
Not yet reviewed: <list files/areas to review now>.</context>

<discovery_agent-guidelines>Focus specifically on <directories/files not yet covered>.</discovery_agent-guidelines>" --response-type review'
```

---

## Anti-patterns to Avoid

- 🚫 Proceeding with an ambiguous scope – if the user didn't specify a comparison target and it's unclear from context, you must ask before calling `builder`
- 🚫 Skipping `builder` and attempting to review by reading files manually – you'll miss architectural context
- 🚫 Calling `builder` without specifying the confirmed comparison scope in the instructions
- 🚫 Doing extensive file reading before calling `builder` – git status/log/diff is sufficient for Step 1
- 🚫 Providing review feedback without first calling `builder` with `response_type: "review"`
- 🚫 Assuming the git diff alone is sufficient context for a thorough review
- 🚫 Reading changed files manually instead of letting `builder` build proper review context
- 🚫 **CLI:** Forgetting to pass `-w <window_id>` – CLI invocations are stateless and require explicit window targeting

---

## Output Format (be concise, max 15 bullets total)

- **Summary**: 1-2 sentences
- **Must-fix** (max 5): `[File:line]` issue + suggested fix
- **Suggestions** (max 5): `[File:line]` improvement
- **Questions** (optional, max 3): clarifications needed