// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Custom Assertions
 *
 * Provides reusable, domain-specific assertions to make tests more readable.
 *
 * @example
 * import { Assertions } from '../../utils/assertions';
 *
 * await Assertions.expectSuccessMessage(page, 'User created successfully');
 * await Assertions.expectUrlContains(page, '/users');
 */

import { Page, expect } from "@playwright/test";

export class Assertions {
  /**
   * Assert success message is displayed
   */
  static async expectSuccessMessage(page: Page, expectedMessage?: string) {
    const successLocator = page.locator('[class*="success"], [role="status"]').first();
    await expect(successLocator).toBeVisible({ timeout: 10000 });

    if (expectedMessage) {
      await expect(successLocator).toContainText(expectedMessage);
    }
  }

  /**
   * Assert error message is displayed
   */
  static async expectErrorMessage(page: Page, expectedMessage?: string) {
    const errorLocator = page.locator('[class*="error"], [role="alert"]').first();
    await expect(errorLocator).toBeVisible({ timeout: 10000 });

    if (expectedMessage) {
      await expect(errorLocator).toContainText(expectedMessage);
    }
  }

  /**
   * Assert URL contains expected path
   */
  static async expectUrlContains(page: Page, expectedPath: string) {
    await expect(page).toHaveURL(new RegExp(`.*${expectedPath}.*`));
  }

  /**
   * Assert page title
   */
  static async expectPageTitle(page: Page, expectedTitle: string | RegExp) {
    await expect(page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert element has specific attribute value
   */
  static async expectAttribute(locator: any, attributeName: string, expectedValue: string | RegExp) {
    await expect(locator).toHaveAttribute(attributeName, expectedValue);
  }

  /**
   * Assert table has expected number of rows
   */
  static async expectTableRowCount(page: Page, expectedCount: number) {
    const rows = page.locator('table tbody tr, [role="row"]');
    await expect(rows).toHaveCount(expectedCount);
  }

  /**
   * Assert loading spinner is not visible
   */
  static async expectNoLoadingSpinner(page: Page) {
    const spinner = page.locator('[class*="loading"], [class*="spinner"], [role="progressbar"]');
    await expect(spinner).toBeHidden({ timeout: 30000 });
  }

  /**
   * Assert form validation error
   */
  static async expectFormValidationError(page: Page, fieldName: string, errorMessage: string) {
    const errorLocator = page.locator(
      `[name="${fieldName}"] ~ [class*="error"], [for="${fieldName}"] ~ [class*="error"]`
    );
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(errorMessage);
  }

  /**
   * Assert authenticated state
   */
  static async expectAuthenticated(page: Page) {
    // Check that we're not on signin page
    await expect(page).not.toHaveURL(/.*signin.*/);
    // Check for common authenticated elements (adjust based on your app)
    const userMenu = page.locator('[data-testid="user-menu"], [class*="user-menu"], [aria-label*="user menu"]');
    await expect(userMenu.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Assert not authenticated state
   */
  static async expectNotAuthenticated(page: Page) {
    await expect(page).toHaveURL(/.*signin.*/);
  }
}
