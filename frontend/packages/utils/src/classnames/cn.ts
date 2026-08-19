// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

let prefix = '';

type ClassValue = string | false | null | undefined | 0;

/**
 * Sets the global class name prefix used by `cn()`.
 *
 * Should be called once at app bootstrap, typically using the product name
 * from `config.js`.
 *
 * @example
 * ```ts
 * setCnPrefix('<PRODUCT_NAME>');
 * ```
 *
 * @param newPrefix - The prefix to use for all class names
 */
export function setCnPrefix(newPrefix: string): void {
  // Strip characters that are invalid in CSS class names to prevent broken selectors.
  prefix = newPrefix.replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Returns the current class name prefix.
 */
export function getCnPrefix(): string {
  return prefix;
}

/**
 * Constructs a className string from conditional class values, automatically
 * prefixing each class with the configured product name.
 *
 * Follows MUI-style BEM convention: `{Prefix}{Component}--{slot}`.
 *
 * @example
 * ```tsx
 * cn("SignIn--root")
 * // => "<PRODUCT_NAME>SignIn--root"
 *
 * cn("SignIn--root", isPrimary && "SignIn--primary")
 * // => "<PRODUCT_NAME>SignIn--root <PRODUCT_NAME>SignIn--primary" (when isPrimary is true)
 * // => "<PRODUCT_NAME>SignIn--root" (when isPrimary is false)
 *
 * cn("SignInBox--root", "SignInBox--paper", isActive && "SignInBox--active")
 * // => "<PRODUCT_NAME>SignInBox--root <PRODUCT_NAME>SignInBox--paper <PRODUCT_NAME>SignInBox--active"
 * ```
 *
 * @param classes - Class name strings or falsy values for conditional classes
 * @returns The joined className string with the configured prefix applied
 */
export default function cn(...classes: ClassValue[]): string {
  return classes
    .filter(Boolean)
    .map((cls) => `${prefix}${cls as string}`)
    .join(' ');
}
