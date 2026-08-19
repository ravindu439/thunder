#!/bin/bash
# Lists the changed files that could contribute lines to patch coverage, so the
# gate can tell a diff worth measuring from one where no source has anything to
# report.
#
# Both halves of the question come from codecov.yml rather than from a list kept
# here: flags[].paths is the repository's own declaration of which trees upload
# coverage, and ignore is what Codecov drops. Deriving them means a new flag or
# a new ignore is picked up automatically instead of silently short-circuiting
# the gate.
#
# Deliberately errs towards listing a file. A path that turns out to carry no
# coverable lines (a README under a covered tree, a test file no provider
# instruments) simply produces "no coverable lines" from whichever source runs,
# which passes. Wrongly omitting a file would pass the gate without measuring
# anything, so the filter stays broad.
#
# Environment:
#   BASE_REF                                        - diff base
#   CODECOV_FLAG_PATHS_FILE, CODECOV_IGNORE_FILE    - from read-codecov-config.sh
#
# Prints one path per line; prints nothing when the diff cannot affect coverage.

set -euo pipefail

for var in CODECOV_FLAG_PATHS_FILE CODECOV_IGNORE_FILE; do
  if [ -z "${!var:-}" ]; then
    echo "❌ $var is not set; read-codecov-config.sh must run before this script." >&2
    exit 1
  fi
done

git diff --name-only "${BASE_REF}...HEAD" \
  | python3 -c '
import fnmatch, os, sys

def load(path):
    with open(path) as handle:
        return [line.strip() for line in handle if line.strip()]

covered = load(os.environ["CODECOV_FLAG_PATHS_FILE"])
ignored = load(os.environ["CODECOV_IGNORE_FILE"])

def matches(path, pattern):
    # Codecov path entries are either a directory prefix or a glob.
    if fnmatch.fnmatch(path, pattern):
        return True
    prefix = pattern if pattern.endswith("/") else pattern + "/"
    return path.startswith(prefix)

for path in (line.strip() for line in sys.stdin):
    if not path:
        continue
    if not any(matches(path, pattern) for pattern in covered):
        continue
    if any(matches(path, pattern) for pattern in ignored):
        continue
    print(path)
'
