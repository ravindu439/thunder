// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react';
import type {ReactNode} from 'react';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import withDesign from '../withDesign';

// Capture props passed to DesignProvider
let capturedDesignProp: unknown;
let capturedShouldResolveDesignInternally: unknown;

vi.mock('@thunderid/design', () => ({
  DesignProvider: ({
    children,
    design = undefined,
    shouldResolveDesignInternally = undefined,
  }: {
    children: ReactNode;
    design?: unknown;
    shouldResolveDesignInternally?: boolean;
  }) => {
    capturedDesignProp = design;
    capturedShouldResolveDesignInternally = shouldResolveDesignInternally;
    return <div data-testid="design-provider">{children}</div>;
  },
}));

const mockUseThunderID = vi.fn();
vi.mock('@thunderid/react', () => ({
  useThunderID: (): {meta?: {design?: unknown}} => mockUseThunderID() as {meta?: {design?: unknown}},
}));

function MockChild() {
  return <div data-testid="mock-child">Child Component</div>;
}
const WithDesignComponent = withDesign(MockChild);

describe('withDesign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedDesignProp = undefined;
    capturedShouldResolveDesignInternally = undefined;
    mockUseThunderID.mockReturnValue({meta: undefined});
  });

  it('renders without crashing', () => {
    const {container} = render(<WithDesignComponent />);
    expect(container).toBeInTheDocument();
  });

  it('renders DesignProvider', () => {
    render(<WithDesignComponent />);
    expect(screen.getByTestId('design-provider')).toBeInTheDocument();
  });

  it('renders the wrapped component', () => {
    render(<WithDesignComponent />);
    expect(screen.getByTestId('mock-child')).toBeInTheDocument();
  });

  it('passes meta.design from useThunderID to DesignProvider', () => {
    const mockDesign = {theme: {colors: {primary: '#ff5700'}}, layout: {}};
    mockUseThunderID.mockReturnValue({meta: {design: mockDesign}});

    render(<WithDesignComponent />);
    expect(capturedDesignProp).toEqual(mockDesign);
  });

  it('passes undefined to DesignProvider when meta is undefined', () => {
    mockUseThunderID.mockReturnValue({meta: undefined});

    render(<WithDesignComponent />);
    expect(capturedDesignProp).toBeUndefined();
  });

  it('passes undefined to DesignProvider when meta.design is undefined', () => {
    mockUseThunderID.mockReturnValue({meta: {design: undefined}});

    render(<WithDesignComponent />);
    expect(capturedDesignProp).toBeUndefined();
  });

  it('passes shouldResolveDesignInternally={false} to DesignProvider', () => {
    render(<WithDesignComponent />);
    expect(capturedShouldResolveDesignInternally).toBe(false);
  });

  it('wraps different components correctly', () => {
    function AnotherChild() {
      return <div data-testid="another-child">Another Component</div>;
    }
    const AnotherWrapped = withDesign(AnotherChild);

    render(<AnotherWrapped />);
    expect(screen.getByTestId('another-child')).toBeInTheDocument();
    expect(screen.getByTestId('design-provider')).toBeInTheDocument();
  });
});
