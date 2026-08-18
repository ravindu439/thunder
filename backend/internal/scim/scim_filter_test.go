// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package scim

import (
	"testing"

	"github.com/stretchr/testify/require"
)

// --- parseSCIMFilterForEq direct unit tests ---

func TestParseSCIMFilterForEq_EmptyString_ReturnsNil(t *testing.T) {
	filters, svcErr := parseSCIMFilterForEq("")
	require.Nil(t, svcErr)
	require.Nil(t, filters)
}

func TestParseSCIMFilterForEq_UnsupportedOperator_ReturnsError(t *testing.T) {
	tests := []string{
		`userName ne "alice"`,
		`userName co "ali"`,
		`userName sw "al"`,
		`userName ew "ce"`,
		`userName pr`,
		`age gt 5`,
		`age lt 5`,
		`age ge 5`,
		`age le 5`,
	}
	for _, filter := range tests {
		t.Run(filter, func(t *testing.T) {
			_, svcErr := parseSCIMFilterForEq(filter)
			require.NotNil(t, svcErr)
			require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
		})
	}
}

func TestParseSCIMFilterForEq_MalformedExpression_ReturnsError(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq("userName")
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

func TestParseSCIMFilterForEq_InvalidCompValue_ReturnsError(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq("userName eq null")
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

func TestParseSCIMFilterForEq_CompoundAnd_DuplicateAttribute_ReturnsError(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq(`userName eq "alice" and userName eq "bob"`)
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

func TestParseSCIMFilterForEq_CompoundAnd_MalformedSecondClause_ReturnsError(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq(`userName eq "alice" and active`)
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

func TestParseSCIMFilterForEq_Or_StillUnsupported(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq(`userName eq "alice" or active eq true`)
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

func TestParseSCIMFilterForEq_Not_StillUnsupported(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq(`not userName eq "alice"`)
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

func TestParseSCIMFilterForEq_Grouping_StillUnsupported(t *testing.T) {
	_, svcErr := parseSCIMFilterForEq(`(userName eq "alice")`)
	require.NotNil(t, svcErr)
	require.Equal(t, ErrorInvalidFilterSyntax.Code, svcErr.Code)
}

// --- parseSCIMCompValue direct unit tests ---

func TestParseSCIMCompValue(t *testing.T) {
	tests := []struct {
		name      string
		raw       string
		expected  interface{}
		expectErr bool
	}{
		{name: "quoted string", raw: `"alice"`, expected: "alice"},
		{name: "unterminated quoted string", raw: `"alice`, expectErr: true},
		{name: "true", raw: "true", expected: true},
		{name: "false", raw: "false", expected: false},
		{name: "null", raw: "null", expectErr: true},
		{name: "integer", raw: "42", expected: int64(42)},
		{name: "decimal", raw: "3.14", expected: 3.14},
		{name: "unrecognized", raw: "notavalue", expectErr: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseSCIMCompValue(tt.raw)
			if tt.expectErr {
				require.Error(t, err)
				return
			}
			require.NoError(t, err)
			require.Equal(t, tt.expected, got)
		})
	}
}
