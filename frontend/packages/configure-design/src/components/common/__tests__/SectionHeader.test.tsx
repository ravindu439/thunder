// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {Palette} from '@wso2/oxygen-ui-icons-react';
import {describe, it, expect} from 'vitest';
import SectionHeader from '../SectionHeader';

describe('SectionHeader', () => {
  describe('Rendering', () => {
    it('renders the title', () => {
      render(<SectionHeader title="Themes" count={5} icon={<Palette />} />);
      expect(screen.getByText('Themes')).toBeInTheDocument();
    });

    it('renders the count', () => {
      render(<SectionHeader title="Themes" count={5} icon={<Palette />} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders zero count', () => {
      render(<SectionHeader title="Themes" count={0} icon={<Palette />} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders icon', () => {
      const {container} = render(<SectionHeader title="Themes" count={3} icon={<Palette />} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Optional action prop', () => {
    it('renders action element when provided', () => {
      const action = <button type="button">Add</button>;
      render(<SectionHeader title="Themes" count={3} icon={<Palette />} action={action} />);
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('does not render action area when not provided', () => {
      render(<SectionHeader title="Themes" count={3} icon={<Palette />} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('comingSoon prop', () => {
    it('renders "Coming Soon" badge when comingSoon is true', () => {
      render(<SectionHeader title="Themes" count={3} icon={<Palette />} comingSoon />);
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    });

    it('does not render "Coming Soon" badge by default', () => {
      render(<SectionHeader title="Themes" count={3} icon={<Palette />} />);
      expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    });

    it('does not render "Coming Soon" badge when comingSoon is false', () => {
      render(<SectionHeader title="Themes" count={3} icon={<Palette />} comingSoon={false} />);
      expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    });
  });
});
