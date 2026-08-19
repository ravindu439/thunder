// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {screen} from '@testing-library/react';
import {TEST_CN_PREFIX} from '@thunderid/test-utils';
import {describe, it, expect} from 'vitest';
import type {FlowComponent} from '../../../../models/flow';
import renderWithProviders from '../../../../test/renderWithProviders';
import DividerAdapter from '../DividerAdapter';

describe('DividerAdapter', () => {
  it('renders a divider element', () => {
    const component: FlowComponent = {id: 'div-1', type: 'DIVIDER'};
    renderWithProviders(<DividerAdapter component={component} resolve={(s) => s} />);
    const divider = document.querySelector(`.${TEST_CN_PREFIX}Flow--divider`);
    expect(divider).toBeTruthy();
  });

  it('renders with label text', () => {
    const component: FlowComponent = {id: 'div-1', type: 'DIVIDER', label: 'OR'};
    renderWithProviders(<DividerAdapter component={component} resolve={(s) => s} />);
    expect(screen.getByText('OR')).toBeTruthy();
  });

  it('applies product prefix CSS class names', () => {
    const component: FlowComponent = {id: 'div-1', type: 'DIVIDER'};
    renderWithProviders(<DividerAdapter component={component} resolve={(s) => s} />);
    const divider = document.querySelector(`.${TEST_CN_PREFIX}Divider--root`);
    expect(divider).toBeTruthy();
  });
});
