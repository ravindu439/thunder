// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {fireEvent, render, screen} from '@thunderid/test-utils';
import {type RefObject} from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import LayoutConfigPanel from '../LayoutConfigPanel';

const {mockMutateAsync} = vi.hoisted(() => ({
  mockMutateAsync: vi.fn(),
}));

vi.mock('@thunderid/design', () => ({
  useGetLayout: () => ({
    data: {id: 'layout-1', handle: 'layout-a', displayName: 'Layout A', layout: {screens: {main: {}}}},
    isLoading: false,
  }),
  useUpdateLayout: () => ({mutateAsync: mockMutateAsync}),
}));

vi.mock('../layouts/ScreenEditor', () => ({
  default: ({onUpdate}: {onUpdate: (path: string[], value: unknown) => void}) => (
    <button type="button" onClick={() => onUpdate(['background', 'value'], '#fff')}>
      Update Screen
    </button>
  ),
}));

vi.mock('../layouts/CustomCSSEditor', () => ({
  default: ({onChange}: {onChange: (next: unknown[]) => void}) => (
    <button type="button" onClick={() => onChange([{id: 'custom-1', content: 'body {}'}])}>
      Update Stylesheet
    </button>
  ),
}));

describe('LayoutConfigPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the screen editor when a screen is selected', () => {
    render(
      <LayoutConfigPanel
        layoutId="layout-1"
        selectedScreen="main"
        onScreenChange={vi.fn()}
        screenDraft={{background: {}}}
        onScreenDraftChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Update Screen')).toBeInTheDocument();
  });

  it('displays a resolved error message when a save triggered from the parent fails, never the raw server text', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));
    const saveHandlerRef: RefObject<() => void> = {current: () => null};

    render(
      <LayoutConfigPanel
        layoutId="layout-1"
        selectedScreen="main"
        onScreenChange={vi.fn()}
        screenDraft={{background: {}}}
        onScreenDraftChange={vi.fn()}
        saveHandlerRef={saveHandlerRef}
      />,
    );

    saveHandlerRef.current?.();

    expect(await screen.findByText('Failed to save layout. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText('Network error')).not.toBeInTheDocument();
  });

  it('clears the save error as soon as a screen field changes', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));
    const saveHandlerRef: RefObject<() => void> = {current: () => null};
    const onScreenDraftChange = vi.fn();

    render(
      <LayoutConfigPanel
        layoutId="layout-1"
        selectedScreen="main"
        onScreenChange={vi.fn()}
        screenDraft={{background: {}}}
        onScreenDraftChange={onScreenDraftChange}
        saveHandlerRef={saveHandlerRef}
      />,
    );

    saveHandlerRef.current?.();
    expect(await screen.findByText('Failed to save layout. Please try again.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Update Screen'));

    expect(screen.queryByText('Failed to save layout. Please try again.')).not.toBeInTheDocument();
    expect(onScreenDraftChange).toHaveBeenCalled();
  });

  it('clears the save error as soon as the custom CSS stylesheets change', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Network error'));
    const saveHandlerRef: RefObject<() => void> = {current: () => null};
    const onStylesheetsChange = vi.fn();

    render(
      <LayoutConfigPanel
        layoutId="layout-1"
        selectedScreen="main"
        onScreenChange={vi.fn()}
        screenDraft={{background: {}}}
        onScreenDraftChange={vi.fn()}
        saveHandlerRef={saveHandlerRef}
        stylesheets={[]}
        onStylesheetsChange={onStylesheetsChange}
      />,
    );

    saveHandlerRef.current?.();
    expect(await screen.findByText('Failed to save layout. Please try again.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Update Stylesheet'));

    expect(screen.queryByText('Failed to save layout. Please try again.')).not.toBeInTheDocument();
    expect(onStylesheetsChange).toHaveBeenCalledWith([{id: 'custom-1', content: 'body {}'}]);
  });
});
