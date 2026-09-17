#!/usr/bin/env bash
# trace:exempt reason=shell-adapter
# TraceLayer hook adapter for Pi (earendil-works/pi).
# Usage: trace-hook.sh <event> [pi]
# Reads the Pi hook JSON payload from stdin, runs the deterministic trace
# hook, and emits the Pi permission contract on stdout.
set -uo pipefail

EVENT="${1:-}"
[ -n "$EVENT" ] || { echo "usage: $0 <event> [pi]" >&2; exit 2; }

PAYLOAD="$(cat 2>/dev/null || true)"
if [ -z "$PAYLOAD" ] && [ -n "${CLAUDE_TOOL_INPUT:-}" ]; then
  PAYLOAD="$CLAUDE_TOOL_INPUT"
fi

# Normalize harness payload: derive `path` for edit/write tools and pin the
# session id so block-once state is stable across tool calls.
PAYLOAD="$(
  python3 - "$PAYLOAD" <<'PY'
import json, os, sys
raw = sys.argv[1]
if not raw:
    raw = "{}"
d = json.loads(raw)
if d.get("hook_event_name") in ("PreToolUse", "PostToolUse") and "path" not in d:
    ti = d.get("tool_input") or {}
    for key in ("path", "file_path", "filePath"):
        if ti.get(key):
            d["path"] = ti[key]
            break
    if "path" not in d:
        files = os.environ.get("CLAUDE_FILE_PATHS", "").split()
        if files:
            d["path"] = files[0]
d.setdefault("session_id", os.environ.get("TRACE_SESSION", "default"))
print(json.dumps(d))
PY
)"

ERRFILE="$(mktemp)"
trap 'rm -f "$ERRFILE"' EXIT

if command -v trace >/dev/null 2>&1; then
  OUT="$(printf '%s' "$PAYLOAD" | trace hook "$EVENT" --format json 2>"$ERRFILE")"
else
  OUT="$(printf '%s' "$PAYLOAD" | uv run trace hook "$EVENT" --format json 2>"$ERRFILE")"
fi
RC=$?

# Fail CLOSED on anything that is not a clean allow (0) or a policy deny (1).
# trace exits 2 on config error, 3 when the index is unavailable and 4 on an
# evidence parse failure; treating those as "allowed" meant a missing or
# broken `trace` silently disabled enforcement for every edit. The stderr is
# surfaced rather than swallowed so the cause is visible.
if [ "$RC" -ne 0 ] && [ "$RC" -ne 1 ]; then
  DETAIL="$(head -c 500 "$ERRFILE" 2>/dev/null)"
  [ -n "$DETAIL" ] || DETAIL="trace hook exited $RC with no diagnostic output"
  REASON_JSON="$(python3 -c 'import json,sys; print(json.dumps("trace enforcement unavailable (exit "+sys.argv[1]+"): "+sys.argv[2]))' "$RC" "$DETAIL")"
  printf '{"permissionDecision":"deny","permissionDecisionReason":%s}' "$REASON_JSON"
  exit 0
fi

if [ "$RC" -eq 1 ]; then
  REASON="$(printf '%s' "$OUT" | python3 -c '
import json, sys
try:
    print(json.load(sys.stdin).get("output", "blocked by trace policy"))
except Exception:
    print("blocked by trace policy")
')"
  REASON_JSON="$(python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' <<<"$REASON")"
  printf '{"permissionDecision":"deny","permissionDecisionReason":%s}' "$REASON_JSON"
  exit 0
fi

# Allowed: surface bounded hook output (session-start, prompt-context,
# post-mutation, stop confirmation) to the harness.
printf '%s' "$OUT" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get("output", ""), end="")
except Exception:
    pass'
exit 0
