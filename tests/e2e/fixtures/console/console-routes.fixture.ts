// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Console Routes Fixture
 *
 * Provides centralized route definitions as a Playwright fixture.
 *
 * @example
 * import { test } from '../fixtures/console';
 *
 * test('navigate', async ({ page, routes }) => {
 *   await page.goto(`${baseUrl}${routes.users}`);
 * });
 */

import { test as base } from "@playwright/test";

import { ConsoleRoutes } from "../../configs/routes/console-routes";
export { ConsoleRoutes };

type RoutesFixture = {
  routes: typeof ConsoleRoutes;
};

export const test = base.extend<RoutesFixture>({
  routes: async ({}, use) => {
    await use(ConsoleRoutes);
  },
});

export { expect } from "@playwright/test";
export const routes = ConsoleRoutes;
