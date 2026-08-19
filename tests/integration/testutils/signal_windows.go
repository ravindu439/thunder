//go:build windows

// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package testutils

import "os"

// sendStopSignal kills the process on Windows.
// Windows does not support sending signals (SIGTERM/SIGINT) to other processes
// via Process.Signal(). The only reliable approach is Process.Kill().
func sendStopSignal(process *os.Process) error {
	return process.Kill()
}

// isProcessAlive always returns true on Windows.
// os.FindProcess opens an HANDLE via OpenProcess; the kernel will not recycle the
// PID while any handle to the process object remains open, so a post-sleep Kill
// will always target the original process.
func isProcessAlive(_ *os.Process) bool {
	return true
}
