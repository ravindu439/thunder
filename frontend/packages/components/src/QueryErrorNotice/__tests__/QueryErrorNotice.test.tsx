// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import QueryErrorNotice from '../QueryErrorNotice';

const t = (key: string, options?: Record<string, unknown>): string =>
  (options?.defaultValue as string | undefined) ?? key;

describe('QueryErrorNotice', () => {
  it('renders the block variant with a title and resolved description', () => {
    render(
      <QueryErrorNotice
        error={new Error('boom')}
        t={t}
        title="Failed to load users"
        fallbackKey="users:listing.error"
        fallbackDefaultValue="Something went wrong loading users"
      />,
    );

    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong loading users')).toBeInTheDocument();
  });

  it('renders the inline variant as a plain alert with no title', () => {
    render(
      <QueryErrorNotice
        error={new Error('boom')}
        t={t}
        variant="inline"
        fallbackKey="agents:groups.error"
        fallbackDefaultValue="Failed to load groups"
      />,
    );

    expect(screen.getByText('Failed to load groups')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders the onRetry action alongside the inline alert', () => {
    const onRetry = vi.fn();
    render(
      <QueryErrorNotice
        error={new Error('boom')}
        t={t}
        variant="inline"
        onRetry={onRetry}
        fallbackKey="agents:groups.error"
        fallbackDefaultValue="Failed to load groups"
      />,
    );

    fireEvent.click(screen.getByText('Refresh'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders a refresh button that calls onRetry', () => {
    const onRetry = vi.fn();
    render(<QueryErrorNotice error={new Error('boom')} t={t} title="Failed" onRetry={onRetry} />);

    fireEvent.click(screen.getByText('Refresh'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders a custom action alone when no onRetry is given', () => {
    render(
      <QueryErrorNotice
        error={new Error('boom')}
        t={t}
        title="Failed"
        action={<button type="button">Back to Users</button>}
      />,
    );

    expect(screen.getByText('Back to Users')).toBeInTheDocument();
    expect(screen.queryByText('Refresh')).not.toBeInTheDocument();
  });

  it('stacks the retry button above a custom action when both are given', () => {
    const onRetry = vi.fn();
    render(
      <QueryErrorNotice
        error={new Error('boom')}
        t={t}
        title="Failed"
        onRetry={onRetry}
        action={<button type="button">Back to Users</button>}
      />,
    );

    expect(screen.getByText('Refresh')).toBeInTheDocument();
    expect(screen.getByText('Back to Users')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Refresh'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('uses a custom resolveErrorMessage to interpolate error-specific params', () => {
    const resolveErrorMessage = vi.fn().mockReturnValue('Custom resolved message');
    render(
      <QueryErrorNotice error={new Error('boom')} t={t} title="Failed" resolveErrorMessage={resolveErrorMessage} />,
    );

    expect(screen.getByText('Custom resolved message')).toBeInTheDocument();
    expect(resolveErrorMessage).toHaveBeenCalledWith(
      expect.any(Error),
      t,
      'common:messages.somethingWentWrong',
      'Something went wrong',
    );
  });
});
