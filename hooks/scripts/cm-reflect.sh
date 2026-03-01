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
CASS_EXIT_CODE=$?

# Reflect on recent sessions
cm reflect --days 3 --max-sessions 30 >> "$LOGFILE" 2>&1
REFLECT_EXIT_CODE=$?

EXIT_CODE=0
if [ "$CASS_EXIT_CODE" -ne 0 ]; then
  EXIT_CODE=$CASS_EXIT_CODE
fi
if [ "$REFLECT_EXIT_CODE" -ne 0 ]; then
  EXIT_CODE=$REFLECT_EXIT_CODE
fi

echo "$(date -Iseconds) [DONE] exit=$EXIT_CODE" >> "$LOGFILE"
echo "---" >> "$LOGFILE"
exit "$EXIT_CODE"
