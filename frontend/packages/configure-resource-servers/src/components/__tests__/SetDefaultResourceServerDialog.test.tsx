// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {renderWithProviders, screen, fireEvent} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {ResourceServer} from '../../models/resource-server';
import SetDefaultResourceServerDialog from '../SetDefaultResourceServerDialog';

const mockShowToast = vi.fn();

vi.mock('@thunderid/contexts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/contexts')>();
  return {
    ...actual,
    useToast: () => ({showToast: mockShowToast}),
  };
});

vi.mock('@thunderid/logger/react', () => ({
  useLogger: () => ({error: vi.fn(), info: vi.fn(), debug: vi.fn()}),
}));

const mockMutate = vi.fn();

vi.mock('../../api/useSetDefaultResourceServer', () => ({
  default: () => ({mutate: mockMutate, isPending: false}),
}));

const resourceServer: ResourceServer = {
  id: 'rs-1',
  name: 'Payments API',
  identifier: 'https://api.example.com',
  ouId: 'ou-1',
  delimiter: ':',
  type: 'API',
};

describe('SetDefaultResourceServerDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title and the target server name', () => {
    renderWithProviders(<SetDefaultResourceServerDialog open resourceServer={resourceServer} onClose={vi.fn()} />);

    expect(screen.getByText('Set default resource server')).toBeInTheDocument();
    // Emphasised inside the translated sentence, not concatenated around it, so translators can
    // reorder it.
    expect(screen.getByText('Payments API').tagName).toBe('STRONG');
    expect(screen.getByText(/will become the default resource server/)).toHaveTextContent(
      'Payments API will become the default resource server.',
    );
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <SetDefaultResourceServerDialog open={false} resourceServer={resourceServer} onClose={vi.fn()} />,
    );

    expect(screen.queryByText('Set default resource server')).not.toBeInTheDocument();
  });

  it('mutates with the resource server id when confirmed', () => {
    renderWithProviders(<SetDefaultResourceServerDialog open resourceServer={resourceServer} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', {name: 'Set as default'}));

    expect(mockMutate).toHaveBeenCalledWith({resourceServerId: 'rs-1'}, expect.any(Object));
  });

  it('shows a success toast and closes on a successful mutation', () => {
    mockMutate.mockImplementation((_vars, opts: {onSuccess: () => void}) => opts.onSuccess());
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <SetDefaultResourceServerDialog open resourceServer={resourceServer} onClose={onClose} onSuccess={onSuccess} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Set as default'}));

    expect(mockShowToast).toHaveBeenCalledWith('Payments API is now the default resource server.', 'success');
    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('shows the resolved catalog message inline, never the raw server text, on a failed mutation, and keeps the dialog open', () => {
    const rawServerMessage = 'raw backend set-default failure detail';
    mockMutate.mockImplementation((_vars, opts: {onError: (err: Error) => void}) =>
      opts.onError(new Error(rawServerMessage)),
    );
    const onClose = vi.fn();

    renderWithProviders(<SetDefaultResourceServerDialog open resourceServer={resourceServer} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', {name: 'Set as default'}));

    expect(screen.getByText('Failed to set the default resource server.')).toBeInTheDocument();
    expect(screen.queryByText(rawServerMessage)).not.toBeInTheDocument();
    expect(mockShowToast).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('clears the error and closes when Cancel is clicked after a failed mutation', () => {
    mockMutate.mockImplementation((_vars, opts: {onError: (err: Error) => void}) => opts.onError(new Error('nope')));
    const onClose = vi.fn();

    renderWithProviders(<SetDefaultResourceServerDialog open resourceServer={resourceServer} onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', {name: 'Set as default'}));
    expect(screen.getByText('Failed to set the default resource server.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));

    expect(onClose).toHaveBeenCalled();
  });
});
