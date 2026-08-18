// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package scim

import (
	"testing"

	"github.com/stretchr/testify/require"
)

// ---------------------------------------------------------------------------
// Users — POST / PUT validation tests
// ---------------------------------------------------------------------------

func TestValidateSCIMUserRequest(t *testing.T) {
	validURN := "urn:thunderid:params:scim:schemas:employee:2.0:User"

	tests := []struct {
		name         string
		body         []byte
		wantErrCode  string
		wantUserType string
		wantExtURN   string
	}{
		{
			name:        "InvalidJSON",
			body:        []byte(`not json`),
			wantErrCode: ErrorInvalidRequestBody.Code,
		},
		{
			name:        "MissingSchemas",
			body:        []byte(`{"userName":"alice"}`),
			wantErrCode: ErrorMissingSchemas.Code,
		},
		{
			name:        "EmptySchemas",
			body:        []byte(`{"schemas":[],"` + validURN + `":{}}`),
			wantErrCode: ErrorMissingSchemas.Code,
		},
		{
			name:        "DuplicateSchemas",
			body:        []byte(`{"schemas":["` + validURN + `","` + validURN + `"],"` + validURN + `":{}}`),
			wantErrCode: ErrorDuplicateSchemas.Code,
		},
		{
			name:        "MissingThunderIDURN",
			body:        []byte(`{"schemas":["urn:ietf:params:scim:schemas:core:2.0:User"]}`),
			wantErrCode: ErrorMissingCustomSchema.Code,
		},
		{
			name:         "CoreOnly_NoThunderIDURN_ParsesWithEmptyUserType",
			body:         []byte(`{"schemas":["` + SCIMCoreUserSchemaURN + `"],"userName":"alice"}`),
			wantErrCode:  "",
			wantUserType: "",
			wantExtURN:   "",
		},
		{
			name: "MultipleThunderIDURNs",
			body: []byte(`{` +
				`"schemas":["urn:thunderid:params:scim:schemas:employee:2.0:User",` +
				`"urn:thunderid:params:scim:schemas:person:2.0:User"],` +
				`"urn:thunderid:params:scim:schemas:employee:2.0:User":{},` +
				`"urn:thunderid:params:scim:schemas:person:2.0:User":{}}`),
			wantErrCode: ErrorMultipleCustomSchemas.Code,
		},
		{
			name: "MalformedCustomSchemaURN_WrongSuffix",
			body: []byte(
				`{"schemas":["urn:thunderid:params:scim:schemas:employee:2.0:Group"],` +
					`"urn:thunderid:params:scim:schemas:employee:2.0:Group":{}}`),
			wantErrCode: ErrorInvalidCustomSchemaURN.Code,
		},
		{
			name: "MalformedCustomSchemaURN_EmptyUserType",
			body: []byte(
				`{"schemas":["urn:thunderid:params:scim:schemas::2.0:User"],` +
					`"urn:thunderid:params:scim:schemas::2.0:User":{}}`),
			wantErrCode: ErrorInvalidCustomSchemaURN.Code,
		},
		{
			name:         "OmittedExtensionObject_DefaultsToEmpty",
			body:         []byte(`{"schemas":["` + SCIMCoreUserSchemaURN + `","` + validURN + `"],"userName":"alice"}`),
			wantErrCode:  "",
			wantUserType: "employee",
			wantExtURN:   validURN,
		},
		{
			name:        "InvalidExtensionObjectJSON",
			body:        []byte(`{"schemas":["` + validURN + `"],"` + validURN + `":"not-an-object"}`),
			wantErrCode: ErrorMissingCustomSchemaObject.Code,
		},
		{
			name: "ValidPayload",
			body: []byte(`{
				"schemas":["` + SCIMCoreUserSchemaURN + `","` + validURN + `"],
				"` + validURN + `":{"department":"engineering"},
				"userName":"alice"
			}`),
			wantErrCode:  "",
			wantUserType: "employee",
			wantExtURN:   validURN,
		},
		{
			name:         "ValidPayload_ExtensionOnly_NoCoreAttrs_CoreSchemaOmitted",
			body:         []byte(`{"schemas":["` + validURN + `"],"` + validURN + `":{"given_name":"alice"}}`),
			wantErrCode:  "",
			wantUserType: "employee",
			wantExtURN:   validURN,
		},
		{
			name:        "CoreAttrsPresent_CoreUserSchemaMissing",
			body:        []byte(`{"schemas":["` + validURN + `"],"` + validURN + `":{}, "userName":"alice"}`),
			wantErrCode: ErrorMissingCoreUserSchema.Code,
		},
		{
			name: "UndeclaredThunderIDExtensionKey_NoThunderIDURNInSchemas",
			body: []byte(`{"schemas":["` + SCIMCoreUserSchemaURN + `"],` +
				`"` + validURN + `":{"department":"engineering"},"userName":"alice"}`),
			wantErrCode: ErrorUndeclaredCustomSchemaObject.Code,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			payload, svcErr := validateSCIMUserRequest(tc.body)
			if tc.wantErrCode != "" {
				require.NotNil(t, svcErr, "expected a ServiceError")
				require.Equal(t, tc.wantErrCode, svcErr.Code)
				require.Nil(t, payload)
				return
			}
			require.Nil(t, svcErr)
			require.NotNil(t, payload)
			require.Equal(t, tc.wantUserType, payload.UserTypeName)
			require.Equal(t, tc.wantExtURN, payload.ExtensionURN)
		})
	}
}

// ---------------------------------------------------------------------------
// Groups — POST / PUT validation tests
// ---------------------------------------------------------------------------

func TestValidateSCIMGroupWriteRequest_InvalidJSON(t *testing.T) {
	_, err := validateSCIMGroupWriteRequest([]byte(`not json`))
	require.Equal(t, ErrorInvalidRequestBody.Code, err.Code)
}

func TestValidateSCIMGroupWriteRequest_MissingDisplayName(t *testing.T) {
	body := `{"schemas":["urn:ietf:params:scim:schemas:core:2.0:Group"],"displayName":""}`
	_, err := validateSCIMGroupWriteRequest([]byte(body))
	require.Equal(t, ErrorInvalidRequestBody.Code, err.Code)
}

func TestValidateSCIMGroupWriteRequest_MissingCoreGroupSchema(t *testing.T) {
	body := `{"schemas":[],"displayName":"Eng"}`
	_, err := validateSCIMGroupWriteRequest([]byte(body))
	require.Equal(t, ErrorMissingCoreGroupSchema.Code, err.Code)
}

func TestValidateSCIMGroupWriteRequest_Valid(t *testing.T) {
	body := `{
		"schemas":["urn:ietf:params:scim:schemas:core:2.0:Group"],
		"displayName":"Engineering",
		"members":[{"value":"user-1","type":"User"}]
	}`
	payload, err := validateSCIMGroupWriteRequest([]byte(body))
	require.Nil(t, err)
	require.Equal(t, "Engineering", payload.DisplayName)
	require.Len(t, payload.Members, 1)
}

func TestValidateSCIMGroupWriteRequest_NoMembers(t *testing.T) {
	body := `{"schemas":["urn:ietf:params:scim:schemas:core:2.0:Group"],"displayName":"Empty"}`
	payload, err := validateSCIMGroupWriteRequest([]byte(body))
	require.Nil(t, err)
	require.Equal(t, "Empty", payload.DisplayName)
	require.Empty(t, payload.Members)
}

// ---------------------------------------------------------------------------
// Groups — PATCH validation tests
// ---------------------------------------------------------------------------

func TestValidateSCIMGroupPatchRequest_MissingSchema(t *testing.T) {
	body := `{"Operations":[{"op":"replace","path":"displayName","value":"X"}]}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorMissingSchemas.Code, err.Code)
}

func TestValidateSCIMGroupPatchRequest_InvalidJSON(t *testing.T) {
	_, err := validateSCIMGroupPatchRequest([]byte(`not json`))
	require.Equal(t, ErrorInvalidRequestBody.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_DisplayNameReplace(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "replace", "path": "displayName", "value": "New Name"}]
	}`
	actions, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Nil(t, err)
	require.Len(t, actions, 1)
	require.Equal(t, scimGroupPatchTargetDisplayName, actions[0].Target)
	require.Equal(t, "New Name", actions[0].DisplayName)
}

func TestValidateSCIMGroupPatchOp_DisplayNameRemove_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "remove", "path": "displayName"}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchPath.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_DisplayNameEmptyValue_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "replace", "path": "displayName", "value": ""}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchValue.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_AddMembers(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "add", "path": "members",
			"value": [{"value": "user-1", "type": "User"}]}]
	}`
	actions, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Nil(t, err)
	require.Equal(t, scimGroupPatchTargetMembers, actions[0].Target)
	require.Len(t, actions[0].Members, 1)
}

func TestValidateSCIMGroupPatchOp_AddMembers_EmptyValue_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "add", "path": "members", "value": []}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchValue.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_RemoveMembers_NoPath(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "remove", "path": "members"}]
	}`
	actions, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Nil(t, err)
	require.Empty(t, actions[0].FilterValue)
}

func TestValidateSCIMGroupPatchOp_RemoveMembers_FilteredPath(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "remove", "path": "members[value eq \"user-1\"]"}]
	}`
	actions, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Nil(t, err)
	require.Equal(t, "user-1", actions[0].FilterValue)
}

func TestValidateSCIMGroupPatchOp_RemoveMembers_FilteredPathWithValue_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "remove", "path": "members[value eq \"user-1\"]",
			"value": [{"value": "user-1"}]}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchValue.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_MalformedFilterPath(t *testing.T) {
	cases := []string{
		`members[value \"user-1\"]`,   // missing "eq"
		`members[id eq \"user-1\"]`,   // wrong attribute
		`members[value eq ]`,          // empty value
		`members[value eq \"\"]`,      // empty string value
		`members[value eq \"user-1\"`, // unterminated bracket
	}
	for _, path := range cases {
		body := `{
			"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
			"Operations": [{"op": "remove", "path": "` + path + `"}]
		}`
		_, err := validateSCIMGroupPatchRequest([]byte(body))
		require.Equal(t, ErrorInvalidPatchPath.Code, err.Code, "path: %s", path)
	}
}

func TestValidateSCIMGroupPatchOp_FilteredPath_AddRejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "add", "path": "members[value eq \"user-1\"]",
			"value": [{"value": "user-1"}]}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchPath.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_UnknownPath_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "replace", "path": "externalId", "value": "x"}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchPath.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_InvalidOp_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "bogus", "path": "displayName", "value": "x"}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchOp.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_CaseInsensitiveOpAndPath(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "REPLACE", "path": "DisplayName", "value": "X"}]
	}`
	actions, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Nil(t, err)
	require.Equal(t, scimGroupPatchTargetDisplayName, actions[0].Target)
}

func TestValidateSCIMGroupPatchOp_RemoveMembersWithUnexpectedValue_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "remove", "path": "members", "value": [{"value": "user-1"}]}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchValue.Code, err.Code)
}

func TestValidateSCIMGroupPatchOp_AddMembersWithInvalidJSONValue_Rejected(t *testing.T) {
	body := `{
		"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
		"Operations": [{"op": "add", "path": "members", "value": "not-an-array"}]
	}`
	_, err := validateSCIMGroupPatchRequest([]byte(body))
	require.Equal(t, ErrorInvalidPatchValue.Code, err.Code)
}
