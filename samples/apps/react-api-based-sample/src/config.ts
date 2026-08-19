// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export interface AppConfig {
  baseUrl: string;
  notificationSenderId?: string;
  directAuthSecret?: string;
}

let config: AppConfig | null = null;

export async function loadConfig(): Promise<AppConfig> {
  if (config) {
    return config;
  }

  const response = await fetch("/config.json");
  if (!response.ok) {
    throw new Error("Failed to load config");
  }

  config = await response.json();
  return config!;
}

export function getConfig(): AppConfig {
  if (!config) {
    throw new Error("Config not loaded. Call loadConfig() first.");
  }
  return config;
}

// getDirectAuthHeaders returns the header carrying the Direct Auth Secret required by the direct
// authentication APIs (/auth/**). The server is secure by default, so these endpoints reject
// requests without a matching Direct-Auth-Secret header.
export function getDirectAuthHeaders(): Record<string, string> {
  const { directAuthSecret } = getConfig();
  return directAuthSecret ? { "Direct-Auth-Secret": directAuthSecret } : {};
}
