#!/bin/bash
#
# Prevents Claude from committing directly to main/master branch.
# Blocks git commit, merge, rebase, and cherry-pick operations.
#

# Read JSON input from stdin
input=$(cat)

# Extract the command from tool_input using jq
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Exit early if no command or jq failed
if [ -z "$command" ]; then
  exit 0
fi

# Check if this is a git operation that creates commits
if echo "$command" | grep -qE '\bgit\s+(commit|merge|rebase|cherry-pick)'; then
  # Get current branch
  current_branch=$(git branch --show-current 2>/dev/null)

  if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo "Blocked: Cannot commit directly to '$current_branch' branch. Create a feature branch first using 'git checkout -b <branch-name>'." >&2
    exit 2
  fi
fi

exit 0
