// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Package spinner renders a styled download progress bar using charmbracelet/bubbles.
package spinner

import (
	"charm.land/bubbles/v2/progress"
	"charm.land/lipgloss/v2"

	"github.com/thunder-id/thunderid/tools/cli/internal/product"
)

// DefaultWidth is the character width of the rendered progress bar.
const DefaultWidth = 30

var bar = progress.New(
	progress.WithColors(lipgloss.Color(product.ColorElectricBlue)),
	progress.WithWidth(DefaultWidth),
	progress.WithoutPercentage(),
)

// Render returns a styled progress bar string for a given percentage (0–100).
func Render(pct int) string {
	return bar.ViewAs(float64(pct) / 100)
}
