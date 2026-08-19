// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen, waitFor} from '@thunderid/test-utils';
import {type RefObject} from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import ThemeConfigPanel from '../ThemeConfigPanel';

const {mockMutateAsync, mockSetDraftTheme, mockSetIsDirty, mockThemeBuilderState} = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
  mockSetDraftTheme: vi.fn(),
  mockSetIsDirty: vi.fn(),
  mockThemeBuilderState: {
    draftTheme: {shape: {borderRadius: 8}} as Record<string, unknown>,
  },
}));

vi.mock('@thunderid/design', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/design')>();
  return {
    ...actual,
    useGetTheme: () => ({
      data: {id: 'theme-1', handle: 'theme-a', displayName: 'Theme A', description: '', isReadOnly: false},
      isLoading: false,
    }),
    useUpdateTheme: () => ({mutateAsync: mockMutateAsync, isPending: false}),
  };
});

vi.mock('../../contexts/ThemeBuilder/useThemeBuilder', () => ({
  default: () => ({
    draftTheme: mockThemeBuilderState.draftTheme,
    setDraftTheme: mockSetDraftTheme,
    setIsDirty: mockSetIsDirty,
    setPreviewColorScheme: vi.fn(),
  }),
}));

vi.mock('../themes/ShapeBuilderContent', () => ({
  default: ({onUpdate}: {onUpdate: (updater: (d: Record<string, unknown>) => void) => void}) => (
    <button type="button" onClick={() => onUpdate((d) => Object.assign(d, {shape: {borderRadius: 12}}))}>
      Update Shape
    </button>
  ),
}));

describe('ThemeConfigPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockThemeBuilderState.draftTheme = {shape: {borderRadius: 8}};
  });

  it('renders the shape section content', () => {
    render(<ThemeConfigPanel themeId="theme-1" activeSection="shape" />);
    expect(screen.getByText('Update Shape')).toBeInTheDocument();
  });

  it('displays a resolved error message when a save triggered from the parent fails, never the raw server text', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));
    const saveHandlerRef: RefObject<() => void> = {current: () => null};

    render(<ThemeConfigPanel themeId="theme-1" activeSection="shape" saveHandlerRef={saveHandlerRef} />);

    saveHandlerRef.current?.();

    expect(await screen.findByText('Failed to save theme. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText('Network error')).not.toBeInTheDocument();
  });

  it('clears the save error as soon as a field in the panel changes', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));
    const saveHandlerRef: RefObject<() => void> = {current: () => null};

    render(<ThemeConfigPanel themeId="theme-1" activeSection="shape" saveHandlerRef={saveHandlerRef} />);

    saveHandlerRef.current?.();

    expect(await screen.findByText('Failed to save theme. Please try again.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Update Shape'));

    await waitFor(() => {
      expect(screen.queryByText('Failed to save theme. Please try again.')).not.toBeInTheDocument();
    });
    expect(mockSetDraftTheme).toHaveBeenCalled();
  });
});
