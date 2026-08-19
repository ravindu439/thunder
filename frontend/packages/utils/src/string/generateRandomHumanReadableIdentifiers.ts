// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {humanId} from 'human-id';

/**
 * Generates random human-readable identifiers using the `human-id` library
 *
 * @param length - The number of identifiers to generate (default: 5)
 * @returns An array of human-readable identifiers
 */
export default function generateRandomHumanReadableIdentifiers(length = 5): string[] {
  return Array.from({length}, () => {
    const id: string = humanId({
      separator: ' ',
      capitalize: true,
      adjectiveCount: 1,
      addAdverb: false,
    });

    return id
      .split(' ')
      .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  });
}
