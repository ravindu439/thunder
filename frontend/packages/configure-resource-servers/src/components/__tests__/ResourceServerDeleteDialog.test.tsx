// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {renderWithProviders, screen, fireEvent} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import type {ResourceServer} from '../../models/resource-server';
import ResourceServerDeleteDialog from '../ResourceServerDeleteDialog';

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
const mockUseDeleteResourceServer = vi.fn(() => ({mutate: mockMutate, isPending: false}));

vi.mock('../../api/useDeleteResourceServer', () => ({
  default: () => mockUseDeleteResourceServer(),
}));

const resourceServer: ResourceServer = {
  id: 'rs-1',
  name: 'Payments API',
  identifier: 'https://api.example.com',
  ouId: 'ou-1',
  delimiter: ':',
  type: 'API',
};

describe('ResourceServerDeleteDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDeleteResourceServer.mockReturnValue({mutate: mockMutate, isPending: false});
  });

  it('renders the title and the target server name', () => {
    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    expect(screen.getByText('Delete resource server')).toBeInTheDocument();
    expect(screen.getByText('Payments API')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <ResourceServerDeleteDialog open={false} resourceServer={resourceServer} onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    expect(screen.queryByText('Delete resource server')).not.toBeInTheDocument();
  });

  it('mutates with the resource server id when confirmed', () => {
    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));

    expect(mockMutate).toHaveBeenCalledWith('rs-1', expect.any(Object));
  });

  it('does not mutate when resourceServer is null', () => {
    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={null} onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows a success toast and calls onSuccess on a successful mutation', () => {
    mockMutate.mockImplementation((_id: string, opts: {onSuccess: () => void}) => opts.onSuccess());
    const onSuccess = vi.fn();

    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={vi.fn()} onSuccess={onSuccess} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));

    expect(mockShowToast).toHaveBeenCalledWith('Resource server deleted successfully.', 'success');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('shows the resolved catalog message inline, never the raw server text, when delete fails, and keeps the dialog open', () => {
    const rawServerMessage = 'raw backend delete failure detail';
    mockMutate.mockImplementation((_id: string, opts: {onError: (err: Error) => void}) =>
      opts.onError(new Error(rawServerMessage)),
    );
    const onClose = vi.fn();

    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={onClose} onSuccess={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));

    expect(screen.getByText('Failed to delete resource server. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText(rawServerMessage)).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not show a success toast when delete fails', () => {
    mockMutate.mockImplementation((_id: string, opts: {onError: (err: Error) => void}) =>
      opts.onError(new Error('nope')),
    );

    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));

    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('clears the error and closes when Cancel is clicked after a failed delete', () => {
    mockMutate.mockImplementation((_id: string, opts: {onError: (err: Error) => void}) =>
      opts.onError(new Error('nope')),
    );
    const onClose = vi.fn();

    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={onClose} onSuccess={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    expect(screen.getByText('Failed to delete resource server. Please try again.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));

    expect(onClose).toHaveBeenCalled();
  });

  it('disables Cancel and Delete buttons while pending', () => {
    mockUseDeleteResourceServer.mockReturnValue({mutate: mockMutate, isPending: true});

    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={vi.fn()} onSuccess={vi.fn()} />,
    );

    expect(screen.getByRole('button', {name: 'Cancel'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Deleting…'})).toBeDisabled();
  });

  it('does not call onClose via Cancel when pending', () => {
    mockUseDeleteResourceServer.mockReturnValue({mutate: mockMutate, isPending: true});
    const onClose = vi.fn();

    renderWithProviders(
      <ResourceServerDeleteDialog open resourceServer={resourceServer} onClose={onClose} onSuccess={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));

    expect(onClose).not.toHaveBeenCalled();
  });
});
