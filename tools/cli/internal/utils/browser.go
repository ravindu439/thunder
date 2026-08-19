// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Package utils provides shared utility helpers for the CLI.
package utils

import (
	"fmt"
	"os/exec"
	"runtime"
)

// OpenBrowser opens url in the system's default browser.
func OpenBrowser(url string) error {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		cmd = exec.Command("open", url)
	case "linux":
		cmd = exec.Command("xdg-open", url)
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	default:
		return fmt.Errorf("unsupported platform: %s", runtime.GOOS)
	}
	return cmd.Start()
}
