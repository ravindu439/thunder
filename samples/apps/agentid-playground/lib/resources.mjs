// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Serves slices of ../thunderid-config/thunderid-config.yaml so each tab can offer exactly the
// agents it needs.
//
// The file is multi-document YAML separated by `---`, and every document declares a top-level
// `id:`, so selecting documents needs nothing more than a split and a regex. One source of truth,
// no YAML parser, no duplicated agent definitions.

import {readFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const FILE = resolve(dirname(fileURLToPath(import.meta.url)), "..", "thunderid-config", "thunderid-config.yaml");

// Each document keeps its own explanatory comment block, which starts with a `# --- ` marker. Drop
// anything before that so a slice does not carry the whole file's header.
function trimToMarker(doc) {
  const lines = doc.split("\n");
  const start = lines.findIndex((l) => l.startsWith("# --- "));
  return (start === -1 ? lines : lines.slice(start)).join("\n").trim();
}

function documents() {
  return readFileSync(FILE, "utf8")
    .split(/^---$/m)
    .map((doc) => ({id: /^id:\s*(\S+)/m.exec(doc)?.[1], body: trimToMarker(doc)}))
    .filter((d) => d.id);
}

// An agent that names an authFlowHandle cannot be created before the flow declaring that handle
// exists, so a slice containing the agent must contain the flow too. Resolving it here means a
// scenario cannot forget, which is exactly how the self slice once shipped a broken import.
function withFlowDependencies(all, selected) {
  const handles = selected.flatMap((d) =>
    [...d.body.matchAll(/^authFlowHandle:\s*(\S+)\s*$/gm)].map((m) => m[1]));
  if (!handles.length) return selected;

  const declaresHandle = (doc) => handles.some((h) => new RegExp(`^handle:\\s*${h}\\s*$`, "m").test(doc.body));
  // Filter `all` rather than appending, so the flow keeps its position ahead of the agent.
  return all.filter((d) => selected.includes(d) || declaresHandle(d));
}

// Returns the YAML text declaring exactly `ids` plus anything they depend on, in file order.
export function resourceSlice(ids, {title, note}) {
  const all = documents();
  const docs = withFlowDependencies(all, all.filter((d) => ids.includes(d.id)));
  const header = [
    // Slices are files the reader downloads and keeps, so they carry the licence header the source
    // file has. trimToMarker drops the source's own header along with each document's preamble.
    "# Copyright 2026 The ThunderID Authors",
    "# SPDX-License-Identifier: Apache-2.0",
    "",
    `# ThunderID declarative resources: ${title}`,
    "#",
    `# ${note}`,
    "#",
    "# Import into a running ThunderID instance (Console -> Import, or POST /import).",
    "",
  ].join("\n");
  return header + docs.map((d) => d.body).join("\n\n---\n") + "\n";
}

export const allResourceIds = () => documents().map((d) => d.id);
