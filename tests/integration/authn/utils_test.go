// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

package authn

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
)

// extractAssuranceLevelFromAssertion extracts AAL or IAL from the JWT assertion token
// This is a helper function used across authentication tests
func extractAssuranceLevelFromAssertion(assertion string, levelType string) string {
	// Split JWT token into its three parts
	parts := bytes.Split([]byte(assertion), []byte("."))
	if len(parts) < 2 {
		return ""
	}

	// Decode payload (second part) using standard base64 URL encoding
	decoded, err := base64.RawURLEncoding.DecodeString(string(parts[1]))
	if err != nil {
		return ""
	}

	// Unmarshal JWT claims
	var claims map[string]interface{}
	err = json.Unmarshal(decoded, &claims)
	if err != nil {
		return ""
	}

	// Look for assurance object
	if assurance, exists := claims["assurance"]; exists {
		if assuranceMap, ok := assurance.(map[string]interface{}); ok {
			if level, exists := assuranceMap[levelType]; exists {
				if levelStr, ok := level.(string); ok {
					return levelStr
				}
			}
		}
	}

	return ""
}
