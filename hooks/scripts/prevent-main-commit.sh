#!/bin/bash
#
# Prevents coding agents from committing directly to main/master branch.
# Blocks git commit, merge, rebase, and cherry-pick operations.
#

input=$(cat)

if [ -z "$input" ]; then
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Blocked: jq is required to parse hook input for branch protection." >&2
  exit 2
fi

if ! command=$(printf '%s' "$input" | jq -er '.tool_input.command // ""' 2>/dev/null); then
  echo "Blocked: Could not parse hook input for branch protection." >&2
  exit 2
fi

if [ -z "$command" ]; then
  exit 0
fi

if echo "$command" | grep -qE '\bgit\s+(commit|merge|rebase|cherry-pick)'; then
  current_branch=$(git branch --show-current 2>/dev/null)

  if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo "Blocked: Cannot commit directly to '$current_branch' branch. Create a feature branch first using 'git checkout -b <branch-name>'." >&2
    exit 2
  fi
fi

exit 0
