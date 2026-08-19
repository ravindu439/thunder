// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import {render, screen} from '@testing-library/react';
import {generateAvatarDataUri} from '@thunderid/react';
import {describe, it, expect, vi} from 'vitest';
import AvatarSwatchGrid from '../AvatarSwatchGrid';

describe('AvatarSwatchGrid', () => {
  const base = {content: '', shape: 'rounded' as const, variant: 'blank' as const};

  it('should render exactly optionCount swatches', () => {
    render(
      <AvatarSwatchGrid
        base={base}
        value={-1}
        gradientCount={20}
        optionCount={5}
        showShuffle={false}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('should include the selected swatch among the rendered options even with a small sample', () => {
    const {container} = render(
      <AvatarSwatchGrid base={base} value={17} gradientCount={40} optionCount={3} onChange={vi.fn()} />,
    );

    const expectedSrc = generateAvatarDataUri({...base, colors: 17});
    const images = Array.from(container.querySelectorAll('img'));
    expect(images.some((img) => img.getAttribute('src') === expectedSrc)).toBe(true);
  });
});
