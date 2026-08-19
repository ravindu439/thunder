#!/bin/bash
# Reads the patch coverage threshold and the ignored paths from codecov.yml so
# the gate enforces exactly what Codecov is configured to enforce. Keeping the
# numbers in one place means the gate and codecov/patch cannot drift apart when
# either is retuned.
#
# Codecov passes a patch status when coverage is at least target minus
# threshold, so that difference is the diff-cover --fail-under value.
#
# Environment:
#   CODECOV_CONFIG          - path to codecov.yml (defaults to ./codecov.yml)
#   GITHUB_ENV, RUNNER_TEMP - provided by the runner
#
# Exports for the later steps:
#   FAIL_UNDER              - target minus threshold
#   CODECOV_IGNORE_FILE     - the ignore list, normalised for fnmatch
#   CODECOV_FLAG_PATHS_FILE - every path covered by a coverage flag
# The two lists go to files rather than variables so the globs are never subject
# to shell word splitting or filename expansion.

set -euo pipefail

CONFIG="${CODECOV_CONFIG:-codecov.yml}"
IGNORE_FILE="${RUNNER_TEMP:-/tmp}/codecov-ignore.txt"
FLAG_PATHS_FILE="${RUNNER_TEMP:-/tmp}/codecov-flag-paths.txt"

if [ ! -f "$CONFIG" ]; then
  echo "❌ $CONFIG not found; cannot determine the patch coverage threshold."
  exit 1
fi

# yq is present on GitHub-hosted runners; fall back to PyYAML so the gate does
# not depend on a single tool being preinstalled.
if command -v yq >/dev/null 2>&1; then
  TARGET=$(yq eval -r '.coverage.status.patch.default.target // ""' "$CONFIG")
  THRESHOLD=$(yq eval -r '.coverage.status.patch.default.threshold // "0"' "$CONFIG")
  yq eval -r '.ignore[]?' "$CONFIG" > "$IGNORE_FILE"
  # Every path any coverage flag covers, deduplicated: this is the repository's
  # own declaration of which trees report coverage.
  yq eval -r '[.flags[]?.paths[]?] | unique | .[]' "$CONFIG" > "$FLAG_PATHS_FILE"
else
  eval "$(python3 - "$CONFIG" "$IGNORE_FILE" "$FLAG_PATHS_FILE" <<'PY'
import sys, yaml
cfg = yaml.safe_load(open(sys.argv[1])) or {}
patch = ((((cfg.get('coverage') or {}).get('status') or {}).get('patch') or {}).get('default')) or {}
threshold = patch.get('threshold')
print("TARGET=%s" % (patch.get('target') or ''))
print("THRESHOLD=%s" % ('0' if threshold is None else threshold))
with open(sys.argv[2], 'w') as handle:
    for glob in (cfg.get('ignore') or []):
        handle.write("%s\n" % glob)
paths = []
for flag in (cfg.get('flags') or {}).values():
    for path in ((flag or {}).get('paths') or []):
        if path not in paths:
            paths.append(path)
with open(sys.argv[3], 'w') as handle:
    for path in paths:
        handle.write("%s\n" % path)
PY
)"
fi

if [ ! -s "$FLAG_PATHS_FILE" ]; then
  echo "❌ No flags[].paths found in $CONFIG; cannot tell which trees report coverage."
  exit 1
fi

# Both values are written as percentages in codecov.yml (e.g. "80%", "1%").
TARGET="${TARGET%\%}"
THRESHOLD="${THRESHOLD%\%}"

# "auto" compares against the base commit's coverage, which has no fixed
# number to enforce locally. Fail loudly rather than invent a threshold.
if ! printf '%s' "$TARGET" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
  echo "❌ Unsupported coverage.status.patch.default.target in $CONFIG: '${TARGET:-<unset>}'"
  echo "   The gate needs a numeric target (e.g. 80%) to enforce a threshold."
  exit 1
fi
if ! printf '%s' "$THRESHOLD" | grep -qE '^[0-9]+(\.[0-9]+)?$'; then
  echo "❌ Unsupported coverage.status.patch.default.threshold in $CONFIG: '$THRESHOLD'"
  exit 1
fi

# Codecov accepts directory prefixes and regular expressions in `ignore`, while
# diff-cover matches --exclude patterns with fnmatch. Translate the forms that
# have an fnmatch equivalent, and say so loudly for the ones that do not: an
# ignore that fails to apply here makes the local fallback count lines Codecov
# would drop, which shows up as a stricter number rather than a laxer one.
NORMALIZED="${IGNORE_FILE}.normalized"
: > "$NORMALIZED"
while IFS= read -r pattern; do
  [ -n "$pattern" ] || continue
  printf '%s\n' "$pattern" >> "$NORMALIZED"
  case "$pattern" in
    # "backend/" ignores everything beneath it; fnmatch needs the wildcard.
    */) printf '%s**\n' "$pattern" >> "$NORMALIZED" ;;
    # A bare path with no wildcard and no extension is a directory prefix to
    # Codecov. Emitting both forms keeps files of that exact name excluded too.
    *[*?[]*) ;;
    *.*) ;;
    *) printf '%s/**\n' "$pattern" >> "$NORMALIZED" ;;
  esac
  # The class is single-quoted, which strips the glob meaning of its contents,
  # so the leading ^ is a literal member here and not a negation operator.
  case "$pattern" in
    *['^$()|+\']*)
      echo "⚠️ codecov.yml ignores '$pattern', which looks like a regular expression."
      echo "   diff-cover matches with fnmatch, so the local fallback cannot apply it and may report a stricter number than Codecov."
      ;;
  esac
done < "$IGNORE_FILE"
mv "$NORMALIZED" "$IGNORE_FILE"

FAIL_UNDER=$(awk -v t="$TARGET" -v d="$THRESHOLD" 'BEGIN{printf "%g", t - d}')

{
  echo "FAIL_UNDER=$FAIL_UNDER"
  echo "CODECOV_IGNORE_FILE=$IGNORE_FILE"
  echo "CODECOV_FLAG_PATHS_FILE=$FLAG_PATHS_FILE"
} >> "$GITHUB_ENV"

echo "Patch coverage target ${TARGET}% with a ${THRESHOLD}% threshold: requiring ≥ ${FAIL_UNDER}%"
echo "Ignoring $(wc -l < "$IGNORE_FILE" | tr -d ' ') path pattern(s), derived from the ignore list in $CONFIG:"
sed 's/^/  /' "$IGNORE_FILE"
echo "Coverage-reporting paths declared by flags in $CONFIG:"
sed 's/^/  /' "$FLAG_PATHS_FILE"
