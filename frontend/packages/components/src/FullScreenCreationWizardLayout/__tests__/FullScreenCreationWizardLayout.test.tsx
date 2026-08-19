// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen, fireEvent} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';
import FullScreenCreationWizardLayout from '../FullScreenCreationWizardLayout';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

describe('FullScreenCreationWizardLayout', () => {
  const breadcrumbItems = [{key: 'step', label: 'Step 1'}];

  it('renders the breadcrumb, children, and footer', () => {
    render(
      <FullScreenCreationWizardLayout
        onClose={vi.fn()}
        progress={50}
        breadcrumbItems={breadcrumbItems}
        footer={<div>Footer content</div>}
      >
        <div>Step content</div>
      </FullScreenCreationWizardLayout>,
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('invokes onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <FullScreenCreationWizardLayout onClose={onClose} progress={0} breadcrumbItems={breadcrumbItems} footer={null}>
        <div>Step content</div>
      </FullScreenCreationWizardLayout>,
    );

    fireEvent.click(screen.getByRole('button', {name: 'Close'}));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the progress bar with the given value', () => {
    render(
      <FullScreenCreationWizardLayout onClose={vi.fn()} progress={42} breadcrumbItems={breadcrumbItems} footer={null}>
        <div>Step content</div>
      </FullScreenCreationWizardLayout>,
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });

  it('does not render a preview panel by default', () => {
    render(
      <FullScreenCreationWizardLayout onClose={vi.fn()} progress={0} breadcrumbItems={breadcrumbItems} footer={null}>
        <div>Step content</div>
      </FullScreenCreationWizardLayout>,
    );

    expect(screen.queryByText('Preview content')).not.toBeInTheDocument();
  });

  it('renders full width content when contentMaxWidth is false', () => {
    render(
      <FullScreenCreationWizardLayout
        onClose={vi.fn()}
        progress={0}
        breadcrumbItems={breadcrumbItems}
        footer={null}
        contentMaxWidth={false}
      >
        <div>Step content</div>
      </FullScreenCreationWizardLayout>,
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('renders a preview panel when provided', () => {
    render(
      <FullScreenCreationWizardLayout
        onClose={vi.fn()}
        progress={0}
        breadcrumbItems={breadcrumbItems}
        footer={null}
        preview={<div>Preview content</div>}
      >
        <div>Step content</div>
      </FullScreenCreationWizardLayout>,
    );

    expect(screen.getByText('Preview content')).toBeInTheDocument();
  });
});
