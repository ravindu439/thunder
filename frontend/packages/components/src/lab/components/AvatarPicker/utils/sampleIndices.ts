// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Picks `size` random, distinct indices out of `[0, count)`.
 */
export function sampleIndices(count: number, size: number): number[] {
  const all: number[] = Array.from({length: count}, (_, i) => i);
  return all.sort(() => Math.random() - 0.5).slice(0, size);
}

/**
 * Same as {@link sampleIndices}, but guarantees `mustInclude` is part of the result (when it's
 * a valid index) so a previously-selected swatch is never missing — and therefore never
 * unselected-looking — when the grid (re)mounts, e.g. on reopening its popover.
 */
export function sampleIndicesIncluding(count: number, size: number, mustInclude: number): number[] {
  if (mustInclude < 0 || mustInclude >= count || size <= 0) return sampleIndices(count, size);
  const rest: number[] = Array.from({length: count}, (_, i) => i).filter((i) => i !== mustInclude);
  const picked: number[] = rest.sort(() => Math.random() - 0.5).slice(0, size - 1);
  return [...picked, mustInclude].sort(() => Math.random() - 0.5);
}
