#!/bin/bash
# Source 1 of 3: the codecov/patch check run.
#
# Codecov reports patch coverage as a check run, and that check run is the
# verdict Codecov gates on. It is not the same measurement as the compare API
# used by source 2: on PR #4404 the check run reported "coverage not affected"
# while the API reported 76.74%, and on PR #4003 the check run failed at 67.32%
# while the API reported 87.75%. Mirroring the check run is therefore the only
# way for this gate to agree with Codecov.
#
# A verdict from Codecov is final: a failure here fails the gate rather than
# falling through to a more lenient source. Only the absence of a verdict
# (Codecov still pending, or never reporting) hands over to source 2.
#
# Environment:
#   HEAD_SHA, GH_TOKEN, GITHUB_REPOSITORY - provided by the composite action
#   GITHUB_OUTPUT, GITHUB_STEP_SUMMARY    - provided by the runner

set -euo pipefail

SOURCE="codecov/patch check run"
SOURCE_LABEL="Codecov's own verdict, read from the codecov/patch check run (primary source)"
CHECK_NAME="codecov/patch"
# filter=latest is the API default, but pinning it keeps a re-run from returning
# a superseded check run for the same commit.
POLL_ATTEMPTS=10
POLL_INTERVAL_SECONDS=30

echo "resolved=false" >> "$GITHUB_OUTPUT"

for attempt in $(seq 1 "$POLL_ATTEMPTS"); do
  RUN=$(gh api "repos/${GITHUB_REPOSITORY}/commits/${HEAD_SHA}/check-runs?check_name=${CHECK_NAME}&filter=latest&per_page=1" 2>/dev/null) || RUN=""
  STATUS=$(printf '%s' "$RUN" | jq -r '.check_runs[0].status // empty' 2>/dev/null) || STATUS=""

  if [ "$STATUS" = "completed" ]; then
    CONCLUSION=$(printf '%s' "$RUN" | jq -r '.check_runs[0].conclusion // empty' 2>/dev/null) || CONCLUSION=""
    TITLE=$(printf '%s' "$RUN" | jq -r '.check_runs[0].output.title // empty' 2>/dev/null) || TITLE=""
    case "$CONCLUSION" in
      success|neutral|skipped)
        echo "resolved=true" >> "$GITHUB_OUTPUT"
        echo "✅ Patch coverage passed. Source: ${SOURCE_LABEL}. ${TITLE:-$CONCLUSION}" | tee -a "$GITHUB_STEP_SUMMARY"
        exit 0
        ;;
      failure|timed_out|action_required)
        echo "resolved=true" >> "$GITHUB_OUTPUT"
        echo "❌ Patch coverage failed. Source: ${SOURCE_LABEL}. ${TITLE:-$CONCLUSION}" | tee -a "$GITHUB_STEP_SUMMARY"
        exit 1
        ;;
      *)
        # cancelled or stale: Codecov reported no verdict to mirror.
        echo "⚠️ ${SOURCE} reported '${CONCLUSION:-unknown}' and carries no verdict; trying the Codecov compare API." | tee -a "$GITHUB_STEP_SUMMARY"
        exit 0
        ;;
    esac
  fi

  echo "${SOURCE} has not reported yet (attempt ${attempt}/${POLL_ATTEMPTS}); retrying in ${POLL_INTERVAL_SECONDS}s..."
  sleep "$POLL_INTERVAL_SECONDS"
done

echo "⚠️ ${SOURCE} did not report after ${POLL_ATTEMPTS} attempts; trying the Codecov compare API." | tee -a "$GITHUB_STEP_SUMMARY"
