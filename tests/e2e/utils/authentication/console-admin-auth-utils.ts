// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Console Admin Authentication Utilities for Playwright E2E Tests.
 *
 * This module provides utilities to manage authenticated sessions specifically for the
 * Console admin user in end-to-end tests using Playwright.
 *
 * This application uses OAuth2/OIDC token-based authentication stored in sessionStorage,
 * NOT cookies. Therefore, we need to inject tokens via page.addInitScript() to ensure
 * they're available before the page loads.
 *
 * SECURITY NOTE: Do NOT log credentials (username/password) to the console in this file
 * or any consumers of this file to prevent leaking secrets in CI logs.
 *
 * @module authentication/console-admin-auth-utils
 */
import fs from "fs";
import path from "path";
import { Page, BrowserContext } from "@playwright/test";
import { Timeouts } from "../../constants/timeouts";
import { ConsoleSigninPage } from "../../pages/authentication/console-signin.page";

/** Re-login this far ahead of the real expiry, so a token can't lapse mid-test. */
const TOKEN_EXPIRY_MARGIN_MS = Timeouts.GLOBAL_TEST;

export interface StorageItem {
  name: string;
  value: string;
}

export interface CookieItem {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export interface AuthState {
  cookies: CookieItem[];
  origins: Array<{
    origin: string;
    localStorage?: StorageItem[];
    sessionStorage?: StorageItem[];
  }>;
}

export interface SetupAuthenticationOptions {
  debug?: boolean;
  authFilePath?: string;
}

/**
 * Load authentication state from file
 */
export function loadAuthState(filePath: string, debug: boolean = false): AuthState {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Authentication state file not found: ${filePath}`);
  }
  const authState = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (debug) {
    console.log("🔍 [DEBUG] Auth file path:", filePath);
    console.log("🔍 [DEBUG] Cookies in auth state:", authState.cookies?.length || 0);
    console.log("🔍 [DEBUG] LocalStorage items:", authState.origins?.[0]?.localStorage?.length || 0);
    console.log("🔍 [DEBUG] SessionStorage items:", authState.origins?.[0]?.sessionStorage?.length || 0);
  }

  return authState;
}

/**
 * Restore cookies to browser context (if any exist)
 */
export async function restoreCookies(
  context: BrowserContext,
  authState: AuthState,
  debug: boolean = false
): Promise<void> {
  if (!authState.cookies || authState.cookies.length === 0) {
    if (debug) {
      console.log("🔍 [DEBUG] No cookies in auth state (app uses token-based auth)");
    }
    return;
  }

  // Restore by `url` rather than the captured `domain`/`path`. Firefox's cookie manager
  // round-trips its own `domain` field inconsistently between captures (e.g. "localhost" vs
  // ".localhost" for the same cookie) and then rejects its own output on replay with
  // NS_ERROR_ILLEGAL_VALUE. Every cookie here is first-party to the one origin captured
  // alongside it, so `url` lets each browser derive scope itself instead of us replaying a
  // browser-reported domain value back into that same browser's stricter validator.
  const origin = authState.origins?.[0]?.origin;
  const cookies = authState.cookies.map(({ name, value, expires, httpOnly, secure, sameSite }) => ({
    name,
    value,
    expires,
    httpOnly,
    secure,
    sameSite,
    url: origin,
  }));

  await context.addCookies(cookies);
  console.log(`✅ Cookies restored: ${cookies.length} cookies added to context`);
}

/**
 * Create init script to inject storage state BEFORE page loads
 * This is critical for OAuth2/OIDC apps that check tokens on page load
 */
export function createStorageInitScript(authState: AuthState): string {
  const origin = authState.origins?.[0];
  if (!origin) {
    return "";
  }

  const localStorage = origin.localStorage || [];
  const sessionStorage = origin.sessionStorage || [];

  // Create a script that injects storage items
  const script = `
    (function() {
      // Inject localStorage items
      ${localStorage
        .map(
          item =>
            `try { localStorage.setItem(${JSON.stringify(item.name)}, ${JSON.stringify(item.value)}); } catch(e) {}`
        )
        .join("\n      ")}
      
      // Inject sessionStorage items
      ${sessionStorage
        .map(
          item =>
            `try { sessionStorage.setItem(${JSON.stringify(item.name)}, ${JSON.stringify(item.value)}); } catch(e) {}`
        )
        .join("\n      ")}
    })();
  `;

  return script;
}

/**
 * Setup authentication for a test by loading and injecting auth state.
 * If auth file doesn't exist or tokens are expired, performs inline login.
 */
export async function setupAuthentication(
  page: Page,
  baseUrl: string,
  options: SetupAuthenticationOptions = {}
): Promise<void> {
  const { debug = false, authFilePath } = options;

  // Default auth file path. Keyed by worker index: the backend rotates refresh tokens and
  // revokes the whole token family if a used one is replayed (see refresh_token.go), so two
  // workers sharing one file can race a silent refresh and lock each other out. Workers run
  // their tests sequentially, so a per-worker file never sees that race.
  const workerIndex = process.env.TEST_PARALLEL_INDEX ?? "0";
  const defaultAuthPath = path.join(__dirname, `../../playwright/.auth/console-admin-${workerIndex}.json`);
  const authPath = authFilePath || defaultAuthPath;

  console.log("Setting up authentication...");

  if (debug) {
    console.log("🔍 [DEBUG] Debug mode enabled");
    console.log("🔍 [DEBUG] Base URL:", baseUrl);
  }

  // Missing, unreadable and expired all mean the same thing here: log in and rewrite the file.
  const authState = loadAuthStateNoThrow(authPath, debug);

  if (!authState) {
    console.log("⚠️ No usable auth state, performing inline login...");
    await performInlineLogin(page, baseUrl, authPath, debug);
    return;
  }

  if (checkTokensExpired(authState, debug)) {
    console.log("⚠️ Tokens expired, performing inline login...");
    await performInlineLogin(page, baseUrl, authPath, debug);
    return;
  }

  console.log(
    `Loaded auth state: ${authState.origins?.[0]?.localStorage?.length || 0} localStorage, ${authState.origins?.[0]?.sessionStorage?.length || 0} sessionStorage items`
  );

  // Get the browser context
  const context = page.context();

  // Restore cookies if any exist
  await restoreCookies(context, authState, debug);

  // CRITICAL: Add init script to inject storage BEFORE page loads. checkTokensExpired above
  // already confirmed the token isn't expired, and the test itself navigates to its real target
  // route right after this fixture resolves - that navigation is what applies this init script,
  // so there's no need to load the console here too just to re-check what it would find.
  const initScript = createStorageInitScript(authState);
  if (initScript) {
    await context.addInitScript(initScript);
    if (debug) {
      console.log("🔍 [DEBUG] Added init script to inject storage on page load");
    }
  }
}

/**
 * Load auth state without throwing - returns null on error
 */
function loadAuthStateNoThrow(filePath: string, debug: boolean): AuthState | null {
  try {
    return loadAuthState(filePath, debug);
  } catch (error) {
    if (debug) {
      console.error("⚠️ [DEBUG] Failed to load auth state from file:", filePath, error);
    }
    return null;
  }
}

/**
 * Check if tokens in auth state are expired
 */
function checkTokensExpired(authState: AuthState, debug: boolean): boolean {
  const sessionDataKey = authState.origins?.[0]?.sessionStorage?.find(item =>
    item.name.includes("session_data-instance_0")
  );

  if (!sessionDataKey) {
    return true; // No session data = expired
  }

  try {
    const sessionData = JSON.parse(sessionDataKey.value);
    if (sessionData.access_token && sessionData.created_at && sessionData.expires_in) {
      const expirationTime = sessionData.created_at + sessionData.expires_in * 1000;
      // Treat a token that expires during the test as already expired - reusing one with seconds
      // left buys nothing and costs a mid-test 401 that reads as a product failure.
      const isExpired = Date.now() + TOKEN_EXPIRY_MARGIN_MS >= expirationTime;
      if (debug) {
        const timeLeft = Math.round((expirationTime - Date.now()) / 1000 / 60);
        console.log(`🔍 [DEBUG] Token expires in: ${timeLeft} minutes`);
      }
      return isExpired;
    }
  } catch (error) {
    if (debug) {
      console.error("🔍 [DEBUG] Failed to parse session data for token expiry check:", {
        error,
      });
    }
    return true;
  }
  return true;
}

/**
 * Wait for redirect to the console page, then for the SDK to actually write the session it
 * establishes there - checkTokensExpired() reads this same sessionStorage key, and
 * saveAuthState() would otherwise capture storage before the token exists.
 */
async function waitForSessionData(page: Page): Promise<void> {
  await page.waitForURL("**/console/**", { timeout: Timeouts.REDIRECT });

  // The welcome key is the later of the two: WelcomeRedirect marks itself dismissed in
  // sessionStorage the first time a signed-in session renders a non-/welcome route (see
  // WelcomeRedirect.tsx), which is a useEffect that only runs once the session token exists.
  // Capturing state before that effect commits replays a session that looks brand new to every
  // consumer of this file, redirecting whatever page they navigate to next into /welcome instead
  // of the page the test actually asked for. Both are still checked because a retried sign-in
  // starts with the previous attempt's welcome key already in storage.
  await page.waitForFunction(
    () => {
      const keys = Object.keys(sessionStorage);
      return (
        keys.some(key => key.includes("session_data-instance_0")) &&
        keys.some(key => key.endsWith(":welcome:dismissed"))
      );
    },
    undefined,
    { timeout: Timeouts.PAGE_LOAD }
  );
}

/**
 * Perform inline login when auth file doesn't exist or tokens expired
 */
async function performInlineLogin(page: Page, baseUrl: string, authPath: string, debug: boolean): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      `ADMIN_USERNAME and ADMIN_PASSWORD environment variables are required for inline login.
Please ensure they are set in your .env file or the test environment configuration.`
    );
  }

  console.log("🔐 Performing inline login...");

  // Enter through /console rather than the sign-in route: it's the console's own redirect into
  // the OAuth2 flow that ends with the SDK writing a session, which is what this function is for.
  const signinPage = new ConsoleSigninPage(page, baseUrl);
  await signinPage.gotoHome();
  await signinPage.login(username, password);

  try {
    await waitForSessionData(page);
  } catch {
    // The @thunderid SDK has an unguarded race: ThunderIDProvider's and ProtectedRoute's own
    // sign-in effects can each exchange the same single-use authorization code, and the loser
    // gets a 400 invalid_grant with no session ever written - no amount of waiting recovers
    // from that. Re-visiting /console rides the IdP's SSO cookie (see
    // backend/internal/flow/session/transport.go) to a fresh code without re-entering credentials.
    console.log(
      "⚠️ Sign-in did not settle (SDK code-exchange race, or the welcome effect never committed), retrying..."
    );
    await signinPage.gotoHome();
    await waitForSessionData(page);
  }

  console.log("✅ Inline login successful!");

  // Save auth state for future tests
  await saveAuthState(page, baseUrl, authPath, debug);
}

/**
 * Save authentication state to file
 */
async function saveAuthState(page: Page, baseUrl: string, authPath: string, debug: boolean): Promise<void> {
  const context = page.context();
  const authDir = path.dirname(authPath);

  // Ensure directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const cookies = await context.cookies();
  // context.storageState() would cover the cookies and localStorage, but never sessionStorage -
  // which is where this app's tokens live - so both are read here in one round trip instead.
  const { localStorage, sessionStorage } = await page.evaluate(() => {
    const entries = (storage: Storage) => Object.entries({ ...storage }).map(([name, value]) => ({ name, value }));
    return { localStorage: entries(window.localStorage), sessionStorage: entries(window.sessionStorage) };
  });

  const storageState = {
    cookies,
    origins: [
      {
        origin: baseUrl,
        localStorage,
        sessionStorage,
      },
    ],
  };

  fs.writeFileSync(authPath, JSON.stringify(storageState, null, 2));
  console.log("💾 Auth state saved to:", authPath);

  if (debug) {
    console.log(
      `🔍 [DEBUG] Saved: ${cookies.length} cookies, ${localStorage.length} localStorage, ${sessionStorage.length} sessionStorage`
    );
  }
}
