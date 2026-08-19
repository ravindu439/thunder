// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import SignInSlogan from '../SignInSlogan';

describe('SignInSlogan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const {container} = render(<SignInSlogan />);
    expect(container).toBeInTheDocument();
  });

  it('renders all slogan items', () => {
    render(<SignInSlogan />);
    expect(screen.getByText('Agent-native Identity')).toBeInTheDocument();
    expect(screen.getByText('Post-quantum-safe by Design')).toBeInTheDocument();
    expect(screen.getByText('Lightweight Runtime with GitOps Support')).toBeInTheDocument();
  });

  it('renders item descriptions', () => {
    render(<SignInSlogan />);
    expect(screen.getByText(/Engineered with native Agent ID/)).toBeInTheDocument();
    expect(screen.getByText(/Built on a post-quantum cryptographic foundation/)).toBeInTheDocument();
    expect(screen.getByText(/Cloud-native, API-first runtime/)).toBeInTheDocument();
  });

  it('renders with default logos', () => {
    const {rerender} = render(<SignInSlogan />);
    rerender(<SignInSlogan />);

    const logo = screen.getByAltText('Logo (Light)');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('/assets/images/logo.svg'));
    expect(logo).toHaveStyle({height: '50px'});
  });
});
