// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {decodeJwt} from "./jwt.mjs";

// Readiness checks behind the "Try it out" steps.
//
// The app has to be useful before anything is imported, so every tab checks its own prerequisites
// and says exactly which one is missing instead of failing with a raw token error.

// Node raises an AggregateError with an empty message when every address for a host refuses the
// connection, which is the usual "ThunderID is not running" case, so read the causes instead.
function connectionError(err) {
  if (err?.errors?.length) {
    const causes = [...new Set(err.errors.map((e) => e.message || e.code).filter(Boolean))];
    if (causes.length) return causes.join("; ");
  }
  return err?.message || err?.code || String(err);
}

// Authenticating proves the agent exists; it proves nothing about what the agent may do. ThunderID
// issues a scopeless token rather than an error when you ask for scopes the principal has not been
// granted, so a tab whose whole point is the scope claim has to check the claim itself.
export async function checkScopes(client, credentials, {scope, resource, expect, role}) {
  let token;
  try {
    token = await client.accessToken(credentials, {grant_type: "client_credentials", scope, resource});
  } catch (err) {
    return {ok: false, detail: err instanceof Error ? err.message : String(err)};
  }

  const granted = String(decodeJwt(token)?.claims?.scope ?? "").split(" ").filter(Boolean);
  if (!granted.length) {
    return {
      ok: false,
      detail:
        `the agent authenticates, but its token carries no scope at all, so this tab would show ` +
        `nothing to narrow. The ${role} role that grants ${expect.join(" and ")} is missing: ` +
        `re-import this tab's resource file.`,
    };
  }
  const missing = expect.filter((s) => !granted.includes(s));
  if (missing.length) {
    return {ok: false, detail: `token is missing ${missing.join(", ")}. Granted: ${granted.join(" ")}`};
  }
  return {ok: true, detail: `scopes granted: ${granted.join(" ")}`};
}

// Step 1. Any HTTP answer means the server is up; only a connection-level failure means it is not.
export async function checkBackend(client) {
  try {
    const r = await client.get("/health/liveness");
    return {ok: true, detail: `answered ${r.status} on /health/liveness`};
  } catch (err) {
    return {ok: false, detail: connectionError(err)};
  }
}

// Step 2. An agent that can mint its own token exists and its secret matches config.json.
// invalid_client means the import has not happened (or the credentials drifted).
export async function checkAgents(client, required, agents) {
  const results = [];
  for (const {key, id} of required) {
    const credentials = agents[key];
    if (!credentials) {
      results.push({id, ok: false, detail: `no "${key}" entry in config.json`});
      continue;
    }
    try {
      await client.clientCredentials(credentials);
      results.push({id, ok: true, detail: "found"});
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        id,
        ok: false,
        detail: /invalid_client/.test(message)
          ? "not found, or its clientSecret does not match config.json"
          : message,
      });
    }
  }
  return {ok: results.every((r) => r.ok), results};
}
