// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Package oauthconfig holds OAuth-specific configuration injected at initialization.
package oauthconfig

import (
	"github.com/thunder-id/thunderid/internal/system/config"
	engineconfig "github.com/thunder-id/thunderid/pkg/thunderidengine/config"
)

// Config holds configuration values required by OAuth services.
type Config struct {
	DeploymentID           string
	RuntimeTransientDBType string
	BaseURL                string
	JWT                    engineconfig.JWTConfig
	OAuth                  engineconfig.OAuthConfig
	GateClient             engineconfig.GateClientConfig
}

// FromServerRuntime builds OAuth configuration from the global server runtime.
func FromServerRuntime() Config {
	runtime := config.GetServerRuntime()
	return Config{
		DeploymentID:           runtime.Config.Server.Identifier,
		RuntimeTransientDBType: runtime.Config.Database.RuntimeTransient.Type,
		BaseURL:                config.GetServerURL(&runtime.Config.Server),
		JWT:                    runtime.Config.JWT,
		OAuth:                  runtime.Config.OAuth,
		GateClient:             runtime.Config.GateClient,
	}
}
