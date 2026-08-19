// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import App from '../App';

vi.mock('../pages/AcceptInvitePage', () => ({default: () => null}));
vi.mock('../pages/ErrorPage', () => ({default: () => null}));
vi.mock('../pages/RecoveryPage', () => ({default: () => null}));
vi.mock('../pages/SignInPage', () => ({default: () => null}));
vi.mock('../pages/SignUpPage', () => ({default: () => null}));

describe('App', () => {
  it('renders without crashing', () => {
    const {container} = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
