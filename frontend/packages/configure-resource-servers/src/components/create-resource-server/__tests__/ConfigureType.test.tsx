// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import type {ResourceServerType} from '../../../models/resource-server';
import ConfigureType from '../ConfigureType';

// The resourceServers i18n namespace is not loaded in the test setup,
// so t() returns the key's trailing segment (after the last colon).
// We query by role="button" and use the aria-pressed attribute to
// identify cards, avoiding a dependency on resolved i18n strings.

function getCards(): HTMLElement[] {
  return screen.getAllByRole('button');
}

describe('ConfigureType', () => {
  it('renders three type cards', () => {
    render(<ConfigureType selectedType={undefined} onSelect={vi.fn()} />);

    expect(getCards()).toHaveLength(3);
  });

  it('calls onSelect with "API" when the first card is clicked', () => {
    const onSelect = vi.fn();
    render(<ConfigureType selectedType={undefined} onSelect={onSelect} />);

    fireEvent.click(getCards()[0]);

    expect(onSelect).toHaveBeenCalledWith('API' as ResourceServerType);
  });

  it('calls onSelect with "MCP" when the second card is clicked', () => {
    const onSelect = vi.fn();
    render(<ConfigureType selectedType={undefined} onSelect={onSelect} />);

    fireEvent.click(getCards()[1]);

    expect(onSelect).toHaveBeenCalledWith('MCP' as ResourceServerType);
  });

  it('calls onSelect with "CUSTOM" when the third card is clicked', () => {
    const onSelect = vi.fn();
    render(<ConfigureType selectedType={undefined} onSelect={onSelect} />);

    fireEvent.click(getCards()[2]);

    expect(onSelect).toHaveBeenCalledWith('CUSTOM' as ResourceServerType);
  });

  it('marks the selected card with aria-pressed="true" and the others with aria-pressed="false"', () => {
    render(<ConfigureType selectedType="MCP" onSelect={vi.fn()} />);

    const cards = getCards();
    expect(cards[0]).toHaveAttribute('aria-pressed', 'false');
    expect(cards[1]).toHaveAttribute('aria-pressed', 'true');
    expect(cards[2]).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onSelect when Enter is pressed on a card', () => {
    const onSelect = vi.fn();
    render(<ConfigureType selectedType={undefined} onSelect={onSelect} />);

    fireEvent.keyDown(getCards()[2], {key: 'Enter'});

    expect(onSelect).toHaveBeenCalledWith('CUSTOM' as ResourceServerType);
  });

  it('calls onSelect when Space is pressed on a card', () => {
    const onSelect = vi.fn();
    render(<ConfigureType selectedType={undefined} onSelect={onSelect} />);

    fireEvent.keyDown(getCards()[0], {key: ' '});

    expect(onSelect).toHaveBeenCalledWith('API' as ResourceServerType);
  });
});
