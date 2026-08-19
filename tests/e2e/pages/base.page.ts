// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { Page } from "@playwright/test";
import path from "path";

/**
 * Base Page Object Model
 *
 * Provides common functionality for all page objects, such as
 * screenshot capabilities and shared locators.
 */
export class BasePage {
  constructor(readonly page: Page) {}

  /**
   * Take a full-page screenshot and save it to test-results/debug.
   *
   * The screenshot is saved as a PNG file in the `tests/e2e/test-results/debug` directory.
   * Useful for debugging visual states during test execution.
   *
   * @param name Name of the screenshot file (without extension)
   */
  async screenshot(name: string) {
    // Resolve path relative to this file's location (tests/e2e/pages)
    // We want to go up one level to e2e, then into test-results
    const screenshotPath = path.resolve(__dirname, "../test-results/debug", `${name}.png`);

    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
  }
}
