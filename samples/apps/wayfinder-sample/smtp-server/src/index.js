// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import "dotenv/config";
import { startSmtp } from "./smtp.js";
import { startHttp } from "./http.js";

const SMTP_HOST = process.env.SMTP_HOST || "127.0.0.1";
const SMTP_PORT = Number(process.env.SMTP_PORT || 2525);
const HTTP_HOST = process.env.HTTP_HOST || "127.0.0.1";
const HTTP_PORT = Number(process.env.HTTP_PORT || 8788);

startSmtp(SMTP_HOST, SMTP_PORT);
startHttp(HTTP_HOST, HTTP_PORT);

console.log(`[smtp-server] Wayfinder local SMTP server started`);
console.log(`  SMTP:  ${SMTP_HOST}:${SMTP_PORT}  (username: dev / password: dev)`);
console.log(`  Inbox: http://${HTTP_HOST}:${HTTP_PORT}`);
