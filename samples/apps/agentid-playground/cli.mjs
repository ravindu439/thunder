// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// Command-line run of the delegation-chain scenario: prints the sub and act of each issued token,
// so you can confirm the actor chain shape without a browser.
//
//   npm run cli

import {readFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

import {createTokenClient} from "./lib/http.mjs";
import {decodeJwt} from "./lib/jwt.mjs";
import {runSteps, agentSubject} from "./scenarios/chain.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(resolve(__dirname, "config.json"), "utf8"));
const baseUrl = process.env.THUNDERID_BASE_URL || config.thunderidBaseUrl;

const client = createTokenClient(baseUrl);

let steps;
let subject;
try {
  // No browser here, so the Concierge's own token stands in for the signed-in customer. Use the
  // Delegates to agents tab to see the chain rooted in a real one.
  subject = await agentSubject(client, {...config, thunderidBaseUrl: baseUrl});
  steps = await runSteps(client, {...config, thunderidBaseUrl: baseUrl}, subject);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Could not run the delegation chain against ${baseUrl}\n  ${message}\n`);
  console.error(
    /invalid_client/.test(message)
      ? "The chain agents are missing, or their secrets no longer match config.json.\n" +
          "Import thunderid-config/thunderid-config.yaml, or open the Delegates to agents tab, which walks you\n" +
          "through the same checks and offers the file to download."
      : "Start ThunderID, or point THUNDERID_BASE_URL at the right instance.",
  );
  process.exit(1);
}

console.log(`Delegation chain against ${baseUrl}`);
console.log(`Subject: ${subject.who}\n`);
for (const step of steps) {
  const claims = decodeJwt(step.token)?.claims ?? {};
  console.log(`${step.title}`);
  console.log(`  sub:   ${JSON.stringify(claims.sub)}`);
  console.log(`  act:   ${JSON.stringify(claims.act ?? null)}`);
  console.log(`  scope: ${JSON.stringify(claims.scope ?? null)}\n`);
}
