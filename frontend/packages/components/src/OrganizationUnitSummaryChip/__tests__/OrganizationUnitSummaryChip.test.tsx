// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import OrganizationUnitSummaryChip from '../OrganizationUnitSummaryChip';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

describe('OrganizationUnitSummaryChip', () => {
  it('renders the label and value', () => {
    render(
      <OrganizationUnitSummaryChip
        icon={<span data-testid="fallback-icon" />}
        label="Organization Unit"
        value="Default"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Organization Unit')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('renders the default "Change" label when a change handler is provided', () => {
    render(
      <OrganizationUnitSummaryChip icon={<span />} label="Organization Unit" value="Default" onChange={vi.fn()} />,
    );

    expect(screen.getByText('Change')).toBeInTheDocument();
  });

  it('renders a custom change label when provided', () => {
    render(
      <OrganizationUnitSummaryChip
        icon={<span />}
        label="Organization Unit"
        value="Default"
        onChange={vi.fn()}
        changeLabel="Switch"
      />,
    );

    expect(screen.getByText('Switch')).toBeInTheDocument();
    expect(screen.queryByText('Change')).not.toBeInTheDocument();
  });

  it('does not render a change affordance when onChange is omitted', () => {
    render(<OrganizationUnitSummaryChip icon={<span />} label="Organization Unit" value="Default" />);

    expect(screen.queryByText('Change')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('invokes onChange when the change link is clicked', () => {
    const onChange = vi.fn();
    render(
      <OrganizationUnitSummaryChip icon={<span />} label="Organization Unit" value="Default" onChange={onChange} />,
    );

    fireEvent.click(screen.getByText('Change'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('invokes onChange when Enter is pressed on the change link', () => {
    const onChange = vi.fn();
    render(
      <OrganizationUnitSummaryChip icon={<span />} label="Organization Unit" value="Default" onChange={onChange} />,
    );

    fireEvent.keyDown(screen.getByText('Change'), {key: 'Enter'});

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('invokes onChange when Space is pressed on the change link', () => {
    const onChange = vi.fn();
    render(
      <OrganizationUnitSummaryChip icon={<span />} label="Organization Unit" value="Default" onChange={onChange} />,
    );

    fireEvent.keyDown(screen.getByText('Change'), {key: ' '});

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('ignores unrelated key presses on the change link', () => {
    const onChange = vi.fn();
    render(
      <OrganizationUnitSummaryChip icon={<span />} label="Organization Unit" value="Default" onChange={onChange} />,
    );

    fireEvent.keyDown(screen.getByText('Change'), {key: 'a'});

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders the icon fallback when no logoUrl is provided', () => {
    render(
      <OrganizationUnitSummaryChip
        icon={<span data-testid="fallback-icon" />}
        label="Organization Unit"
        value="Default"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
  });
});
