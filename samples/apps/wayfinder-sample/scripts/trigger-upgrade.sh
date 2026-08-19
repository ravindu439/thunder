#!/bin/bash
# Copyright 2026 The ThunderID Authors
# SPDX-License-Identifier: Apache-2.0

set -euo pipefail
# Demo script: triggers one CIBA upgrade cycle on the agent without touching flight availability.
# Use this instead of enabling UPGRADE_SCHEDULER_ENABLED when you want to drive the upgrade
# flow manually step by step.

AGENT_URL="${WAYFINDER_AGENT_URL:-http://localhost:8790}"

echo "Triggering upgrade processing on the agent..."
curl -fsS -X POST "${AGENT_URL}/api/demo/process-upgrades" \
  -H "Content-Type: application/json" | jq .
