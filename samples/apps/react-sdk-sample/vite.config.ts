// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HOST = process.env.HOST ?? "localhost";

// Check if SSL certificates exist
const keyPath = "./server.key";
const certPath = "./server.cert";
const hasSSL = fs.existsSync(keyPath) && fs.existsSync(certPath);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: hasSSL
      ? {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      : undefined,
    port: PORT,
    host: HOST,
  },
});
