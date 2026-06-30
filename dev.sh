#!/usr/bin/env bash
# =============================================================================
# Planviry — Dev Server Deployment Script
# =============================================================================
# Starts the consumer-web Next.js dev server on port 3000 and keeps it running.
# Kills any existing instance first to avoid duplicate processes.
#
# Usage:
#   bash dev.sh         # start in background
#   bash dev.sh fg      # start in foreground
#   bash dev.sh stop    # stop the server
#   bash dev.sh status  # check if running
# =============================================================================

set -e

PROJECT_ROOT="/home/z/my-project"
APP_DIR="$PROJECT_ROOT/apps/consumer-web"
NEXT_BIN="$APP_DIR/node_modules/.bin/next"
PIDFILE="$PROJECT_ROOT/.dev-server.pid"
LOGFILE="$PROJECT_ROOT/dev.log"

# --- Functions --------------------------------------------------------------

stop_server() {
  if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    if kill -0 "$PID" 2>/dev/null; then
      echo "Stopping dev server (PID $PID)..."
      kill "$PID" 2>/dev/null || true
      sleep 2
      kill -9 "$PID" 2>/dev/null || true
    fi
    rm -f "$PIDFILE"
  fi
  # Also kill any orphaned next processes
  pkill -f "next dev" 2>/dev/null || true
  pkill -f "next-server" 2>/dev/null || true
  sleep 1
  echo "Server stopped."
}

start_server() {
  stop_server

  echo "Starting Planviry consumer-web dev server..."
  echo "  App:    $APP_DIR"
  echo "  Port:   3000"
  echo "  Log:    $LOGFILE"

  cd "$APP_DIR"

  # Start with setsid for full process-group detachment so it survives
  # the parent shell exiting. nohup + setsid = persists across sessions.
  setsid nohup "$NEXT_BIN" dev -p 3000 > "$LOGFILE" 2>&1 &
  SERVER_PID=$!
  echo "$SERVER_PID" > "$PIDFILE"

  echo "  PID:    $SERVER_PID"

  # Wait for the server to be ready (max 40 seconds)
  echo -n "  Waiting for server"
  for i in $(seq 1 40); do
    sleep 1
    if ss -tln 2>/dev/null | grep -q ":3000"; then
      echo ""
      echo ""
      echo "✓ Server is LIVE on port 3000"
      echo "  Local:    http://localhost:3000"
      echo "  Network:  http://21.0.10.198:3000"
      echo ""
      echo "  Preview:  Use the Preview Panel on the right side of the interface."
      echo "            Click 'Open in New Tab' for a separate browser window."
      return 0
    fi
    echo -n "."
  done

  echo ""
  echo "✗ Server failed to start within 40 seconds. Check $LOGFILE"
  tail -20 "$LOGFILE"
  return 1
}

status_server() {
  if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    if kill -0 "$PID" 2>/dev/null; then
      echo "✓ Dev server is RUNNING (PID $PID)"
      ss -tln 2>/dev/null | grep -q ":3000" && echo "  Port 3000: LISTENING" || echo "  Port 3000: not listening"
      return 0
    fi
  fi
  echo "✗ Dev server is NOT running"
  return 1
}

# --- Main -------------------------------------------------------------------

case "${1:-start}" in
  start)   start_server ;;
  fg)      cd "$APP_DIR" && exec "$NEXT_BIN" dev -p 3000 2>&1 | tee "$LOGFILE" ;;
  stop)    stop_server ;;
  status)  status_server ;;
  restart) stop_server; start_server ;;
  *) echo "Usage: $0 {start|fg|stop|status|restart}"; exit 1 ;;
esac
