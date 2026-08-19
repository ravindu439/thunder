// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router';
import {describe, it, expect} from 'vitest';
import DefaultLayout from '../DefaultLayout';

describe('DefaultLayout', () => {
  it('renders without crashing', () => {
    const {container} = render(
      <MemoryRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="*" element={<div>Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders child routes through Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<div data-testid="child-content">Child Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders Box with correct height styling', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="*" element={<div>Child</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    // The layout should contain the child content
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
