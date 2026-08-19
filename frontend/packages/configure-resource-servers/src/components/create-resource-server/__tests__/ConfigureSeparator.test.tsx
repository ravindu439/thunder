// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import ConfigureSeparator from '../ConfigureSeparator';

describe('ConfigureSeparator', () => {
  it('renders the separator select element', () => {
    render(<ConfigureSeparator delimiter=":" onDelimiterChange={vi.fn()} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the permission preview without a resource server prefix', () => {
    render(<ConfigureSeparator delimiter=":" onDelimiterChange={vi.fn()} />);

    expect(screen.getByText('<resource>:<action>')).toBeInTheDocument();
  });

  it('renders preview using dot separator', () => {
    render(<ConfigureSeparator delimiter="." onDelimiterChange={vi.fn()} />);

    expect(screen.getByText('<resource>.<action>')).toBeInTheDocument();
  });

  it('calls onReadyChange with true when delimiter is valid', () => {
    const onReadyChange = vi.fn();
    render(<ConfigureSeparator delimiter=":" onDelimiterChange={vi.fn()} onReadyChange={onReadyChange} />);

    expect(onReadyChange).toHaveBeenCalledWith(true);
  });
});
