// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import NameSuggestion from '../NameSuggestion';

vi.mock('@thunderid/utils', () => ({
  generateRandomHumanReadableIdentifiers: vi.fn(),
}));

const {generateRandomHumanReadableIdentifiers} = await import('@thunderid/utils');

describe('NameSuggestion', () => {
  beforeEach(() => {
    vi.mocked(generateRandomHumanReadableIdentifiers).mockReturnValue(['Wise Clocks Run']);
  });

  it('should render a single suggestion', () => {
    render(<NameSuggestion onSelect={vi.fn()} />);

    expect(screen.getByText('Wise Clocks Run')).toBeInTheDocument();
  });

  it('should keep the same suggestion across rerenders', () => {
    let counter = 0;
    vi.mocked(generateRandomHumanReadableIdentifiers).mockImplementation(() => [`Suggestion ${counter++}`]);

    const {rerender} = render(<NameSuggestion onSelect={vi.fn()} />);
    const initialSuggestion = screen.getByText(/^Suggestion \d+$/).textContent;

    rerender(<NameSuggestion onSelect={vi.fn()} />);

    expect(screen.getByText(/^Suggestion \d+$/)).toHaveTextContent(initialSuggestion ?? '');
  });

  it('should call onSelect with the suggestion when clicked', () => {
    const onSelect = vi.fn();
    render(<NameSuggestion onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Wise Clocks Run'));

    expect(onSelect).toHaveBeenCalledWith('Wise Clocks Run');
  });

  it('should call onSelect with the suggestion on Enter key', () => {
    const onSelect = vi.fn();
    render(<NameSuggestion onSelect={onSelect} />);

    fireEvent.keyDown(screen.getByText('Wise Clocks Run'), {key: 'Enter'});

    expect(onSelect).toHaveBeenCalledWith('Wise Clocks Run');
  });

  it('should request a new suggestion when the shuffle button is clicked', () => {
    let counter = 0;
    vi.mocked(generateRandomHumanReadableIdentifiers).mockImplementation(() => [`Suggestion ${counter++}`]);
    render(<NameSuggestion onSelect={vi.fn()} />);
    const initialSuggestion = screen.getByText(/^Suggestion \d+$/).textContent;

    fireEvent.click(screen.getByRole('button', {name: 'Try another suggestion'}));

    expect(screen.getByText(/^Suggestion \d+$/)).not.toHaveTextContent(initialSuggestion ?? '');
  });
});
