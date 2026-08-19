// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import AddCustomConnectionCard from '../AddCustomConnectionCard';

describe('AddCustomConnectionCard', () => {
  it('renders the ghost card and fires onClick when activated', () => {
    const onClick = vi.fn();
    render(<AddCustomConnectionCard onClick={onClick} />);
    expect(screen.getByText('Add custom connection')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('connection-add-custom-card').querySelector('button') as HTMLElement);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
