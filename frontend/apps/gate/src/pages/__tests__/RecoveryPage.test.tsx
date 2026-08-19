// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import RecoveryPage from '../RecoveryPage';

// Mock the Recovery component
vi.mock('../../components/Recovery/Recovery', () => ({
  default: () => <div data-testid="recovery-component">Recovery Component</div>,
}));

describe('RecoveryPage', () => {
  it('renders without crashing', () => {
    const {container} = render(<RecoveryPage />);
    expect(container).toBeInTheDocument();
  });

  it('renders Recovery component', () => {
    render(<RecoveryPage />);
    expect(screen.getByTestId('recovery-component')).toBeInTheDocument();
  });
});
