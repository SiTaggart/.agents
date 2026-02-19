#!/bin/bash
# Runs cm reflect with flock to prevent concurrent executions.
# If another reflect is already running, this invocation silently exits.

LOCKFILE="/tmp/cm-reflect.lock"

exec 200>"$LOCKFILE"
flock -n 200 || exit 0

cm reflect --days 1 --json >> /tmp/cm-hooks.log 2>&1
