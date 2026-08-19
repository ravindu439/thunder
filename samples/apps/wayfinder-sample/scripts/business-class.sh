#!/bin/bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail
# Demo script: lock or unlock Business class flight availability.
#
# Usage:
#   ./business-class.sh lock    — make all Business class flights unavailable (forces CIBA approval)
#   ./business-class.sh unlock  — make all Business class flights available again
#
# To trigger the upgrade scheduler after approving a CIBA notification, run trigger-upgrade.sh separately.

BACKEND_URL="${WAYFINDER_BACKEND_URL:-http://localhost:8787}"

ACTION="${1:-}"

case "$ACTION" in
  lock)
    echo "Locking Business class flights..."
    curl -fsS -X POST "${BACKEND_URL}/api/demo/lock-business-class" \
      -H "Content-Type: application/json" | jq .
    ;;
  unlock)
    echo "Unlocking Business class flights..."
    curl -fsS -X POST "${BACKEND_URL}/api/demo/unlock-business-class" \
      -H "Content-Type: application/json" | jq .
    ;;
  *)
    echo "Usage: $0 {lock|unlock}"
    exit 1
    ;;
esac
