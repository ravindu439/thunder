// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package scim

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestMissingRequiredAttrs_InvalidSchemaJSON(t *testing.T) {
	_, err := missingRequiredAttrs(map[string]json.RawMessage{}, json.RawMessage(`not json`), false)
	require.Error(t, err)
}

func TestMissingRequiredAttrs_AllPresent(t *testing.T) {
	schema := json.RawMessage(`{"given_name":{"required":true}}`)
	attrs := map[string]json.RawMessage{"given_name": json.RawMessage(`"Alice"`)}
	missing, err := missingRequiredAttrs(attrs, schema, false)
	require.NoError(t, err)
	require.Empty(t, missing)
}

func TestMissingRequiredAttrs_ReportsMissingSorted(t *testing.T) {
	schema := json.RawMessage(`{
		"given_name":{"required":true},
		"family_name":{"required":true},
		"nickname":{"required":false}
	}`)
	missing, err := missingRequiredAttrs(map[string]json.RawMessage{}, schema, false)
	require.NoError(t, err)
	require.Equal(t, []string{"family_name", "given_name"}, missing)
}

func TestMissingRequiredAttrs_SkipCredentialTrue_OmitsCredential(t *testing.T) {
	schema := json.RawMessage(`{"password":{"required":true,"credential":true}}`)
	missing, err := missingRequiredAttrs(map[string]json.RawMessage{}, schema, true)
	require.NoError(t, err)
	require.Empty(t, missing)
}

func TestMissingRequiredAttrs_SkipCredentialFalse_IncludesCredential(t *testing.T) {
	schema := json.RawMessage(`{"password":{"required":true,"credential":true}}`)
	missing, err := missingRequiredAttrs(map[string]json.RawMessage{}, schema, false)
	require.NoError(t, err)
	require.Equal(t, []string{"password"}, missing)
}

func TestUndeclaredAttrs_ReportsUndeclaredSorted(t *testing.T) {
	schema := json.RawMessage(`{
		"given_name":{"required":true}
	}`)
	extAttrs := map[string]json.RawMessage{
		"given_name": json.RawMessage(`"Alice"`),
		"extra_one":  json.RawMessage(`"one"`),
		"another":    json.RawMessage(`"two"`),
	}
	undeclared, err := undeclaredAttrs(extAttrs, schema)
	require.NoError(t, err)
	require.Equal(t, []string{"another", "extra_one"}, undeclared)
}

func TestMissingRequiredAttrs_CaseInsensitive(t *testing.T) {
	schema := json.RawMessage(`{"given_name":{"required":true}}`)
	attrs := map[string]json.RawMessage{"Given_Name": json.RawMessage(`"Alice"`)}
	missing, err := missingRequiredAttrs(attrs, schema, false)
	require.NoError(t, err)
	require.Empty(t, missing)
}

func TestUndeclaredAttrs_CaseInsensitive(t *testing.T) {
	schema := json.RawMessage(`{"given_name":{"required":true}}`)
	extAttrs := map[string]json.RawMessage{
		"Given_Name": json.RawMessage(`"Alice"`),
	}
	undeclared, err := undeclaredAttrs(extAttrs, schema)
	require.NoError(t, err)
	require.Empty(t, undeclared)
}

func TestMapRawPropertyToSCIMAttribute_CredentialArrayItems_PropagatesNeverReturned(t *testing.T) {
	def := rawPropertyDef{
		Type: rawPropertyTypeArray,
		Items: &rawPropertyDef{
			Type:       rawPropertyTypeObject,
			Credential: true,
			Properties: map[string]rawPropertyDef{
				"secret": {Type: "string", Credential: true},
			},
		},
	}
	attr := mapRawPropertyToSCIMAttribute("recovery_codes", def)
	require.Equal(t, scimReturnedNever, attr.Returned)
	require.Equal(t, scimMutabilityWriteOnly, attr.Mutability)
}
