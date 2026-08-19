// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Shared HTML rendering: one page shell, one stylesheet, one set of building blocks that every
// scenario reuses. Scenarios return fragments; the shell wraps them.
//
// Drop-in replacement for lib/render.mjs. Same exports and same class names, restyled:
//   - light/dark theme with a header toggle (persisted in localStorage)
//   - staged entrance animation on the flow diagram, replayable
//   - claim rows can be flagged as changed, for the refresh diff
//
// Strings passed as `label`, `note`, and `subtitle` are author-written literals and may contain
// markup (a <code> span, a <br/> in a flow edge). Anything derived from a token is escaped.

import {decodeJwt, actorChain} from "./jwt.mjs";

// The ThunderID mark, from docs/static/assets/images/logo-mini.svg, shown in the dashboard header
// only. Inlined so the page stays self-contained, with the dark path driven by a variable so it
// flips white in dark mode exactly as the shipped logo-mini-inverted.svg does.
const LOGO = `<svg viewBox="0 0 207 257" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M55.4763 26.4391L58.8866 0H0V26.4391H55.4763Z" fill="var(--logo-ink)"/><path d="M39.8438 147.407L49.5455 72.2839H4.9909e-05V256.743H60.5602L80.048 147.407H39.8438Z" fill="#3688FF"/><path d="M192.42 59.361C182.782 40.2307 168.929 25.5705 150.903 15.3381C145.501 12.2662 139.761 9.6605 133.703 7.5208L115.401 103.702H159.757L76.2987 256.743H83.3735C109.449 256.743 131.69 251.574 150.14 241.236C168.569 230.897 182.634 216.131 192.356 196.959C202.058 177.765 206.909 154.8 206.909 128.043C206.909 101.286 202.079 78.5123 192.441 59.3821L192.42 59.361Z" fill="#3688FF"/></svg>`;

// Quotes are escaped too, because esc is also used inside double-quoted attributes (the copy
// button's data-copy), where an unescaped quote would end the attribute early.
export const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c],
  );

const STYLES = `
  :root {
    --bg:#f6f5f2; --panel:#fff; --panel2:#faf9f6; --line:#e5e2db; --line2:#efece5;
    --ink:#141413; --ink2:#57564f; --ink3:#8b8981;
    --brand:#5b3df5; --brand-soft:#efeaff;
    --subject:#2563eb; --subject-soft:#e8efff;
    --actor:#c2700a; --actor-soft:#fdf1de;
    --resource:#08805a; --resource-soft:#e3f5ee;
    --hl:#fff7dd; --ok-bg:#e6f5ec; --ok-ink:#14683a;
    --warn-bg:#fdf4d9; --warn-ink:#7a5606; --err-bg:#fdeceb; --err-ink:#a8201c;
    --code-bg:#f2f1ec; --logo-ink:#05213F;
    --shadow:0 1px 2px rgba(20,20,19,.05), 0 10px 28px -16px rgba(20,20,19,.28);
  }
  html[data-theme="dark"] {
    --bg:#0c0e11; --panel:#14171c; --panel2:#191d23; --line:#262b33; --line2:#1e232a;
    --ink:#e9eaec; --ink2:#a5aab3; --ink3:#737985;
    --brand:#9d8bff; --brand-soft:#201c3a;
    --subject:#6ba5fb; --subject-soft:#12243c;
    --actor:#f0b445; --actor-soft:#2d2211;
    --resource:#3ddba0; --resource-soft:#0d2a21;
    --hl:#2b2513; --ok-bg:#0f2a1c; --ok-ink:#6fe3a6;
    --warn-bg:#2d2410; --warn-ink:#f0cb70; --err-bg:#2d1416; --err-ink:#ff9a95;
    --code-bg:#1b1f26; --logo-ink:#fff;
    --shadow:0 1px 2px rgba(0,0,0,.5), 0 14px 34px -18px rgba(0,0,0,.8);
  }
  * { box-sizing: border-box; }
  html { background: var(--bg); }
  body {
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: "IBM Plex Sans", system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  code, pre { font-family: "IBM Plex Mono", ui-monospace, monospace; }
  a { color: var(--brand); text-decoration: none; }
  a:hover { color: var(--ink); }

  .topbar { position: sticky; top: 0; z-index: 20; background: var(--panel); border-bottom: 1px solid var(--line); }
  .topbar .row { max-width: 1120px; margin: 0 auto; padding: 14px 28px; display: flex; align-items: center; gap: 18px; }
  .brand { display: flex; align-items: center; gap: 10px; margin-right: auto; }
  .brand .mark { display: block; width: 22px; height: 27px; }
  .brand .mark svg { display: block; width: 100%; height: 100%; }
  .brand .name { font-size: 14px; font-weight: 600; letter-spacing: -.01em; display: block; }
  .brand .host { font-size: 11px; color: var(--ink3); }
  .status { display: flex; align-items: center; gap: 7px; font-size: 12px; font-family: "IBM Plex Mono", monospace; color: var(--ink2); background: var(--panel2); border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; }
  .status .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--resource); animation: pulseDot 2s ease-in-out infinite; }
  .theme-toggle { font: inherit; font-size: 13px; width: 34px; height: 34px; display: grid; place-items: center; background: var(--panel2); border: 1px solid var(--line); border-radius: 10px; cursor: pointer; color: var(--ink2); }
  .theme-toggle:hover { border-color: var(--ink3); color: var(--ink); }

  main { max-width: 1120px; margin: 0 auto; padding: 36px 28px 96px; }
  h1 { margin: 0 0 10px; font-size: 34px; line-height: 1.12; letter-spacing: -.025em; font-weight: 600; max-width: 20ch; }
  .lead { margin: 0; font-size: 15px; line-height: 1.6; color: var(--ink2); max-width: 68ch; text-wrap: pretty; }
  .eyebrow { margin: 0 0 8px; font-size: 11px; font-weight: 600; letter-spacing: .09em; text-transform: uppercase; color: var(--brand); }
  .muted { color: var(--ink3); font-size: 12px; }

  nav.tabs { max-width: 1120px; margin: 0 auto; padding: 0 28px; display: flex; gap: 2px; flex-wrap: wrap; }
  nav.tabs a { font-size: 13px; color: var(--ink3); border-bottom: 2px solid transparent; padding: 10px 14px 12px; white-space: nowrap; }
  nav.tabs a:hover { color: var(--ink); }
  nav.tabs a.active { color: var(--ink); font-weight: 600; border-bottom-color: var(--brand); }

  section { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 20px 24px 22px; margin: 18px 0 0; box-shadow: var(--shadow); animation: riseIn .45s ease both; }
  section h2 { margin: 0 0 6px; font-size: 16px; font-weight: 600; letter-spacing: -.015em; }
  section .sub { margin: 0 0 16px; font-size: 13px; line-height: 1.6; color: var(--ink2); max-width: 82ch; text-wrap: pretty; }
  h3 { margin: 18px 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .07em; color: var(--ink3); font-weight: 600; }

  table { width: 100%; border-collapse: collapse; border: 1px solid var(--line2); border-radius: 10px; overflow: hidden; }
  th { text-align: left; font-size: 11px; letter-spacing: .07em; text-transform: uppercase; color: var(--ink3); font-weight: 600; padding: 8px 12px; border-bottom: 1px solid var(--line); background: var(--panel2); }
  td { padding: 7px 12px; border-bottom: 1px solid var(--line2); font-family: "IBM Plex Mono", monospace; font-size: 12px; vertical-align: top; word-break: break-word; color: var(--ink); }
  td:first-child { width: 190px; color: var(--ink2); }
  tr.hl { background: var(--hl); }
  tr.hl td:first-child { color: var(--ink); }
  tr.changed { background: var(--brand-soft); animation: flashRow 1.6s ease 1.1s forwards; }
  tr.changed td:first-child::after { content: "changed"; float: right; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; color: var(--brand); }

  pre { margin: 0; background: var(--code-bg); border-radius: 10px; padding: 13px 15px; font-size: 12px; line-height: 1.6; overflow-x: auto; color: var(--ink); }
  pre.tok { white-space: pre-wrap; word-break: break-all; font-size: 11.5px; line-height: 1.7; color: var(--ink2); }

  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 32px 0 0; }
  @media (max-width: 860px) { .cards { grid-template-columns: 1fr; } }
  .card { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 20px; color: var(--ink); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 10px; animation: riseIn .5s ease both; }
  .card:hover { border-color: var(--brand); transform: translateY(-2px); color: var(--ink); }
  .card .card-icon { font-size: 26px; line-height: 1; }
  .card h3 { margin: 0; font-size: 16px; font-weight: 600; letter-spacing: -.01em; text-transform: none; color: var(--ink); }
  .card p { margin: 0; font-size: 13px; line-height: 1.55; color: var(--ink2); text-wrap: pretty; }
  .card .shape { display: flex; flex-wrap: wrap; gap: 6px; margin-top: auto; padding-top: 6px; }
  .card .shape code { font-size: 11px; background: var(--subject-soft); color: var(--subject); padding: 3px 8px; border-radius: 6px; }

  .story { background: var(--panel2); border: 1px solid var(--line); border-radius: 14px; padding: 20px 22px; margin: 28px 0 0; }
  .story h2 { margin: 0 0 16px; font-size: 14px; font-weight: 600; }
  .flow { display: flex; align-items: stretch; gap: 4px; flex-wrap: wrap; }
  .node { flex: 1 1 130px; min-width: 122px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 14px 10px; text-align: center; box-shadow: var(--shadow); animation: popIn .45s cubic-bezier(.2,.9,.3,1.2) both; }
  .node.subject { border-color: var(--subject); } .node.subject .node-role { color: var(--subject); }
  .node.actor { border-color: var(--actor); } .node.actor .node-role { color: var(--actor); }
  .node.resource { border-color: var(--resource); } .node.resource .node-role { color: var(--resource); }
  .node-icon { font-size: 24px; line-height: 1; }
  .node-name { font-weight: 600; font-size: 12.5px; margin-top: 8px; letter-spacing: -.01em; }
  .node-role { font-size: 10px; color: var(--ink3); text-transform: uppercase; letter-spacing: .05em; margin-top: 4px; font-weight: 500; }
  .edge { flex: 0 1 78px; min-width: 62px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: var(--ink3); animation: drawEdge .45s ease both; }
  .edge .edge-label { font-size: 10px; line-height: 1.25; text-align: center; }
  .edge .arrow { font-size: 15px; line-height: 1; }
  .token-chip { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 16px 0 8px; }
  .token-chip .k { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--ink3); }
  .token-chip code { font-size: 11.5px; background: var(--subject-soft); color: var(--subject); padding: 4px 9px; border-radius: 7px; }
  .story-note { margin: 0; font-size: 12.5px; line-height: 1.65; color: var(--ink2); max-width: 84ch; text-wrap: pretty; }
  .replay { font: inherit; font-size: 11px; color: var(--ink2); background: var(--panel); border: 1px solid var(--line); border-radius: 7px; padding: 4px 10px; cursor: pointer; float: right; }
  .replay:hover { border-color: var(--brand); color: var(--brand); }

  ol.chain { margin: 0 0 4px; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
  ol.chain li { display: flex; align-items: center; gap: 10px; background: var(--panel2); border: 1px solid var(--line2); border-left: 2px solid var(--actor); border-radius: 8px; padding: 8px 12px; font-family: "IBM Plex Mono", monospace; font-size: 12.5px; color: var(--actor); }
  ol.chain li:first-child { border-left-color: var(--subject); color: var(--subject); }
  .badge { min-width: 128px; font-family: "IBM Plex Sans", sans-serif; font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; color: var(--ink3); }

  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  button, .btn { font: inherit; font-size: 13px; padding: 9px 15px; border-radius: 9px; border: 1px solid var(--line); background: var(--panel2); color: var(--ink); cursor: pointer; }
  button:hover, .btn:hover { border-color: var(--brand); color: var(--brand); }
  .btn.primary { background: var(--brand); color: #fff; border-color: var(--brand); font-size: 14px; padding: 11px 20px; border-radius: 10px; }
  .btn.primary:hover { color: #fff; filter: brightness(1.08); transform: translateY(-1px); }

  .obo, .banner, .ok, .warn, .error { border-radius: 10px; padding: 11px 13px; font-size: 12.5px; line-height: 1.55; margin: 0 0 18px; }
  .obo { background: var(--subject-soft); color: var(--subject); }
  .banner, .ok { background: var(--ok-bg); color: var(--ok-ink); }
  .warn { background: var(--warn-bg); color: var(--warn-ink); }
  .error { background: var(--err-bg); color: var(--err-ink); font-family: "IBM Plex Mono", monospace; font-size: 12px; }
  .obo code, .banner code, .ok code, .warn code { background: rgba(127,127,127,.14); padding: 1px 5px; border-radius: 4px; }

  .status.down .dot { background: var(--err-ink); }

  section.blocked { border-left: 3px solid var(--err-ink); }
  .steps { display: flex; flex-direction: column; }
  .step { display: flex; gap: 14px; padding: 16px 0; border-top: 1px solid var(--line2); }
  .step:first-child { border-top: 0; padding-top: 4px; }
  .step:last-child { padding-bottom: 0; }
  .step-num { flex: 0 0 26px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 600; background: var(--panel2); border: 1px solid var(--line); color: var(--ink3); }
  .step.done .step-num { background: var(--resource); border-color: var(--resource); color: #fff; }
  .step.active .step-num { background: var(--brand); border-color: var(--brand); color: #fff; }
  .step-body { flex: 1 1 auto; min-width: 0; }
  .step-head { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
  .step-title { font-size: 14px; font-weight: 600; letter-spacing: -.01em; }
  .step-note { margin: 6px 0 0; font-size: 12.5px; line-height: 1.6; color: var(--ink2); max-width: 80ch; text-wrap: pretty; }
  .step-note code { background: var(--code-bg); padding: 1px 5px; border-radius: 4px; font-size: 11.5px; }
  .step-detail { margin: 8px 0 0; font-family: "IBM Plex Mono", monospace; font-size: 11.5px; line-height: 1.6; color: var(--ink3); word-break: break-word; }
  .step.failed .step-detail { background: var(--err-bg); color: var(--err-ink); border-radius: 8px; padding: 9px 11px; }
  .step.unverified .step-num { background: var(--warn-bg); border-color: var(--warn-ink); color: var(--warn-ink); }
  .step.unverified .step-detail { background: var(--warn-bg); color: var(--warn-ink); border-radius: 8px; padding: 9px 11px; }
  .step-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 12px 0 0; }
  .tag { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; padding: 3px 8px; border-radius: 6px; background: var(--panel2); border: 1px solid var(--line); color: var(--ink3); }
  .tag.ok { background: var(--ok-bg); border-color: transparent; color: var(--ok-ink); }
  .tag.bad { background: var(--err-bg); border-color: transparent; color: var(--err-ink); }
  .tag.warn { background: var(--warn-bg); border-color: transparent; color: var(--warn-ink); }
  button[disabled], .btn[disabled] { opacity: .45; cursor: not-allowed; }
  button[disabled]:hover, .btn[disabled]:hover { border-color: var(--line); color: var(--ink); }
  ul.fixes { margin: 10px 0 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
  ul.fixes li { font-size: 12.5px; line-height: 1.6; color: var(--ink2); }

  .step-actions .creds { flex: 1 1 100%; margin: 4px 0 0; }
  .creds { margin: 12px 0 0; background: var(--panel2); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
  .creds-title { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--ink3); font-weight: 600; }
  .creds-note { margin: 4px 0 10px; font-size: 12.5px; line-height: 1.55; color: var(--ink2); }
  .cred { display: flex; align-items: center; gap: 10px; padding: 5px 0; }
  .cred-k { flex: 0 0 78px; font-size: 11.5px; color: var(--ink3); }
  .cred-v { flex: 1 1 auto; font-family: "IBM Plex Mono", monospace; font-size: 12.5px; background: var(--code-bg); padding: 4px 9px; border-radius: 6px; word-break: break-all; }
  button.copy { font: inherit; font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--panel); color: var(--ink2); cursor: pointer; flex: 0 0 auto; }
  button.copy:hover { border-color: var(--brand); color: var(--brand); }
  button.copy.copied { border-color: var(--resource); color: var(--resource); }

  @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes popIn { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; } }
  @keyframes drawEdge { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
  @keyframes flashRow { to { background: var(--hl); } }
  @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`;

// Theme persistence plus a replay button for the flow animation. Small enough to inline.
const SCRIPT = `
(function () {
  var root = document.documentElement;
  var saved = localStorage.getItem("aid-theme");
  if (saved) root.dataset.theme = saved;
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) root.dataset.theme = "dark";
  function icon() { return root.dataset.theme === "dark" ? "\\u2600" : "\\u263e"; }
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.textContent = icon();
      btn.addEventListener("click", function () {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("aid-theme", root.dataset.theme);
        btn.textContent = icon();
      });
    }
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("button.copy");
      if (!btn) return;
      navigator.clipboard.writeText(btn.dataset.copy).then(function () {
        var was = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = was; btn.classList.remove("copied"); }, 1400);
      });
    });
    var replay = document.querySelector(".replay");
    var flow = document.querySelector(".flow");
    if (replay && flow) replay.addEventListener("click", function () {
      var clone = flow.cloneNode(true);
      flow.parentNode.replaceChild(clone, flow);
      flow = clone;
    });
  });
})();
`;

// A step: {n, title, state: "done"|"active"|"todo"|"failed", tag, note, detail, actions}.
// `note`, `detail`, and `actions` are author-written literals and may contain markup.
export function steps(items) {
  return (
    `<div class="steps">` +
    items
      .map((s) => {
        const failed = s.state === "failed";
        const cls = failed ? "failed" : s.state;
        return `<div class="step ${cls}">
  <div class="step-num">${failed ? "!" : s.state === "done" ? "&#10003;" : s.n}</div>
  <div class="step-body">
    <div class="step-head"><span class="step-title">${esc(s.title)}</span>${
      s.tag ? `<span class="tag ${s.tagKind ?? ""}">${esc(s.tag)}</span>` : ""
    }</div>
    ${s.note ? `<p class="step-note">${s.note}</p>` : ""}
    ${s.detail ? `<p class="step-detail">${s.detail}</p>` : ""}
    ${s.actions ? `<div class="step-actions">${s.actions}</div>` : ""}
  </div>
</div>`;
      })
      .join("") +
    `</div>`
  );
}

// A labelled value with a copy button, for credentials the reader has to type somewhere else.
export function credentials({title, note, fields}) {
  const rows = fields
    .map(
      ({label, value}) => `<div class="cred">
  <span class="cred-k">${esc(label)}</span>
  <code class="cred-v">${esc(value)}</code>
  <button class="copy" type="button" data-copy="${esc(value)}">Copy</button>
</div>`,
    )
    .join("");
  return `<div class="creds">
  <div class="creds-title">${esc(title)}</div>
  ${note ? `<p class="creds-note">${note}</p>` : ""}
  ${rows}
</div>`;
}

export function page({title, heading, lead, nav = "", body, eyebrow = "", host = "", hostOk = true, appName = ""}) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
<style>${STYLES}</style><script>${SCRIPT}</script></head><body>
<header class="topbar">
  <div class="row">
    <div class="brand">
      <span class="mark">${LOGO}</span>
      <div><span class="name">${esc(appName)}</span><span class="host">ThunderID</span></div>
    </div>
    <div class="status${hostOk ? "" : " down"}"><span class="dot"></span><span>${esc(hostOk ? host : "unreachable")}</span></div>
    <button class="theme-toggle" type="button" aria-label="Toggle theme">&#9790;</button>
  </div>
  ${nav}
</header>
<main>
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
  <h1>${esc(heading)}</h1>
  <p class="lead">${lead}</p>
  ${body}
</main>
</body></html>`;
}

export function tabs(scenarios, activeId) {
  const link = (href, label, id) =>
    `<a href="${href}"${id === activeId ? ' class="active"' : ""}>${esc(label)}</a>`;
  return `<nav class="tabs">${link("/", "Overview", "overview")}${scenarios
    .map((s) => link(`/${s.id}`, `${s.icon} ${s.nav}`, s.id))
    .join("")}</nav>`;
}

// items: {icon, name, role, kind} for a node, or {edge: "label"} for the arrow between two nodes.
// Each item enters in sequence, so the flow reads as something that happens rather than a picture.
export function flow(items) {
  let delay = 0;
  return (
    `<div class="flow">` +
    items
      .map((it) => {
        delay += 0.14;
        const style = ` style="animation-delay:${delay.toFixed(2)}s"`;
        return it.edge !== undefined
          ? `<div class="edge"${style}><span class="edge-label">${it.edge}</span><span class="arrow">&rarr;</span></div>`
          : `<div class="node${it.kind ? ` ${it.kind}` : ""}"${style}><div class="node-icon">${it.icon}</div>` +
              `<div class="node-name">${esc(it.name)}</div><div class="node-role">${esc(it.role)}</div></div>`;
      })
      .join("") +
    `</div>`
  );
}

export function story({heading, items, chipLabel, chipValues = [], note}) {
  return `
<div class="story">
  <h2>${esc(heading)}<button class="replay" type="button">Replay &#9656;</button></h2>
  ${flow(items)}
  <p class="token-chip"><span class="k">${esc(chipLabel)}</span> ${chipValues.map((v) => `<code>${esc(v)}</code>`).join(" ")}</p>
  <p class="story-note">${note}</p>
</div>`;
}

// `changed` marks the claims that differ from the previously issued token (the refresh diff).
export function claimsTable(claims, highlight = [], changed = []) {
  const rows = Object.entries(claims)
    .map(([k, v]) => {
      const cls = changed.includes(k) ? " class=\"changed\"" : highlight.includes(k) ? ' class="hl"' : "";
      return `<tr${cls}><td>${esc(k)}</td><td><code>${esc(JSON.stringify(v))}</code></td></tr>`;
    })
    .join("");
  return `<table><thead><tr><th>Claim</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function section({title, subtitle = "", body}) {
  return `<section><h2>${esc(title)}</h2>${subtitle ? `<p class="sub">${subtitle}</p>` : ""}${body}</section>`;
}

// Renders the delegation chain of a token as a list: subject first, then each actor.
export function chainList(claims) {
  const items = actorChain(claims)
    .map((n, i) => {
      const label = n.role === "subject" ? "subject (sub)" : i === 1 ? "actor (act)" : "delegated by (act.act)";
      return `<li><span class="badge">${label}</span> <code>${esc(n.sub)}</code></li>`;
    })
    .join("");
  return `<ol class="chain">${items}</ol>`;
}

// `notice` renders above the claims, `extra` below them, both optional.
// `changed` highlights claims that were reissued, used after a refresh.
export function tokenSection({title, subtitle = "", token, highlight = [], changed = [], notice = "", extra = "", showHeader = false}) {
  if (!token) return section({title, subtitle, body: `<p class="muted">not issued</p>`});

  const decoded = decodeJwt(token);
  if (!decoded) {
    return section({
      title,
      subtitle,
      body: `${notice}<h3>Raw token (opaque, not a JWT)</h3><pre class="tok">${esc(token)}</pre>`,
    });
  }
  return section({
    title,
    subtitle,
    body: `${notice}
${showHeader ? `<h3>Decoded header</h3><pre>${esc(JSON.stringify(decoded.header, null, 2))}</pre>` : ""}
<h3>Decoded claims</h3>
${claimsTable(decoded.claims, highlight, changed)}
${extra}
<h3>Raw token</h3>
<pre class="tok">${esc(token)}</pre>`,
  });
}

// A run that was attempted and rejected, as opposed to a prerequisite that was never met. Shown
// when the user skipped the readiness check, or when the check passed but reality disagreed.
export function runError(err, hint = "") {
  return section({
    title: "The run failed",
    subtitle: "The request was sent and ThunderID rejected it. Its exact response is below.",
    body: errorBox(err) + (hint ? `<p class="step-note">${hint}</p>` : ""),
  });
}

export const errorBox = (err) => `<div class="error">${esc(err instanceof Error ? err.message : String(err))}</div>`;
