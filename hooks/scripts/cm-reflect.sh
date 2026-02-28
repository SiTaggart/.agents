#!/bin/bash
# Runs cass index + cm reflect on SessionEnd.
# Uses flock to prevent concurrent executions — silently exits if already running.

LOG_DIR="$HOME/.cass-memory/logs"
mkdir -p "$LOG_DIR"
LOGFILE="$LOG_DIR/reflect-hook.log"
LOCKFILE="$LOG_DIR/reflect.lock"

exec 200>"$LOCKFILE"
flock -n 200 || { echo "$(date -Iseconds) [SKIP] another reflect is running" >> "$LOGFILE"; exit 0; }

echo "$(date -Iseconds) [START] cass index + cm reflect --days 3" >> "$LOGFILE"

# Re-index so cm reflect can discover the session that just ended
cass index >> "$LOGFILE" 2>&1

# Reflect on recent sessions
cm reflect --days 3 --max-sessions 30 >> "$LOGFILE" 2>&1
EXIT_CODE=$?

echo "$(date -Iseconds) [DONE] exit=$EXIT_CODE" >> "$LOGFILE"
echo "---" >> "$LOGFILE"
