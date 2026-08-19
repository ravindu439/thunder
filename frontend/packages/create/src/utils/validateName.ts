// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Validates a name for feature or package creation, throwing an error if invalid.
 *
 * @param value - The name to validate
 * @param type - The type of entity (e.g., 'Feature', 'Package')
 * @throws Error if the name is invalid
 *
 * @example
 * validateName('user-management', 'Feature');
 * // Throws if name is not valid
 *
 * @public
 */
export default function validateName(name: string, type = 'Feature'): void {
  if (!name || name.trim().length === 0) {
    throw new Error(`${type} name cannot be empty`);
  }

  const trimmed = name.trim();

  // Check for valid characters (must start with letter, end with letter/number, and contain only letters, numbers, underscores, and hyphens)
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(trimmed) && !/^[a-zA-Z]$/.test(trimmed)) {
    throw new Error(
      `${type} name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens`,
    );
  }

  // Check length
  if (trimmed.length > 50) {
    throw new Error(`${type} name must be 50 characters or less`);
  }

  // Check for reserved words
  const reserved = ['index', 'src', 'dist', 'build', 'node_modules', 'package', 'test', '__tests__'];
  if (reserved.includes(trimmed.toLowerCase())) {
    throw new Error(`${type} name '${trimmed}' is reserved`);
  }
}
