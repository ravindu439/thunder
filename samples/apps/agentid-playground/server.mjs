// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// ThunderID Agent Identity Playground.
//
// One app, three agent authentication postures, each on its own tab:
//
//   /self   the Concierge acts as itself       sub = agent,    no act
//   /obo    the Concierge acts for John         sub = John,     act = Concierge
//   /chain  the Concierge delegates to a worker sub = customer, act = worker -> Concierge
//
// The cast is a travel-booking one: a Concierge agent, a worker it delegates to, and a customer.
//
//   npm start
//   open http://localhost:8082
//
// Set SCENARIOS to run a subset (for example SCENARIOS=self,chain), which is useful when you have
// only imported some of the resources or want a single posture on screen. Everything else lives in
// config.json and the environment (see .env.example). No dependencies: Node's built-in modules only.

import {createServer} from "node:http";
import {readFileSync} from "node:fs";
import {randomUUID} from "node:crypto";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

import {createTokenClient} from "./lib/http.mjs";
import {checkBackend, checkAgents} from "./lib/readiness.mjs";
import {resourceSlice, allResourceIds} from "./lib/resources.mjs";
import {page, tabs, steps, esc, errorBox} from "./lib/render.mjs";
import self from "./scenarios/self.mjs";
import obo from "./scenarios/obo.mjs";
import chain from "./scenarios/chain.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ALL_SCENARIOS = [self, obo, chain];

const APP_TITLE = "Agent Identity Playground";

// --- config ----------------------------------------------------------------

const file = JSON.parse(readFileSync(resolve(__dirname, "config.json"), "utf8"));
// THUNDERID_BASE_URL from the environment (see .env.example) overrides config.json.
const config = {...file, thunderidBaseUrl: process.env.THUNDERID_BASE_URL || file.thunderidBaseUrl};
const PORT = Number(process.env.PORT) || Number(new URL(config.appBaseUrl).port) || 8082;

const requested = (process.env.SCENARIOS || ALL_SCENARIOS.map((s) => s.id).join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const unknown = requested.filter((id) => !ALL_SCENARIOS.some((s) => s.id === id));
if (unknown.length) {
  console.error(
    `[agentid-playground] unknown scenario(s): ${unknown.join(", ")}. ` +
      `Valid ids: ${ALL_SCENARIOS.map((s) => s.id).join(", ")}`,
  );
  process.exit(1);
}
const scenarios = ALL_SCENARIOS.filter((s) => requested.includes(s.id));

// The obo login sends the browser to appBaseUrl/callback, which has to match the redirect URI
// registered on the agent. Serving on a different port silently breaks that, so say so up front.
const configuredPort = Number(new URL(config.appBaseUrl).port);
if (scenarios.includes(obo) && configuredPort && PORT !== configuredPort) {
  console.warn(
    `[agentid-playground] PORT=${PORT} does not match appBaseUrl (${config.appBaseUrl}). ` +
      `The obo login will still use ${config.appBaseUrl}/callback as its redirect URI, so it will ` +
      `fail. Update appBaseUrl and the agent's redirectUris together, or drop obo from SCENARIOS.`,
  );
}

// Every agent a scenario needs must have credentials in config.json, and every document it offers
// for download must exist in the resource file. Both drift silently when the cast is renamed, so
// fail at startup with the missing name rather than at request time with a property access.
const configuredIds = new Set(allResourceIds());
const wiring = scenarios.flatMap((s) => [
  ...s.requires.filter((r) => !config.agents[r.key]).map((r) => `${s.id}: no "${r.key}" in config.json agents`),
  ...s.resourceIds.filter((id) => !configuredIds.has(id)).map((id) => `${s.id}: no "${id}" in thunderid-config/thunderid-config.yaml`),
]);
if (wiring.length) {
  console.error(`[agentid-playground] configuration is out of sync:\n  ${wiring.join("\n  ")}`);
  process.exit(1);
}

const client = createTokenClient(config.thunderidBaseUrl);

// --- sessions --------------------------------------------------------------
//
// In-memory and cookie-keyed, enough to run locally. Only the obo scenario uses one.

const sessions = new Map();

// Every request without a recognised cookie creates a session, including favicon and 404s, so a
// client that does not keep cookies would otherwise grow this map for the life of the process.
const SESSION_TTL_MS = 60 * 60 * 1000;

function getSession(req, res) {
  const now = Date.now();
  for (const [id, existing] of sessions) {
    if (now - existing.lastSeen > SESSION_TTL_MS) sessions.delete(id);
  }

  const sid = /(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie ?? "")?.[1];
  const known = sid ? sessions.get(sid) : undefined;
  if (known) {
    known.lastSeen = now;
    return known;
  }

  const fresh = randomUUID();
  sessions.set(fresh, {lastSeen: now});
  res.setHeader("Set-Cookie", `sid=${fresh}; HttpOnly; Path=/; SameSite=Lax`);
  return sessions.get(fresh);
}

// --- pages -----------------------------------------------------------------

function scenarioPage(scenario, body, hostOk = true) {
  return page({
    title: `${APP_TITLE} · ${scenario.title}`,
    eyebrow: scenario.nav,
    heading: scenario.title,
    lead: scenario.lead,
    host: config.thunderidBaseUrl,
    hostOk,
    appName: APP_TITLE,
    nav: tabs(scenarios, scenario.id),
    body,
  });
}

// --- try it out ------------------------------------------------------------
//
// The app has to be worth opening before anything is imported, so each tab checks its own
// prerequisites, names the missing one, and only then offers the run button.

async function readiness(scenario, ctx) {
  const backend = await checkBackend(client);
  if (!backend.ok) return {backend, agents: null, extra: null, ready: false};

  const agents = await checkAgents(client, scenario.requires, config.agents);
  // A throwing check should fail its own step, not blank the page it was meant to explain.
  let extra = null;
  if (agents.ok && scenario.check) {
    try {
      extra = await scenario.check(ctx);
    } catch (err) {
      extra = {ok: false, detail: err instanceof Error ? err.message : String(err)};
    }
  }
  return {backend, agents, extra, ready: agents.ok && (!extra || extra.ok)};
}

// Step 2 is completed by the reader, never by the app. The automatic detection still runs and is
// reported here, but only as information: some prerequisites cannot be proven without using them
// (John's existence, for one), so the reader is the one who says the import is done.
function importStep(scenario, state, override) {
  const download = `<a class="btn${override ? "" : " primary"}" href="/resources/${scenario.id}.yaml" download>Download ${scenario.id}.yaml</a>`;
  const confirm = `<a class="btn" href="/${scenario.id}/skip-check">I have imported it, mark as ready</a>`;
  const undo = `<a class="btn" href="/${scenario.id}/recheck">Undo</a>`;
  const note =
    "Import the resource file into ThunderID (Console -> Import, or <code>POST /import</code>). It " +
    "declares everything this tab uses, with the client IDs and secrets already in " +
    "<code>config.json</code>. Import is upsert by id, so the tabs' overlapping slices are safe to " +
    "import one after another. Mark this done when you have imported it.";
  const extraNote = scenario.importNote ? scenario.importNote(config) : "";

  // What detection found, phrased as an observation rather than a verdict.
  let detail;
  if (!state.backend.ok) {
    detail = "Nothing detected yet: ThunderID has to answer first.";
  } else if (state.agents.ok && (!state.extra || state.extra.ok)) {
    const found = esc(state.agents.results.map((r) => r.id).join(", "));
    detail = `Detected: ${found}${state.extra?.detail ? ` · ${esc(state.extra.detail)}` : ""}`;
  } else {
    const failures = state.agents?.results?.filter((r) => !r.ok) ?? [];
    detail =
      "Not detected: " +
      (failures.length
        ? failures.map((r) => `${esc(r.id)}: ${esc(r.detail)}`).join("<br/>")
        : esc(state.extra?.detail ?? ""));
  }

  return {
    n: 2,
    state: override ? "done" : state.backend.ok ? "active" : "todo",
    title: "Import the playground resources",
    tag: override ? "confirmed" : "not confirmed",
    tagKind: override ? "ok" : "",
    note,
    detail,
    actions: (override ? download + undo : download + confirm) + extraNote,
  };
}

function runStep(scenario, state, hasResult, unlocked) {
  const href = scenario.run.href ?? `/${scenario.id}?run=1`;
  const enabled = unlocked;
  const button = enabled
    ? `<a class="btn primary" href="${href}">${esc(scenario.run.label)}</a>`
    : `<span class="btn" disabled>${esc(scenario.run.label)}</span>`;
  return {
    n: scenario.run.n ?? 3,
    state: hasResult ? "done" : enabled ? "active" : "todo",
    title: "Run it",
    tag: hasResult ? "done" : enabled ? "ready" : "blocked",
    tagKind: hasResult ? "ok" : enabled ? "ok" : "",
    note: scenario.run.note,
    actions: hasResult ? `${button}<span class="muted">Claims are below.</span>` : button,
  };
}

function tryItOut(scenario, state, hasResult, gate, override, unlocked) {
  const connection = state.backend.ok
    ? {
        n: 1,
        state: "done",
        title: "ThunderID is running",
        tag: "connected",
        tagKind: "ok",
        note: `Reached <code>${esc(config.thunderidBaseUrl)}</code>.`,
        detail: esc(state.backend.detail),
      }
    : {
        n: 1,
        state: "failed",
        title: "ThunderID is running",
        tag: "unreachable",
        tagKind: "bad",
        note: `Nothing answered at <code>${esc(config.thunderidBaseUrl)}</code>.`,
        detail: esc(state.backend.detail),
        actions:
          `<a class="btn primary" href="/${scenario.id}">Check again</a>` +
          `<ul class="fixes">
  <li>Start ThunderID and confirm it answers on ${esc(config.thunderidBaseUrl)}.</li>
  <li>Point the app somewhere else with <code>THUNDERID_BASE_URL</code> in <code>.env</code>.</li>
</ul>`,
      };

  // A tab needing its own sign-in contributes an extra step between importing and running.
  const gateStep = gate ? [gate.step] : [];
  const count = 2 + gateStep.length + 1;
  return `<section${unlocked ? "" : ' class="blocked"'}>
  <h2>Try it out</h2>
  <p class="sub">${count} steps, checked live against your instance. Nothing is cached, so reload any time to recheck.</p>
  ${steps([
    connection,
    importStep(scenario, state, override),
    ...gateStep,
    runStep(scenario, state, hasResult, unlocked && (!gate || gate.ok)),
  ])}
</section>`;
}

function overviewPage(backend) {
  const cards = scenarios
    .map(
      (s) => `<a class="card" href="/${s.id}">
  <div class="card-icon">${s.icon}</div>
  <h3>${esc(s.title)}</h3>
  <p>${esc(s.blurb)}</p>
  <div class="shape">${s.shape.map((v) => `<code>${esc(v)}</code>`).join("")}</div>
</a>`,
    )
    .join("");

  const rows = scenarios
    .map(
      (s) => `<tr>
  <td><a href="/${s.id}">${esc(s.title)}</a></td>
  <td><code>${esc(s.compare.sub)}</code></td>
  <td><code>${esc(s.compare.act)}</code></td>
  <td><code>${esc(s.compare.grant)}</code></td>
</tr>`,
    )
    .join("");

  return page({
    title: APP_TITLE,
    eyebrow: "Overview",
    heading: APP_TITLE,
    lead:
      `Three ways an AI agent can hold identity, against <code>${esc(config.thunderidBaseUrl)}</code>. ` +
      "Each tab runs the real flow and decodes the tokens ThunderID issues, nothing is added. The " +
      "difference between the three is entirely in who the token names.",
    host: config.thunderidBaseUrl,
    hostOk: backend.ok,
    appName: APP_TITLE,
    nav: tabs(scenarios, "overview"),
    body: `<div class="cards">${cards}</div>
<section>
  <h2>Who the token names</h2>
  <p class="sub">The subject (<code>sub</code>) is the principal the work is for. The actor (<code>act</code>) is whoever is carrying it out on the subject's behalf.</p>
  <table>
    <thead><tr><th>Scenario</th><th>sub</th><th>act</th><th>Grant</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>
<section${backend.ok ? "" : ' class="blocked"'}>
  <h2>Before you start</h2>
  <p class="sub">Each tab checks its own prerequisites and walks you through them. If you would rather set everything up in one go, import the whole resource file.</p>
  ${steps([
    backend.ok
      ? {n: 1, state: "done", title: "ThunderID is running", tag: "connected", tagKind: "ok", note: `Reached <code>${esc(config.thunderidBaseUrl)}</code>.`, detail: esc(backend.detail)}
      : {n: 1, state: "failed", title: "ThunderID is running", tag: "unreachable", tagKind: "bad", note: `Nothing answered at <code>${esc(config.thunderidBaseUrl)}</code>.`, detail: esc(backend.detail), actions: `<a class="btn primary" href="/">Check again</a>`},
    {
      n: 2,
      state: "active",
      title: "Import everything at once",
      note: "Declares all five agents the three tabs use. Import it into ThunderID (Console -> Import, or <code>POST /import</code>), then pick a tab.",
      actions: `<a class="btn" href="/resources/all.yaml" download>Download thunderid-config.yaml</a>`,
    },
  ])}
</section>
<p class="muted" style="margin: 18px 2px 0;">Every token on these tabs is decoded from a live response. Nothing is added, nothing is faked.</p>`,
  });
}

// --- resource downloads ----------------------------------------------------

function resourceDownload(res, name) {
  const scenario = scenarios.find((s) => s.id === name);
  const yaml =
    name === "all"
      ? resourceSlice(scenarios.flatMap((s) => s.resourceIds), {
          title: "every Agent Identity Playground scenario",
          note: "All agents used by the self, obo, and chain tabs.",
        })
      : resourceSlice(scenario.resourceIds, scenario.resource);
  const filename = name === "all" ? "thunderid-config.yaml" : `${name}.yaml`;
  res.writeHead(200, {
    "Content-Type": "application/yaml; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
  });
  res.end(yaml);
}

// --- routing ---------------------------------------------------------------

const routes = new Map();
for (const scenario of scenarios) {
  for (const [key, handler] of Object.entries(scenario.routes ?? {})) {
    routes.set(key, {scenario, handler});
  }
}

// no-store because every page re-runs the readiness checks: a cached page would report stale state
// after an import, which is exactly the moment the user hits reload.
const send = (res, status, html) => {
  res.writeHead(status, {"Content-Type": "text/html", "Cache-Control": "no-store"});
  res.end(html);
};

const redirect = (res, location) => {
  res.writeHead(302, {Location: location});
  res.end();
};

async function handleRequest(req, res) {
  const session = getSession(req, res);
  const url = new URL(req.url ?? "/", config.appBaseUrl);
  req.resume(); // drain any request body we don't read

  const route = routes.get(`${req.method} ${url.pathname}`);
  const scenario = route?.scenario ?? scenarios.find((s) => url.pathname === `/${s.id}`);
  const ctx = {
    req,
    res,
    url,
    session,
    config,
    client,
    send,
    redirect,
    sendPage: (body, status = 200) => send(res, status, scenarioPage(scenario, body)),
  };

  try {
    if (route) return await route.handler(ctx);

    // The page declares no icon, so browsers ask for this on every load. Answering it here keeps
    // that request from falling through to the 404 page, which would probe the backend each time.
    if (url.pathname === "/favicon.ico") {
      res.writeHead(204);
      return res.end();
    }

    const toggle = /^\/([a-z]+)\/(skip-check|recheck)$/.exec(url.pathname);
    if (toggle && scenarios.some((s) => s.id === toggle[1])) {
      session.overrides ??= {};
      if (toggle[2] === "skip-check") session.overrides[toggle[1]] = true;
      else delete session.overrides[toggle[1]];
      return redirect(res, `/${toggle[1]}`);
    }

    const download = /^\/resources\/([a-z]+)\.yaml$/.exec(url.pathname)?.[1];
    if (download && (download === "all" || scenarios.some((s) => s.id === download))) {
      return resourceDownload(res, download);
    }

    if (scenario) {
      const state = await readiness(scenario, ctx);
      // state.ready is detection, which informs step 2 but never completes it.
      const override = Boolean(session.overrides?.[scenario.id]);
      const unlocked = override;
      const hasResult = scenario.hasResult
        ? scenario.hasResult(ctx)
        : url.searchParams.get("run") === "1";
      const gate = unlocked && scenario.gate ? scenario.gate(ctx) : null;
      const canRun = unlocked && (!gate || gate.ok);
      const results = canRun && hasResult ? await scenario.render(ctx) : "";
      const body =
        scenario.explain() +
        tryItOut(scenario, state, hasResult, gate, override, unlocked) +
        results;
      return send(res, 200, scenarioPage(scenario, body, state.backend.ok));
    }

    const backend = await checkBackend(client);
    if (url.pathname === "/") return send(res, 200, overviewPage(backend));
    return send(res, 404, overviewPage(backend));
  } catch (err) {
    const body = errorBox(err);
    return send(res, 500, scenario ? scenarioPage(scenario, body) : page({
      title: APP_TITLE,
      heading: APP_TITLE,
      lead: "Something went wrong handling this request.",
      host: config.thunderidBaseUrl,
      appName: APP_TITLE,
      nav: tabs(scenarios, "overview"),
      body,
    }));
  }
}

createServer(handleRequest).listen(PORT, () => {
  console.log(
    `[agentid-playground] listening on http://localhost:${PORT} -> ${config.thunderidBaseUrl}\n` +
      `[agentid-playground] scenarios: ${scenarios.map((s) => s.id).join(", ")}`,
  );
});
