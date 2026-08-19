// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {act, screen} from '@testing-library/react';
import {describe, it, expect, vi, afterEach} from 'vitest';
import renderWithProviders from '../../../../test/renderWithProviders';
import TimerAdapter from '../TimerAdapter';

describe('TimerAdapter', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the remaining time into the template', () => {
    renderWithProviders(<TimerAdapter expiresIn={90} textTemplate="This request expires in {time}." />);
    expect(screen.getByText('This request expires in 1:30.')).toBeTruthy();
  });

  it('renders nothing when no timeout is configured', () => {
    const {container} = renderWithProviders(<TimerAdapter expiresIn={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  // The caller recomputes expiresIn from the clock on every render, so it arrives as zero once the
  // deadline passes. The expired state has to survive that, because the step it belongs to is still
  // being submitted at that point.
  it('keeps the expired state on screen after expiresIn collapses to zero', () => {
    vi.useFakeTimers();
    const {rerender} = renderWithProviders(<TimerAdapter expiresIn={1} textTemplate="Expires in {time}." />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('Timed out')).toBeTruthy();

    rerender(<TimerAdapter expiresIn={0} textTemplate="Expires in {time}." />);
    expect(screen.getByText('Timed out')).toBeTruthy();
  });

  it('starts a fresh countdown when a later step supplies a new duration', () => {
    const {rerender} = renderWithProviders(<TimerAdapter expiresIn={30} textTemplate="Expires in {time}." />);
    expect(screen.getByText('Expires in 0:30.')).toBeTruthy();

    rerender(<TimerAdapter expiresIn={120} textTemplate="Expires in {time}." />);
    expect(screen.getByText('Expires in 2:00.')).toBeTruthy();
  });
});
