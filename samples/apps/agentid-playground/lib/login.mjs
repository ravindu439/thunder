// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// A browser sign-in, reusable by any tab that needs one.
//
// Each tab that signs a user in owns its own session slot, its own callback path, and its own
// registered redirect URI, so no tab depends on another having been visited first. Walking a tab
// from the top always performs the whole flow.

import {randomBytes, createHash} from "node:crypto";

const base64url = (buf) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

function pkce() {
  const verifier = base64url(randomBytes(32));
  return {verifier, challenge: base64url(createHash("sha256").update(verifier).digest())};
}

// Built once per scenario. `slot` names the session key, `callbackPath` must match a redirect URI
// registered on the agent, and `returnPath` is the tab to land back on.
export function createLogin({slot, callbackPath, returnPath, scopes}) {
  const state = (session) => (session[slot] ??= {});
  const redirectUri = (config) => `${config.appBaseUrl}${callbackPath}`;

  function authorizeUrl(config, s) {
    const {verifier, challenge} = pkce();
    s.state = base64url(randomBytes(16));
    s.codeVerifier = verifier;
    return (
      `${config.thunderidBaseUrl}/oauth2/authorize?` +
      new URLSearchParams({
        client_id: config.agents.concierge.clientId,
        redirect_uri: redirectUri(config),
        response_type: "code",
        scope: scopes(config),
        // Required (RFC 8707). The booking scopes belong to a resource server, and ThunderID
        // rejects the request with invalid_target if nothing says which one.
        resource: config.resources.booking,
        // Consent is remembered once granted, so without this the screen appears only on the very
        // first sign-in, and this playground exists to show it every time.
        prompt: "consent",
        state: s.state,
        code_challenge: challenge,
        code_challenge_method: "S256",
      }).toString()
    );
  }

  // A tab that signs someone in must verify its own redirect URI, resource, and grant, or step 2
  // reports ready and the sign-in button then fails on the gate. Living next to the login itself
  // means adding a new signed-in tab cannot forget it.
  //
  // The probe deliberately omits code_challenge. A PKCE-required client answers "code_challenge is
  // required", which already proves everything else was accepted, and stops before an
  // authorization session is created.
  async function probe(client, config) {
    const params = new URLSearchParams({
      client_id: config.agents.concierge.clientId,
      redirect_uri: redirectUri(config),
      response_type: "code",
      scope: scopes(config),
      resource: config.resources.booking,
      state: "readiness-probe",
    });

    let location;
    try {
      location = (await client.get(`/oauth2/authorize?${params}`)).headers.location ?? "";
    } catch (err) {
      return {ok: false, detail: err instanceof Error ? err.message : String(err)};
    }

    // Two shapes come back: a redirect to our callback carrying error/error_description, or a
    // redirect to the gate's own error page carrying errorCode/errorMessage. Read both, or a gate
    // error reads as success.
    const query = new URLSearchParams(location.split("?")[1] ?? "");
    const error = query.get("error") ?? query.get("errorCode");
    const description = query.get("error_description") ?? query.get("errorMessage") ?? "";
    const verified = `${callbackPath} accepted, with its scopes and resource.`;

    if (!error) return {ok: true, detail: verified};
    if (/code_challenge/i.test(description)) return {ok: true, detail: `${verified} PKCE enforced.`};
    if (error === "unauthorized_client") {
      return {
        ok: false,
        detail:
          "The Concierge rejects authorization_code. Re-import this tab's resource file so its " +
          "grantTypes include it.",
      };
    }
    if (/redirect/i.test(description) || /Invalid redirect URI/i.test(location)) {
      return {
        ok: false,
        detail:
          `${redirectUri(config)} is not registered on the Concierge, so signing in would fail. ` +
          "Re-import this tab's resource file, which lists it under redirectUris.",
      };
    }
    if (/invalid_target/.test(error)) {
      return {
        ok: false,
        detail: `${config.resources.booking} is not a registered resource server, so the sign-in would fail with invalid_target.`,
      };
    }
    return {ok: false, detail: `${error}: ${description}`};
  }

  return {
    slot,
    state,
    redirectUri,
    scopes,
    probe,
    isSignedIn: (session) => Boolean(state(session).tokens),
    reset: (session) => {
      session[slot] = {};
    },

    routes: (errorPage) => ({
      [`GET ${returnPath}/login`]: ({res, session, config, redirect}) =>
        redirect(res, authorizeUrl(config, state(session))),

      [`GET ${callbackPath}`]: async ({res, url, session, config, client, redirect, sendPage}) => {
        const s = state(session);
        const err = url.searchParams.get("error");
        if (err) {
          return sendPage(
            errorPage(`Authorization failed: ${err} ${url.searchParams.get("error_description") ?? ""}`),
            400,
          );
        }
        const code = url.searchParams.get("code");
        const returned = url.searchParams.get("state");
        if (!code || !returned || returned !== s.state) {
          return sendPage(errorPage("Invalid callback: missing code or state mismatch."), 400);
        }
        s.tokens = await client.tokenResponse(config.agents.concierge, {
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri(config),
          code_verifier: s.codeVerifier ?? "",
        });
        s.state = undefined;
        s.codeVerifier = undefined;
        s.refreshed = false;
        s.exchange = undefined;
        s.note = undefined;
        return redirect(res, returnPath);
      },

      [`GET ${returnPath}/logout`]: ({res, session, redirect}) => {
        session[slot] = {};
        return redirect(res, returnPath);
      },
    }),
  };
}
