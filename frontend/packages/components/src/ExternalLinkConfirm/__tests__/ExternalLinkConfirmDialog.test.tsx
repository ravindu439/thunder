// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import ExternalLinkConfirmDialog from '../ExternalLinkConfirmDialog';

const KNOWN_TRANSLATIONS: Record<string, string> = {
  'common:actions.stay': 'Stay',
  'common:actions.continue': 'Continue',
  'common:externalLink.title': 'You are leaving ThunderID',
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => KNOWN_TRANSLATIONS[key] ?? (typeof fallback === 'string' ? fallback : key),
  }),
}));

vi.mock('@thunderid/contexts', () => ({
  useConfig: () => ({
    config: {brand: {product_name: 'ThunderID'}},
  }),
}));

vi.mock('@thunderid/logger/react', () => ({
  useLogger: () => ({error: vi.fn(), info: vi.fn(), debug: vi.fn(), warn: vi.fn()}),
}));

describe('ExternalLinkConfirmDialog', () => {
  it('does not render dialog content when closed', () => {
    render(
      <ExternalLinkConfirmDialog
        isOpen={false}
        pendingUrl="https://thunderid.dev/docs"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.queryByText("You're leaving the console")).not.toBeInTheDocument();
  });

  it('shows the destination URL when open', () => {
    render(
      <ExternalLinkConfirmDialog
        isOpen
        pendingUrl="https://thunderid.dev/docs"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText('You are leaving ThunderID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://thunderid.dev/docs')).toBeInTheDocument();
  });

  it('invokes onCancel when Cancel is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ExternalLinkConfirmDialog
        isOpen
        pendingUrl="https://thunderid.dev/docs"
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Stay'}));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('invokes onConfirm when Continue is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ExternalLinkConfirmDialog
        isOpen
        pendingUrl="https://thunderid.dev/docs"
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Continue'}));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
