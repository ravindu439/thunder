// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package utils_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/thunder-id/thunderid/tools/cli/internal/utils"
)

func TestMeetsMinNodeVersion(t *testing.T) {
	tests := []struct {
		version string
		want    bool
	}{
		{utils.MinNodeVersion, true},
		{"22.23.2", true},
		{"22.24.0", true},
		{"23.0.0", true},
		{"22.23.0", false},
		{"22.22.9", false},
		{"20.11.0", false},
		{"9.0.0", false},
	}
	for _, tt := range tests {
		assert.Equal(t, tt.want, utils.MeetsMinNodeVersion(tt.version), "version %q", tt.version)
	}
}

func TestNodeUpgradeHint_MentionsNvmAndDownloadURL(t *testing.T) {
	hint := utils.NodeUpgradeHint()
	assert.Contains(t, hint, "nvm install "+utils.MinNodeVersion)
	assert.Contains(t, hint, "https://nodejs.org/en/download")
}
