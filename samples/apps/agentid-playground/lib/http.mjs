// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Minimal OAuth token client over Node's built-in http/https. No dependencies.

import {request as httpsRequest, Agent as HttpsAgent} from "node:https";
import {request as httpRequest, Agent as HttpAgent} from "node:http";

export const JWT_TYPE = "urn:ietf:params:oauth:token-type:jwt";
export const ACCESS_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
export const EXCHANGE_GRANT = "urn:ietf:params:oauth:grant-type:token-exchange";

const basicAuth = ({clientId, clientSecret}) =>
  "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

// An instance that accepts the socket but never answers would otherwise leave the page loading
// forever, and because maxSockets is 1 it would block every later request on the same agent.
const TIMEOUT_MS = 10000;

// Destroying the request emits `error` with this reason, which rejects the pending promise.
const failOnTimeout = (req, method, path) =>
  req.on("timeout", () =>
    req.destroy(new Error(`${method} ${path} timed out after ${TIMEOUT_MS}ms`)));

export function createTokenClient(baseUrl) {
  // ThunderID serves a self-signed cert on localhost. Skip verification for local hosts only,
  // scoped to this agent rather than the whole process (so there is no global NODE_TLS warning).
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(baseUrl);
  // A single shared keep-alive connection (maxSockets: 1) serializes outbound requests over one
  // reused socket, and identity encoding disables gzip.
  const httpsAgent = new HttpsAgent({keepAlive: true, maxSockets: 1, rejectUnauthorized: !isLocal});
  const httpAgent = new HttpAgent({keepAlive: true, maxSockets: 1});

  function postForm(path, headers, body) {
    return new Promise((resolveP, rejectP) => {
      const u = new URL(`${baseUrl}${path}`);
      const isHttp = u.protocol === "http:";
      const requester = isHttp ? httpRequest : httpsRequest;
      const req = requester(
        {
          hostname: u.hostname,
          port: u.port,
          path: u.pathname + u.search,
          method: "POST",
          agent: isHttp ? httpAgent : httpsAgent,
          timeout: TIMEOUT_MS,
          headers: {"Accept-Encoding": "identity", ...headers},
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () =>
            resolveP({status: res.statusCode ?? 0, text: Buffer.concat(chunks).toString("utf8")}));
        },
      );
      failOnTimeout(req, "POST", path);
      req.on("error", rejectP);
      req.write(body);
      req.end();
    });
  }

  // Plain GET, redirects NOT followed, so readiness checks can read the Location header.
  function get(path) {
    return new Promise((resolveP, rejectP) => {
      const u = new URL(`${baseUrl}${path}`);
      const isHttp = u.protocol === "http:";
      const requester = isHttp ? httpRequest : httpsRequest;
      const req = requester(
        {
          hostname: u.hostname,
          port: u.port,
          path: u.pathname + u.search,
          method: "GET",
          agent: isHttp ? httpAgent : httpsAgent,
          timeout: TIMEOUT_MS,
          headers: {"Accept-Encoding": "identity"},
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () =>
            resolveP({
              status: res.statusCode ?? 0,
              headers: res.headers,
              text: Buffer.concat(chunks).toString("utf8"),
            }));
        },
      );
      failOnTimeout(req, "GET", path);
      req.on("error", rejectP);
      req.end();
    });
  }

  // POST /oauth2/token authenticated as `credentials`, returning the parsed token response.
  async function tokenResponse(credentials, params) {
    const r = await postForm(
      "/oauth2/token",
      {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: basicAuth(credentials),
        Accept: "application/json",
      },
      new URLSearchParams(params).toString(),
    );
    if (r.status !== 200) throw new Error(`token request failed (${r.status}): ${r.text.slice(0, 300)}`);
    return JSON.parse(r.text);
  }

  const accessToken = async (credentials, params) => (await tokenResponse(credentials, params)).access_token;

  return {
    baseUrl,
    get,
    tokenResponse,
    accessToken,

    // The agent authenticates with its own credentials and receives a token whose subject is itself.
    clientCredentials: (credentials) => accessToken(credentials, {grant_type: "client_credentials"}),

    // RFC 8693. `act` is built solely from the actor token, so omitting it omits the actor claim.
    // `scope` narrows the issued token; ThunderID rejects anything the subject token does not hold.
    exchange: (credentials, subjectToken, actorToken, {scope, resource} = {}) =>
      accessToken(credentials, {
        grant_type: EXCHANGE_GRANT,
        subject_token: subjectToken,
        subject_token_type: JWT_TYPE,
        ...(actorToken ? {actor_token: actorToken, actor_token_type: JWT_TYPE} : {}),
        ...(scope ? {scope} : {}),
        ...(resource ? {resource} : {}),
      }),
  };
}
