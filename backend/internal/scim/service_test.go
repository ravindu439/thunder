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
	"context"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/thunder-id/thunderid/internal/system/config"
)

// newTestSCIMService creates a scimService with nil user and entity type services.
// This is safe for ServiceProviderConfig tests because GetServiceProviderConfig
// does not use either of those dependencies.
func newTestSCIMService(cfg config.SCIMConfig) *scimService {
	return newSCIMService(nil, nil, cfg)
}

// --- GetServiceProviderConfig ---

func TestGetServiceProviderConfig_SchemasContainServiceProviderConfigURN(t *testing.T) {
	svc := newTestSCIMService(config.SCIMConfig{})
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.Len(t, result.Schemas, 1)
	require.Equal(t, SCIMServiceProviderConfigSchemaURN, result.Schemas[0])
}

func TestGetServiceProviderConfig_MetaLocation(t *testing.T) {
	baseURL := "https://thunder.example.com"
	svc := newTestSCIMService(config.SCIMConfig{})
	result := svc.GetServiceProviderConfig(context.Background(), baseURL)

	require.Equal(t, "ServiceProviderConfig", result.Meta.ResourceType)
	require.Equal(t, baseURL+"/scim/v2/ServiceProviderConfig", result.Meta.Location)
}

func TestGetServiceProviderConfig_MetaCreatedEqualsLastModified(t *testing.T) {
	svc := newTestSCIMService(config.SCIMConfig{})
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.Equal(t, scimServiceProviderConfigCreated, result.Meta.Created)
	require.Equal(t, scimServiceProviderConfigCreated, result.Meta.LastModified)
}

func TestGetServiceProviderConfig_MetaVersion_IncludedWhenETagEnabled(t *testing.T) {
	svc := newTestSCIMService(config.SCIMConfig{ETagSupported: true})
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.NotEmpty(t, result.Meta.Version)
	require.True(t, strings.HasPrefix(result.Meta.Version, `W/"`),
		"version must follow RFC 7232 weak ETag format W/\"<value>\"")
}

func TestGetServiceProviderConfig_MetaVersion_OmittedWhenETagDisabled(t *testing.T) {
	svc := newTestSCIMService(config.SCIMConfig{ETagSupported: false})
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.Empty(t, result.Meta.Version,
		"version must be omitted when ETag is not supported per RFC 7643 §3.1")
}

func TestGetServiceProviderConfig_PatchSupported(t *testing.T) {
	tests := []struct{ supported bool }{{true}, {false}}
	for _, tc := range tests {
		svc := newTestSCIMService(config.SCIMConfig{PatchSupported: tc.supported})
		result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")
		require.Equal(t, tc.supported, result.Patch.Supported)
	}
}

func TestGetServiceProviderConfig_BulkConfig(t *testing.T) {
	cfg := config.SCIMConfig{
		BulkSupported:      true,
		BulkMaxOperations:  100,
		BulkMaxPayloadSize: 1048576,
	}
	svc := newTestSCIMService(cfg)
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.True(t, result.Bulk.Supported)
	require.Equal(t, 100, result.Bulk.MaxOperations)
	require.Equal(t, 1048576, result.Bulk.MaxPayloadSize)
}

func TestGetServiceProviderConfig_BulkDisabled(t *testing.T) {
	svc := newTestSCIMService(config.SCIMConfig{BulkSupported: false})
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.False(t, result.Bulk.Supported)
}

func TestGetServiceProviderConfig_FilterConfig(t *testing.T) {
	cfg := config.SCIMConfig{
		FilterSupported:  true,
		FilterMaxResults: 500,
	}
	svc := newTestSCIMService(cfg)
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.True(t, result.Filter.Supported)
	require.Equal(t, 500, result.Filter.MaxResults)
}

func TestGetServiceProviderConfig_ChangePasswordSupported(t *testing.T) {
	tests := []struct{ supported bool }{{true}, {false}}
	for _, tc := range tests {
		svc := newTestSCIMService(config.SCIMConfig{ChangePasswordSupported: tc.supported})
		result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")
		require.Equal(t, tc.supported, result.ChangePassword.Supported)
	}
}

func TestGetServiceProviderConfig_SortSupported(t *testing.T) {
	tests := []struct{ supported bool }{{true}, {false}}
	for _, tc := range tests {
		svc := newTestSCIMService(config.SCIMConfig{SortSupported: tc.supported})
		result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")
		require.Equal(t, tc.supported, result.Sort.Supported)
	}
}

func TestGetServiceProviderConfig_ETagSupported(t *testing.T) {
	tests := []struct{ supported bool }{{true}, {false}}
	for _, tc := range tests {
		svc := newTestSCIMService(config.SCIMConfig{ETagSupported: tc.supported})
		result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")
		require.Equal(t, tc.supported, result.ETag.Supported)
	}
}

func TestGetServiceProviderConfig_AuthenticationSchemes(t *testing.T) {
	svc := newTestSCIMService(config.SCIMConfig{})
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.NotEmpty(t, result.AuthenticationSchemes)
	scheme := result.AuthenticationSchemes[0]
	require.Equal(t, "oauthbearertoken", scheme.Type)
	require.Equal(t, "OAuth Bearer Token", scheme.Name)
	require.NotEmpty(t, scheme.Description)
}

func TestGetServiceProviderConfig_AllFeaturesEnabled(t *testing.T) {
	cfg := config.SCIMConfig{
		PatchSupported:          true,
		BulkSupported:           true,
		BulkMaxOperations:       1000,
		BulkMaxPayloadSize:      10485760,
		FilterSupported:         true,
		FilterMaxResults:        1000,
		ChangePasswordSupported: true,
		SortSupported:           true,
		ETagSupported:           true,
	}
	svc := newTestSCIMService(cfg)
	result := svc.GetServiceProviderConfig(context.Background(), "https://example.com")

	require.True(t, result.Patch.Supported)
	require.True(t, result.Bulk.Supported)
	require.Equal(t, 1000, result.Bulk.MaxOperations)
	require.Equal(t, 10485760, result.Bulk.MaxPayloadSize)
	require.True(t, result.Filter.Supported)
	require.Equal(t, 1000, result.Filter.MaxResults)
	require.True(t, result.ChangePassword.Supported)
	require.True(t, result.Sort.Supported)
	require.True(t, result.ETag.Supported)
	require.NotEmpty(t, result.Meta.Version)
}

// --- computeSCIMConfigVersion ---

func TestComputeSCIMConfigVersion_IsDeterministic(t *testing.T) {
	cfg := config.SCIMConfig{PatchSupported: true, ETagSupported: true}
	require.Equal(t, computeSCIMConfigVersion(cfg), computeSCIMConfigVersion(cfg),
		"version must be identical across calls for the same config")
}

func TestComputeSCIMConfigVersion_ChangesWhenConfigChanges(t *testing.T) {
	v1 := computeSCIMConfigVersion(config.SCIMConfig{PatchSupported: true})
	v2 := computeSCIMConfigVersion(config.SCIMConfig{PatchSupported: false})
	require.NotEqual(t, v1, v2,
		"version must differ when the config changes so SCIM clients can detect updates")
}

func TestComputeSCIMConfigVersion_FollowsWeakETagFormat(t *testing.T) {
	version := computeSCIMConfigVersion(config.SCIMConfig{ETagSupported: true})
	require.True(t, strings.HasPrefix(version, `W/"`), `must start with W/"`)
	require.True(t, strings.HasSuffix(version, `"`), `must end with "`)
}
