// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import ConnectionNameStep from '../ConnectionNameStep';

describe('ConnectionNameStep', () => {
  it('reports typed names through onNameChange', () => {
    const onNameChange = vi.fn();
    render(<ConnectionNameStep name="" onNameChange={onNameChange} />);

    fireEvent.change(screen.getByTestId('connection-name-input'), {target: {value: 'Acme Connection'}});

    expect(onNameChange).toHaveBeenCalledWith('Acme Connection');
  });

  it('fills the name field when a suggestion chip is clicked', () => {
    const onNameChange = vi.fn();
    render(<ConnectionNameStep name="" onNameChange={onNameChange} />);

    const suggestions = screen.getAllByRole('button');
    fireEvent.click(suggestions[0]);

    expect(onNameChange).toHaveBeenCalledWith(expect.any(String));
    expect(onNameChange.mock.calls[0][0]).not.toBe('');
  });

  it('shows an external name error', () => {
    render(
      <ConnectionNameStep
        name="Taken"
        onNameChange={vi.fn()}
        nameError="A connection with this name already exists."
      />,
    );

    expect(screen.getByText('A connection with this name already exists.')).toBeInTheDocument();
  });
});
