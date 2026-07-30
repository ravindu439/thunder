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
	missing := missingRequiredAttrs(map[string]json.RawMessage{}, json.RawMessage(`not json`), false)
	require.Nil(t, missing)
}

func TestMissingRequiredAttrs_AllPresent(t *testing.T) {
	schema := json.RawMessage(`{"given_name":{"required":true}}`)
	attrs := map[string]json.RawMessage{"given_name": json.RawMessage(`"Alice"`)}
	missing := missingRequiredAttrs(attrs, schema, false)
	require.Empty(t, missing)
}

func TestMissingRequiredAttrs_ReportsMissingSorted(t *testing.T) {
	schema := json.RawMessage(`{
		"given_name":{"required":true},
		"family_name":{"required":true},
		"nickname":{"required":false}
	}`)
	missing := missingRequiredAttrs(map[string]json.RawMessage{}, schema, false)
	require.Equal(t, []string{"family_name", "given_name"}, missing)
}

func TestMissingRequiredAttrs_SkipCredentialTrue_OmitsCredential(t *testing.T) {
	schema := json.RawMessage(`{"password":{"required":true,"credential":true}}`)
	missing := missingRequiredAttrs(map[string]json.RawMessage{}, schema, true)
	require.Empty(t, missing)
}

func TestMissingRequiredAttrs_SkipCredentialFalse_IncludesCredential(t *testing.T) {
	schema := json.RawMessage(`{"password":{"required":true,"credential":true}}`)
	missing := missingRequiredAttrs(map[string]json.RawMessage{}, schema, false)
	require.Equal(t, []string{"password"}, missing)
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
