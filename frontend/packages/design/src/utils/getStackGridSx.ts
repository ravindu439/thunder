// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export interface StackGridInput {
  /** Number of slots across the main axis. Fewer than two means no grid. */
  items?: string | number;
  /** Main axis of the stack. `row` makes `items` columns, `column` makes it rows. */
  direction?: string;
  gap?: number;
  align?: string;
  justify?: string;
}

export interface StackGridSx {
  display: 'grid';
  gap: number;
  alignItems: string;
  justifyContent: string;
  width: '100%';
  boxSizing: 'border-box';
  gridAutoFlow: 'row' | 'column';
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}

/** Upper bound on grid slots, so a mistyped `items` cannot render thousands of cells. */
export const MAX_STACK_ITEMS = 12;

/**
 * Parses the `items` slot count. Returns undefined when the property is absent,
 * malformed, or below two, which means the stack keeps its flex layout. Fractional
 * values are floored and the result is capped at {@link MAX_STACK_ITEMS}.
 *
 * A single slot is not treated as a grid: the flow builder seeds `items: 1` on every
 * stack it creates, so promoting 1 to a single-column grid would silently restack
 * every previously authored flow.
 */
export function parseStackItems(items: StackGridInput['items']): number | undefined {
  if (items === undefined || items === null || items === '') return undefined;
  const parsed = typeof items === 'string' ? Number(items) : items;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed)) return undefined;
  const slots = Math.floor(parsed);
  return slots >= 2 ? Math.min(slots, MAX_STACK_ITEMS) : undefined;
}

/**
 * Builds the CSS grid style for a STACK element, or null when the stack has fewer
 * than two `items` and should keep its flex layout.
 *
 * `items` is the number of slots across the main axis and `direction` picks that
 * axis: with `row` it is the column count (items: 2 with four children renders a
 * 2 x 2 grid), and with `column` it is the row count and children flow into
 * additional columns.
 *
 * Grid mode deliberately defaults differently from the flex layout: `direction`
 * defaults to `row` so `items` reads as a column count, and `align`/`justify`
 * default to `stretch` so children fill their cell. Setting `items` is therefore an
 * explicit opt in to a grid rather than a transparent addition to a flex stack.
 */
export default function getStackGridSx(stack: StackGridInput): StackGridSx | null {
  const items = parseStackItems(stack.items);
  if (items === undefined) return null;

  // CSS Grid has no reverse auto-flow, so the reverse variants fall back to their
  // base axis rather than silently becoming a row.
  const isColumn = (stack.direction ?? '').startsWith('column');
  const justify = stack.justify ?? 'stretch';

  // Equal `1fr` tracks fill the container, which leaves `justify-content` no free
  // space to distribute. Sizing the tracks to their content restores it, so every
  // justify value has a visible effect while the default stays an even split.
  // Each track is wrapped in `minmax(0, ...)` so a wide child shrinks instead of
  // pushing the track past the container edge.
  const track = justify === 'stretch' ? '1fr' : 'auto';

  return {
    display: 'grid',
    gap: stack.gap ?? 2,
    alignItems: stack.align ?? 'stretch',
    justifyContent: justify,
    width: '100%',
    // Callers add their own padding, so the width must include it.
    boxSizing: 'border-box',
    gridAutoFlow: isColumn ? 'column' : 'row',
    ...(isColumn
      ? {gridTemplateRows: `repeat(${items}, minmax(0, ${track}))`}
      : {gridTemplateColumns: `repeat(${items}, minmax(0, ${track}))`}),
  };
}
