#!/bin/bash
# Policy tests for the backend integration patch-coverage check.
#
# Each case builds a throwaway git repository with known Go files, a known
# integration coverage profile, and a known diff, so the expected verdict is
# arithmetic rather than a guess. The point is to assert policy outcomes — N/A,
# pass, fail, uninstrumented — not merely that the scripts execute.
#
# Requires diff-cover on PATH or in DIFF_COVER_BIN. CI installs the pinned
# version; locally, point DIFF_COVER_BIN at a virtualenv binary.
#
# Usage: DIFF_COVER_BIN=/path/to/diff-cover ./run-tests.sh

set -uo pipefail

ACTION_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPUTE="${ACTION_DIR}/compute-integration-patch-coverage.sh"
GATE_AWK="${ACTION_DIR}/../patch-coverage-gate/go-cover-to-lcov.awk"

PASSED=0
FAILED=0

if [ -z "${DIFF_COVER_BIN:-}" ] && ! command -v diff-cover >/dev/null 2>&1; then
  echo "❌ diff-cover not found. Set DIFF_COVER_BIN or install diff_cover."
  exit 1
fi
export DIFF_COVER_BIN="${DIFF_COVER_BIN:-diff-cover}"

# ---------------------------------------------------------------------------
# Fixture helpers
# ---------------------------------------------------------------------------

# new_repo <dir> — a git repo with one covered backend file committed on main.
new_repo() {
  local dir="$1"
  mkdir -p "$dir"
  cd "$dir" || exit 1
  git init -q -b main .
  git config user.email test@example.com
  git config user.name Test
  git config commit.gpgsign false

  mkdir -p backend/internal/demo
  cat > backend/internal/demo/service.go <<'GO'
package demo

func Existing() int {
	return 1
}
GO
  git add -A
  git commit -q -m base
}

# add_lines <file> <count> — appends a function whose body has <count> lines.
add_func() {
  local file="$1" name="$2" lines="$3"
  {
    echo ""
    echo "func ${name}() int {"
    echo -e "\tx := 0"
    for ((i = 1; i < lines; i++)); do
      echo -e "\tx++"
    done
    echo -e "\treturn x"
    echo "}"
  } >> "$file"
}

# profile <database> <lines...> — writes a Go cover profile marking the given
# "start end hits" triples for backend/internal/demo/service.go.
profile() {
  local database="$1"; shift
  local dir="coverage-artifacts/integration-coverage-${database}"
  mkdir -p "$dir"
  local out="${dir}/coverage_integration.out"
  echo "mode: set" > "$out"
  while [ "$#" -gt 0 ]; do
    local start="$1" end="$2" hits="$3"; shift 3
    echo "github.com/thunder-id/thunderid/internal/demo/service.go:${start}.1,${end}.2 1 ${hits}" >> "$out"
  done
}

run_case() {
  local name="$1" expected_status="$2" expected_text="$3"
  local out status
  out=$(BASE_REF=main FAIL_UNDER=70 GITHUB_STEP_SUMMARY=/dev/null \
    bash "$COMPUTE" 2>&1)
  status=$?

  local ok=1
  [ "$status" -eq "$expected_status" ] || ok=0
  if [ -n "$expected_text" ] && ! grep -qF "$expected_text" <<<"$out"; then
    ok=0
  fi

  if [ "$ok" -eq 1 ]; then
    echo "  ✅ $name"
    PASSED=$((PASSED + 1))
  else
    echo "  ❌ $name (exit=$status expected=$expected_status)"
    echo "$out" | sed 's/^/       /' | head -20
    FAILED=$((FAILED + 1))
  fi
}

# No EXIT trap and no subshells around the cases: an EXIT trap fires on every
# subshell exit, which would delete the fixtures after the first case, and
# counters incremented inside a subshell never reach this shell.
TMPROOT=$(mktemp -d)

echo "Backend integration patch coverage — policy tests"

# ---------------------------------------------------------------------------
# 1. No backend production Go in the diff → N/A success
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/na"
  git checkout -q -b feature
  mkdir -p tests/integration/foo
  echo "package foo" > tests/integration/foo/foo_test.go
  git add -A && git commit -q -m "tests only"
  profile sqlite 3 5 1
  run_case "test-only diff reports N/A and passes" 0 "N/A — no backend production Go changes"

# ---------------------------------------------------------------------------
# 2. Fully covered backend change → pass
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/pass"
  git checkout -q -b feature
  add_func backend/internal/demo/service.go Added 6
  git add -A && git commit -q -m "add covered function"
  total=$(wc -l < backend/internal/demo/service.go | tr -d " ")
  profile sqlite 6 "$total" 1
  run_case "covered backend change passes" 0 "**Passed**"

# ---------------------------------------------------------------------------
# 3. Uncovered backend change → fail
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/fail"
  git checkout -q -b feature
  add_func backend/internal/demo/service.go Added 12
  git add -A && git commit -q -m "add uncovered function"
  total=$(wc -l < backend/internal/demo/service.go | tr -d " ")
  profile sqlite 6 "$total" 0
  run_case "uncovered backend change fails" 1 "**Failed**"

# ---------------------------------------------------------------------------
# 4. Union across databases: covered in one run only → still covered
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/union"
  git checkout -q -b feature
  add_func backend/internal/demo/service.go Added 6
  git add -A && git commit -q -m "add function covered only on postgres"
  total=$(wc -l < backend/internal/demo/service.go | tr -d " ")
  profile sqlite 6 "$total" 0
  profile postgres 6 "$total" 1
  run_case "coverage from a single database counts (union)" 0 "**Passed**"

# ---------------------------------------------------------------------------
# 5. Unit coverage must not lift the result
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/unit"
  git checkout -q -b feature
  add_func backend/internal/demo/service.go Added 12
  git add -A && git commit -q -m "add function covered only by unit tests"
  total=$(wc -l < backend/internal/demo/service.go | tr -d " ")
  profile sqlite 6 "$total" 0
  # A unit profile that fully covers the same lines, sitting in the same tree.
  mkdir -p coverage-artifacts/unit-coverage
  echo "mode: set" > coverage-artifacts/unit-coverage/coverage_unit.out
  echo "github.com/thunder-id/thunderid/internal/demo/service.go:6.1,${total}.2 1 1" \
    >> coverage-artifacts/unit-coverage/coverage_unit.out
  run_case "unit coverage cannot lift the integration result" 1 "**Failed**"

# ---------------------------------------------------------------------------
# 6. Changed file with functions but absent from every profile → fail loudly
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/uninstrumented"
  git checkout -q -b feature
  mkdir -p backend/internal/orphan
  cat > backend/internal/orphan/orphan.go <<'GO'
package orphan

func Unlinked() int {
	return 42
}
GO
  git add -A && git commit -q -m "add unlinked package"
  profile sqlite 3 5 1
  run_case "uninstrumented changed file fails instead of being dropped" 1 "uninstrumented or unlinked changed file"

# ---------------------------------------------------------------------------
# 7. Declaration-only changed file absent from profiles → not a failure
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/declonly"
  git checkout -q -b feature
  mkdir -p backend/internal/generated
  {
    echo "package generated"
    echo ""
    echo "var messages = map[string]string{"
    echo '	"a": "b",'
    echo "}"
  } > backend/internal/generated/defaults.go
  git add -A && git commit -q -m "add declaration-only file"
  profile sqlite 3 5 1
  run_case "declaration-only file is not reported as uninstrumented" 0 ""

# ---------------------------------------------------------------------------
# 8. Backend change with no coverage artifacts at all → fail
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/noartifacts"
  git checkout -q -b feature
  add_func backend/internal/demo/service.go Added 6
  git add -A && git commit -q -m "add function, no artifacts produced"
  run_case "missing coverage artifacts fail rather than pass" 1 "did not reach this job"

# ---------------------------------------------------------------------------
# 9. An artifact that arrived empty or unparseable must say so, not die silently
# ---------------------------------------------------------------------------
  new_repo "$TMPROOT/emptyprofile"
  git checkout -q -b feature
  add_func backend/internal/demo/service.go Added 6
  git add -A && git commit -q -m "add function, profile is garbage"
  mkdir -p coverage-artifacts/integration-coverage-sqlite
  printf 'mode: set\nnot a cover profile line\n' \
    > coverage-artifacts/integration-coverage-sqlite/coverage_integration.out
  run_case "unparseable profile reports why instead of exiting silently" 1 "no usable source records"

echo
rm -rf "$TMPROOT"
echo "passed: $PASSED  failed: $FAILED"
[ "$FAILED" -eq 0 ]
