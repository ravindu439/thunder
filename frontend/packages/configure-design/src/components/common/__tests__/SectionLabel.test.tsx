// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect} from 'vitest';
import SectionLabel from '../SectionLabel';

describe('SectionLabel', () => {
  it('renders the provided text', () => {
    render(<SectionLabel>Position</SectionLabel>);
    expect(screen.getByText('Position')).toBeInTheDocument();
  });

  it('renders different text correctly', () => {
    render(<SectionLabel>Container</SectionLabel>);
    expect(screen.getByText('Container')).toBeInTheDocument();
  });

  it('renders as a Typography element (not hidden)', () => {
    const {container} = render(<SectionLabel>My Label</SectionLabel>);
    expect(container.textContent).toBe('My Label');
  });
});
