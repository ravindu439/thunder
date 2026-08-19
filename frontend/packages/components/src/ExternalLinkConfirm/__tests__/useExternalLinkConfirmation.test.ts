// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {act, renderHook} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import useExternalLinkConfirmation from '../useExternalLinkConfirmation';

describe('useExternalLinkConfirmation', () => {
  beforeEach(() => {
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    vi.mocked(window.open).mockRestore();
  });

  it('starts closed with no pending URL', () => {
    const {result} = renderHook(() => useExternalLinkConfirmation());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.pendingUrl).toBeUndefined();
  });

  it('opens with the requested URL', () => {
    const {result} = renderHook(() => useExternalLinkConfirmation());

    act(() => result.current.requestNavigation('https://example.com'));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.pendingUrl).toBe('https://example.com');
  });

  it('opens the URL and closes on confirm', () => {
    const {result} = renderHook(() => useExternalLinkConfirmation());

    act(() => result.current.requestNavigation('https://example.com'));
    act(() => result.current.confirm());

    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
    expect(result.current.isOpen).toBe(false);
    expect(result.current.pendingUrl).toBeUndefined();
  });

  it('closes without opening the URL on cancel', () => {
    const {result} = renderHook(() => useExternalLinkConfirmation());

    act(() => result.current.requestNavigation('https://example.com'));
    act(() => result.current.cancel());

    expect(window.open).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
    expect(result.current.pendingUrl).toBeUndefined();
  });
});
