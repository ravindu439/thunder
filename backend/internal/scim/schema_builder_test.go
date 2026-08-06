/*
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
	// Core attributes are not checked for now - real SCIM clients send standard
	// envelope fields a business schema has no reason to declare.
	coreAttrs := map[string]json.RawMessage{
		"userName": json.RawMessage(`"alice"`),
		"nickName": json.RawMessage(`"Ali"`),
		"id":       json.RawMessage(`"123"`),
	}
	consumedCore := map[string]struct{}{"userName": {}}
	undeclared, err := undeclaredAttrs(extAttrs, coreAttrs, consumedCore, schema)
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
	undeclared, err := undeclaredAttrs(extAttrs, nil, nil, schema)
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
