//go:build !windows

// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package testutils

import (
	"os"
	"syscall"
)

// sendStopSignal sends SIGTERM to the process for graceful shutdown on Unix.
func sendStopSignal(process *os.Process) error {
	return process.Signal(syscall.SIGTERM)
}

// isProcessAlive reports whether the process identified by proc is still running.
// On Unix the null signal (signal 0) is used: syscall.Kill returns ESRCH when the
// PID no longer exists, which also protects against accidentally killing a recycled
// PID after a grace-period sleep.
func isProcessAlive(proc *os.Process) bool {
	return proc.Signal(syscall.Signal(0)) == nil
}
