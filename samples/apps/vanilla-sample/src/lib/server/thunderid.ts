// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import 'server-only';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCACertificates, setDefaultCACertificates } from 'node:tls';

// The ThunderID server this sample talks to. Only read here, on the server, never exposed to the
// browser.
const THUNDERID_SERVER_URL = process.env.THUNDERID_SERVER_URL || 'https://localhost:8090';

// For a local ThunderID server using a self-signed development certificate, point
// THUNDERID_SERVER_CA_CERT at it so Node's fetch() trusts it. `next dev --experimental-https`
// overwrites NODE_EXTRA_CA_CERTS with its own mkcert path (vercel/next.js#57958), so that env var
// cannot be used for this; extending the default CA list directly is unaffected by that behavior.
// If unset, falls back to certificates/server.cert, which the build packages alongside this
// sample with the same distribution's own server certificate (see build.sh); that fallback is
// silently skipped when running from an unpackaged source checkout, where it won't exist.
const DEFAULT_SERVER_CA_CERT_PATH = join(process.cwd(), 'certificates', 'server.cert');
const serverCaCertPath =
    process.env.THUNDERID_SERVER_CA_CERT ||
    (existsSync(DEFAULT_SERVER_CA_CERT_PATH) ? DEFAULT_SERVER_CA_CERT_PATH : undefined);
if (serverCaCertPath) {
    setDefaultCACertificates([...getCACertificates('default'), readFileSync(serverCaCertPath, 'utf-8')]);
}

export const FLOW_ENDPOINT = `${THUNDERID_SERVER_URL}/flow`;
export const USERS_ENDPOINT = `${THUNDERID_SERVER_URL}/users`;

// Applied to every upstream fetch so a hung server can't hang the proxy request indefinitely.
export const UPSTREAM_TIMEOUT_MS = 10_000;

const requireEnv = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not set. Copy .env.example to .env.local and fill in your values.`);
    }
    return value;
};

/**
 * The application ID this server is registered as. Pinned here rather than trusted from the
 * browser request, so a client cannot ask the server to initiate a flow for a different application.
 */
export const requireApplicationId = (): string => requireEnv('THUNDERID_APPLICATION_ID');

/**
 * The Flow Secret that proves this server is the confidential application it claims to be. Read
 * once per request from server-side env and attached to the `Flow-Secret` header. It never
 * reaches client-side JavaScript.
 */
export const requireFlowSecret = (): string => requireEnv('THUNDERID_FLOW_SECRET');
