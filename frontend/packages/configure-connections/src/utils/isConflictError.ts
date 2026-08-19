// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Whether an error is an HTTP 409 Conflict (a duplicate connection name).
 * These are surfaced inline next to the name field rather than as a toast.
 */
export default function isConflictError(error: unknown): boolean {
  return (error as {response?: {status?: number}})?.response?.status === 409;
}
