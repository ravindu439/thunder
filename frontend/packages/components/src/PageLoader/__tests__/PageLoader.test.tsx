// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import PageLoader from '../PageLoader';

describe('PageLoader', () => {
  it('renders the spinner', () => {
    render(<PageLoader />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
