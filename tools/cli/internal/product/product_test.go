// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package product_test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/thunder-id/thunderid/tools/cli/internal/product"
)

func TestConstants_NonEmpty(t *testing.T) {
	assert.NotEmpty(t, product.Name)
	assert.NotEmpty(t, product.Slug)
	assert.NotEmpty(t, product.ReleasesURL)
	assert.NotEmpty(t, product.GitHubAPI)
}

func TestBrandColors_HexFormat(t *testing.T) {
	for _, color := range []string{product.ColorDeepNavy, product.ColorElectricBlue, product.ColorWhite} {
		assert.True(t, strings.HasPrefix(color, "#"), "color %q should start with #", color)
		assert.Equal(t, 7, len(color), "color %q should be 7 chars (#RRGGBB)", color)
	}
}

func TestReleasesURL_HTTPS(t *testing.T) {
	assert.True(t, strings.HasPrefix(product.ReleasesURL, "https://"))
	assert.True(t, strings.HasPrefix(product.GitHubAPI, "https://"))
}
