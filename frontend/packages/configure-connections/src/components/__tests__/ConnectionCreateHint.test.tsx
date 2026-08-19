// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import ConnectionCreateHint from '../ConnectionCreateHint';

vi.mock('@thunderid/contexts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@thunderid/contexts')>()),
  useToast: () => ({showToast: vi.fn()}),
}));

describe('ConnectionCreateHint', () => {
  it('renders the instruction and the redirect URI as a read-only copy field', () => {
    render(
      <ConnectionCreateHint
        instruction="Create an OAuth client for your app, then enter the credentials it gives you."
        redirectUri="https://id.acme.io/gate/callback"
      />,
    );

    expect(
      screen.getByText('Create an OAuth client for your app, then enter the credentials it gives you.'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://id.acme.io/gate/callback')).toBeInTheDocument();
    expect(screen.getByTestId('create-hint-redirect-uri-copy')).toBeInTheDocument();
  });
});
