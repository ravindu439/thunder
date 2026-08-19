// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package spinner_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/thunder-id/thunderid/tools/cli/internal/ui/spinner"
)

func TestDefaultWidth_Positive(t *testing.T) {
	assert.Greater(t, spinner.DefaultWidth, 0)
}

func TestRender_ReturnsNonEmptyString(t *testing.T) {
	for _, pct := range []int{0, 25, 50, 75, 100} {
		result := spinner.Render(pct)
		assert.NotEmpty(t, result, "Render(%d) returned empty string", pct)
	}
}
