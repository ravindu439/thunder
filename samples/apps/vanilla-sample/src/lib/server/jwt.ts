// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import 'server-only';

export interface DecodedAssertion {
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    // Signature is not decoded as it's not base64-encoded JSON.
    signature: string;
}

// Claims the flow engine embeds purely for its own internal bookkeeping (request correlation,
// token-family revocation tracking, permission/assurance state) and never intends for display.
// The remaining payload, including whatever attributes the application configures under
// assertion.userAttributes, is exactly what this sample is meant to show; only these are stripped.
// See backend/internal/flow/executor/auth_assert_executor.go for where each is set.
const INTERNAL_PAYLOAD_CLAIMS = [
    'authorization_request_id',
    'tfid',
    'assurance',
    'authorized_permissions',
    'aci',
    'completed_auth_class',
];

/**
 * Decodes a JWT assertion into its header, payload, and signature components, without verifying
 * it. The assertion always arrives straight from the flow API over TLS, so re-verification isn't
 * needed here; this exists purely to let the sample display the claims it received. Internal
 * flow-engine claims not meant for display are stripped from the payload; see
 * INTERNAL_PAYLOAD_CLAIMS.
 *
 * @param token JWT token string to decode.
 * @returns The decoded header, payload, and signature, or null if the token isn't decodable.
 */
export const decodeAssertion = (token: string): DecodedAssertion | null => {
    try {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
        for (const claim of INTERNAL_PAYLOAD_CLAIMS) {
            delete decodedPayload[claim];
        }
        return {
            header: JSON.parse(Buffer.from(header, 'base64url').toString('utf8')),
            payload: decodedPayload,
            signature,
        };
    } catch (error) {
        console.error('Failed to decode assertion:', error);
        return null;
    }
};
