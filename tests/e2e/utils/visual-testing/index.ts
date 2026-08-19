// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Visual Regression Test Helpers
 *
 * Provides utilities for visual regression testing using Playwright's screenshot comparison.
 *
 * @example
 * import { expectVisualMatch } from '../../utils/visual-testing';
 *
 * test('homepage looks correct', async ({ page }) => {
 *   await page.goto('/');
 *   await expectVisualMatch(page, 'homepage');
 * });
 */

import { Page, expect } from "@playwright/test";

export interface VisualTestOptions {
  /** Maximum allowed pixel difference (0-1) */
  maxDiffPixelRatio?: number;

  /** Maximum allowed different pixels */
  maxDiffPixels?: number;

  /** Mask elements that might change (dates, random IDs) */
  mask?: Array<any>;

  /** Wait for animations to complete */
  animations?: "disabled" | "allow";

  /** Full page screenshot or viewport only */
  fullPage?: boolean;
}

/**
 * Compare page screenshot with baseline
 */
export async function expectVisualMatch(page: Page, screenshotName: string, options: VisualTestOptions = {}) {
  const { maxDiffPixelRatio = 0.01, maxDiffPixels, mask = [], animations = "disabled", fullPage = false } = options;

  await expect(page).toHaveScreenshot(`${screenshotName}.png`, {
    maxDiffPixelRatio,
    maxDiffPixels,
    mask,
    animations,
    fullPage,
  });
}

/**
 * Compare element screenshot with baseline
 */
export async function expectElementVisualMatch(
  element: any,
  screenshotName: string,
  options: Omit<VisualTestOptions, "fullPage"> = {}
) {
  const { maxDiffPixelRatio = 0.01, maxDiffPixels, mask = [], animations = "disabled" } = options;

  await expect(element).toHaveScreenshot(`${screenshotName}.png`, {
    maxDiffPixelRatio,
    maxDiffPixels,
    mask,
    animations,
  });
}
