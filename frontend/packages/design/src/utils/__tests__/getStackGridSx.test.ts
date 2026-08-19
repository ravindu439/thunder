// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import getStackGridSx, {parseStackItems, MAX_STACK_ITEMS} from '../getStackGridSx';

describe('parseStackItems', () => {
  it('returns undefined when items is absent or empty', () => {
    expect(parseStackItems(undefined)).toBeUndefined();
    expect(parseStackItems('')).toBeUndefined();
  });

  it('parses numeric strings', () => {
    expect(parseStackItems('3')).toBe(3);
  });

  it('returns undefined for malformed or non-positive values', () => {
    expect(parseStackItems('2invalid')).toBeUndefined();
    expect(parseStackItems('garbage')).toBeUndefined();
    expect(parseStackItems(0)).toBeUndefined();
    expect(parseStackItems(-2)).toBeUndefined();
  });

  it('returns undefined for a single slot so existing stacks keep their flex layout', () => {
    expect(parseStackItems(1)).toBeUndefined();
    expect(parseStackItems('1')).toBeUndefined();
  });

  it('floors fractional values', () => {
    expect(parseStackItems(2.7)).toBe(2);
  });

  it('clamps absurd slot counts', () => {
    expect(parseStackItems(5000)).toBe(MAX_STACK_ITEMS);
  });
});

describe('getStackGridSx', () => {
  it('returns null when the stack has no items', () => {
    expect(getStackGridSx({direction: 'row'})).toBeNull();
  });

  it('maps items to columns for the default row direction', () => {
    const sx = getStackGridSx({items: 2})!;

    expect(sx.display).toBe('grid');
    expect(sx.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(sx.gridAutoFlow).toBe('row');
    expect(sx.gridTemplateRows).toBeUndefined();
  });

  it('returns null for a single slot, leaving the stack in flex mode', () => {
    expect(getStackGridSx({items: 1, direction: 'row'})).toBeNull();
  });

  it('maps items to rows when direction is column', () => {
    const sx = getStackGridSx({items: 3, direction: 'column'})!;

    expect(sx.gridTemplateRows).toBe('repeat(3, minmax(0, 1fr))');
    expect(sx.gridAutoFlow).toBe('column');
    expect(sx.gridTemplateColumns).toBeUndefined();
  });

  it('falls back to the base axis for the reverse directions', () => {
    // CSS Grid has no reverse auto-flow, so column-reverse must at least stay on
    // the column axis rather than silently becoming a row.
    expect(getStackGridSx({items: 2, direction: 'column-reverse'})!.gridAutoFlow).toBe('column');
    expect(getStackGridSx({items: 2, direction: 'row-reverse'})!.gridAutoFlow).toBe('row');
  });

  it('uses content-sized tracks when justify has to distribute free space', () => {
    // Equal 1fr tracks leave justify-content nothing to distribute.
    expect(getStackGridSx({items: 2, justify: 'space-between'})!.gridTemplateColumns).toBe(
      'repeat(2, minmax(0, auto))',
    );
    expect(getStackGridSx({items: 2, justify: 'center'})!.gridTemplateColumns).toBe('repeat(2, minmax(0, auto))');
    expect(getStackGridSx({items: 2, direction: 'column', justify: 'center'})!.gridTemplateRows).toBe(
      'repeat(2, minmax(0, auto))',
    );
  });

  it('keeps equal tracks when justify is unset or stretch', () => {
    expect(getStackGridSx({items: 2})!.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    expect(getStackGridSx({items: 2, justify: 'stretch'})!.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('applies gap, align and justify with defaults', () => {
    expect(getStackGridSx({items: 2})).toMatchObject({gap: 2, alignItems: 'stretch', justifyContent: 'stretch'});
    expect(getStackGridSx({items: 2, gap: 4, align: 'center', justify: 'space-between'})).toMatchObject({
      gap: 4,
      alignItems: 'center',
      justifyContent: 'space-between',
    });
  });
});
