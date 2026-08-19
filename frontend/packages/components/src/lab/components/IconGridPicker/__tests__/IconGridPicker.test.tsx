// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import IconGridPicker from '../IconGridPicker';

const ITEMS = Array.from({length: 30}, (_, i) => `icon-${i}`);

function iconsFor(names: string[]): Record<string, string> {
  return Object.fromEntries(names.map((name) => [name, `data:image/svg+xml,${name}`]));
}

describe('IconGridPicker', () => {
  it('should render exactly optionCount icons', () => {
    render(<IconGridPicker icons={iconsFor(ITEMS)} value="" shape="rounded" optionCount={5} onChange={vi.fn()} />);

    expect(screen.getAllByRole('img')).toHaveLength(5);
  });

  it('should include the selected icon among the rendered options even with a small sample', () => {
    render(
      <IconGridPicker icons={iconsFor(ITEMS)} value="icon-27" shape="rounded" optionCount={3} onChange={vi.fn()} />,
    );

    expect(screen.getByTitle('icon-27')).toBeInTheDocument();
  });
});
