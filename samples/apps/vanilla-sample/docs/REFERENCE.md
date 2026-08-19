---
title: "Vanilla Sample: Detailed Reference"
docType: reference
description: Configuration reference for the vanilla sample, covering its backend-for-frontend architecture, environment variables, Flow Secret setup, and passkey configuration.
---

# Vanilla Sample: Detailed Reference

This document covers the BFF architecture, advanced configuration, and developer options for the Vanilla Sample Application. For getting started quickly, see the [main README](../README.md).

## Architecture: Why a Backend-for-Frontend

App-native sign-in initiates the flow engine directly via `POST /flow/execute`, rather than redirecting to a hosted OAuth2 page. Initiating an authentication or sign-out flow this way requires the calling application to authenticate itself with a **Flow Secret**, sent as the `Flow-Secret` request header. A browser SPA has nowhere safe to keep that secret: anything shipped in client-side JavaScript is readable by anyone who opens dev tools.

This sample solves that by never letting the browser call the flow API directly. Every flow request goes through a same-origin Next.js server route instead:

```text
Browser  →  POST /api/flow  →  (Next.js server)  →  POST https://localhost:8090/flow/execute
```

- [`src/app/api/flow/route.ts`](../src/app/api/flow/route.ts) is the proxy. On flow *initiation* (a request with no `executionId`), it pins the `applicationId` from server-side env, rather than trusting whatever the client sent, and attaches the `Flow-Secret` header from [`src/lib/server/thunderid.ts`](../src/lib/server/thunderid.ts). Continuation requests (carrying `executionId`) are forwarded unchanged; the flow execution guard only runs on initiation, so no secret is needed there.
- When SSO is enabled on a flow, the server tracks it with its own per-flow, httpOnly cookie. Node's `fetch` has no cookie jar of its own, unlike a browser, so the proxy relays it explicitly in both directions: the browser's incoming `Cookie` header is forwarded to the upstream call, and every `Set-Cookie` the upstream call returns is copied onto the response handed back to the browser. This is what lets `signOutNatively()` in [`src/services/authService.ts`](../src/services/authService.ts) end that session through the same proxy.
- When a flow completes with an assertion, the route captures it into an httpOnly, secure cookie via [`src/lib/server/session.ts`](../src/lib/server/session.ts) and **strips it from the JSON returned to the browser**, replacing it with `assertionIssued: true` so the client can still tell a completed sign-in apart from a registration-only completion with no auto-login.
- [`src/app/api/session/route.ts`](../src/app/api/session/route.ts) reports whether a session cookie exists and hands back the assertion's *decoded* (non-secret) claims for display; the raw, replayable JWT string itself never leaves the server. See [`src/lib/server/jwt.ts`](../src/lib/server/jwt.ts).
- [`src/app/api/profile/route.ts`](../src/app/api/profile/route.ts) and [`src/app/api/profile/password/route.ts`](../src/app/api/profile/password/route.ts) proxy profile reads/updates, attaching the session's assertion as the `Authorization: Bearer` header server-side.

The WebAuthn ceremony itself (`navigator.credentials.create`/`get`) still runs in the browser (it has to, since it needs the platform authenticator), but the credential/assertion payloads it produces are submitted the same way as any other flow input, through `/api/flow`.

Because the underlying declarative application has no OAuth 2.0 profile (see below), this same app **cannot** also sign users in through the redirect model: one application is either app-native or redirect-based, not both. If you need both, see [`react-sdk-sample`](../../react-sdk-sample) for the redirect side.

## Configuration Scenarios

Two configuration sets are available under `thunderid-config/`. Each contains a `thunderid-config.yaml` (declarative resources) and a `thunderid.env` (environment values for the YAML templates).

### `basic/`

Sets up:
- `Customer` user type (username, password, email, name fields)
- `Sample App` application using the built-in `default-flow`
- Registration enabled, recovery disabled

Required environment values:

| Variable | Description |
|----------|-------------|
| `SAMPLE_APP_FLOW_SECRET` | Flow Secret presented by this server when initiating a flow |

### `multi-auth/`

Sets up everything in `basic/`, plus:
- Google OIDC identity provider
- GitHub OAuth identity provider
- Custom multi-step authentication flows (single-step and dual-step with SMS OTP)
- Registration flows with Google, GitHub, SMS OTP, and Passkey options

Required environment values:

| Variable | Description |
|----------|-------------|
| `SAMPLE_APP_FLOW_SECRET` | Flow Secret presented by this server when initiating a flow |
| `SAMPLE_APP_GOOGLE_CLIENT_ID` | Google OAuth app client ID |
| `SAMPLE_APP_GOOGLE_CLIENT_SECRET` | Google OAuth app client secret |
| `SAMPLE_APP_GOOGLE_REDIRECT_URI` | Redirect URI registered in Google (e.g. `https://localhost:3000/`) |
| `SAMPLE_APP_GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `SAMPLE_APP_GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `SAMPLE_APP_GITHUB_REDIRECT_URI` | Redirect URI registered in GitHub |
| `SAMPLE_APP_SMS_SENDER_ID` | ID of an existing SMS notification sender configured on the server |

`SAMPLE_APP_SMS_SENDER_ID` must reference a sender already configured on the server; the YAML does not create it, and importing with a made-up value does not fail until the SMS OTP flow actually runs. There's no default sender shipped with the server, so you need to create one first:

- **Console UI** (`https://localhost:8090/console` → Connections): only Twilio and Vonage are available today, both requiring a real account with that provider.
- **Direct API call**, for local testing with no real SMS provider: create an `sms-gateway` connection, which posts the OTP to any HTTP endpoint you control (e.g. [webhook.site](https://webhook.site) for a quick, disposable inbox) instead of sending a real text.
  ```bash
  curl -sk -X POST https://localhost:8090/connections/sms-gateway \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Local Test SMS Gateway",
      "url": "https://webhook.site/<your-unique-id>",
      "httpMethod": "POST",
      "contentType": "JSON"
    }'
  ```
  `$ADMIN_TOKEN` is a bearer token for an admin session (e.g. sign in to the Console and copy the `Authorization` header from any authenticated request in your browser's network tab). The response's `id` (a UUID) is the value to use for `SAMPLE_APP_SMS_SENDER_ID`. When the SMS OTP step runs, the OTP appears in the request body posted to your webhook URL rather than a real phone.

In both scenarios, the application resource declares `type: fullstack` with **no `inboundAuthConfig`**: no OAuth 2.0 profile means it's treated as an embedded application, which is what makes it eligible for a Flow Secret in the first place. See `flowSecret: {{.SAMPLE_APP_FLOW_SECRET}}` in each `thunderid-config.yaml`.

## Supported Authentication Methods

| Method | Description |
|--------|-------------|
| Basic authentication | Username and password via `CredentialsAuthExecutor` |
| Google | Social login via `GoogleOIDCAuthExecutor` |
| GitHub | Social login via `GithubOAuthExecutor` |
| SMS OTP | One-time password via `OTPExecutor` (generate + verify modes) paired with `SMSExecutor` for delivery |
| Passkeys | FIDO2/WebAuthn via `PasskeyAuthExecutor` (challenge + verify / register modes) |

The UI adapts automatically to the options returned by the active flow, with no code changes needed when switching flows.

## Environment Configuration

Server-side only, read from `.env.local` (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `THUNDERID_SERVER_URL` | Base URL of the server (e.g. `https://localhost:8090`) |
| `THUNDERID_APPLICATION_ID` | The application ID registered on the server |
| `THUNDERID_FLOW_SECRET` | The Flow Secret issued to that application |
| `THUNDERID_SERVER_CA_CERT` | Path to the server's certificate, if it's self-signed (see below) |

None of these are prefixed with `NEXT_PUBLIC_`, so Next.js never bundles them into client-side JavaScript.

## Trusting a Self-Signed Server Certificate

This sample's flow calls run server-side (see [Architecture](#architecture-why-a-backend-for-frontend)
above), and Node's `fetch` rejects an unrecognized self-signed certificate outright with
`DEPTH_ZERO_SELF_SIGNED_CERT`; unlike a browser, there's no one-time "proceed anyway" click to fall
back on.

If this sample came from a packaged distribution, this is already handled: the build
copies that distribution's own server certificate to `certificates/server.cert`, and
[`src/lib/server/thunderid.ts`](../src/lib/server/thunderid.ts) trusts it automatically at startup
via `tls.setDefaultCACertificates()`, with ordinary certificate validation still applying everywhere
else.

From a monorepo checkout, set `THUNDERID_SERVER_CA_CERT` to the server's certificate instead. For a
server started with `make run_backend` in this repo, the generated cert lives at
`backend/cmd/server/config/certs/server.cert`:

```dotenv
THUNDERID_SERVER_CA_CERT=<repo-root>/backend/cmd/server/config/certs/server.cert
```

Setting it explicitly always takes precedence over the bundled certificate. This only matters for a
self-signed dev certificate; a server with a certificate from a trusted CA needs no extra
configuration.

Setting `NODE_EXTRA_CA_CERTS` instead does not work for this sample: `next dev --experimental-https`
overwrites it with the path to its own generated certificate before the server process starts, so
whatever value is set for the server's certificate is discarded; see
[vercel/next.js#57958](https://github.com/vercel/next.js/issues/57958). `THUNDERID_SERVER_CA_CERT` is
read directly by this sample's own code, so it isn't affected by that.

## Passkey Configuration

WebAuthn requires the server to validate that the credential was created from a trusted origin. By default, the server only allows `https://localhost:8090`. When running the sample at `https://localhost:3000`, add it to the allowed origins in the server's `deployment.yaml`:

```yaml
passkey:
  allowed_origins:
    - "https://localhost:8090"
    - "https://localhost:3000"
```

Without this, passkey registration fails with an origin validation error.

## Invite Flow Configuration

For invite-based flows (e.g. password recovery), set `inviteBaseURL` on the `InviteExecutor` node (in `generate` mode) in the flow definition. Point it to the sample's invite page:

```text
https://localhost:3000/invite
```

Without this, generated invite links fall back to the server's default Gate URL.

## UI Rendering and Action Ref Convention

Action button appearance is driven by the `ref` value of each action node. The following keywords trigger special rendering:

| Keyword in `ref` | Rendered as |
|------------------|-------------|
| `basic_auth` | Username and password form |
| `google` | "Continue with Google" with Google icon |
| `github` | "Continue with GitHub" with GitHub icon |
| `sms` or `mobile` | "Continue with SMS OTP" with SMS icon |
| `passkey` | "Sign in with Passkey" with fingerprint icon |
| `signin` or `sign_in` | "Sign In" submit button |
| `signup` or `sign_up` | "Create Account" submit button |
| `forgot_password` | "Forgot Password?" button |

Any other `ref` value is rendered as a plain button using the `ref` text as the label.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading (`next dev --experimental-https`) |
| `npm run build` | Build for production |
| `npm run start` | Start the production server (run `build` first) |
| `npm run lint` | Run ESLint |

## Hosting

This app cannot be exported as static files: `/api/flow`, `/api/session`, and `/api/profile` run as server routes holding the Flow Secret and the session cookie. Deploy it anywhere that runs a Node.js server (`npm run build && npm run start`, or a platform with native Next.js support), and set `THUNDERID_SERVER_URL`, `THUNDERID_APPLICATION_ID`, and `THUNDERID_FLOW_SECRET` as server-side environment variables there.
