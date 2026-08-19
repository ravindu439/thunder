// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {EmojiCategory} from '../EmojiPicker';
import EMOJI_DATA from '../emojis.json';

export const EMOJI_CATEGORIES: EmojiCategory[] = EMOJI_DATA as unknown as EmojiCategory[];

const ALL_EMOJIS: string[] = EMOJI_CATEGORIES.flatMap((c) => c.emojis.map((e) => e.char));

/**
 * Generates a specified number of random emoji icon suggestions.
 *
 * @param count - The number of random emoji icons to return.
 * @returns An array of emoji character strings.
 *
 * @example
 * ```typescript
 * const icons = generateIconSuggestions(8);
 * // Returns: ['🐼', '🚀', '💎', ...]
 * ```
 */
export default function generateIconSuggestions(count: number): string[] {
  const shuffled: string[] = [...ALL_EMOJIS].sort((): number => Math.random() - 0.5);

  return shuffled.slice(0, count);
}
