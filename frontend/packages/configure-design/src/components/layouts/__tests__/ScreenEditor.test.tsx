// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import ScreenEditor from '../ScreenEditor';

describe('ScreenEditor', () => {
  describe('Empty state', () => {
    it('renders the no-overrides message when the screen draft has no background, spacing, or slots', () => {
      render(<ScreenEditor screenDraft={{}} onUpdate={vi.fn()} />);
      expect(screen.getByText('No overrides — inherits from base screen')).toBeInTheDocument();
    });

    it('does not render the Background, Spacing, or Slots sections when empty', () => {
      render(<ScreenEditor screenDraft={{}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('Background')).not.toBeInTheDocument();
      expect(screen.queryByText('Spacing')).not.toBeInTheDocument();
      expect(screen.queryByText('Slots')).not.toBeInTheDocument();
    });
  });

  describe('Background section', () => {
    it('renders the Background section when background is defined', () => {
      render(<ScreenEditor screenDraft={{background: {type: 'solid'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Background')).toBeInTheDocument();
    });

    it('does not render the no-overrides message when a section is present', () => {
      render(<ScreenEditor screenDraft={{background: {type: 'solid'}}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('No overrides — inherits from base screen')).not.toBeInTheDocument();
    });

    it('renders a Type select with all background type options', () => {
      render(<ScreenEditor screenDraft={{background: {type: 'solid'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Solid')).toBeInTheDocument();
    });

    it('renders the raw background value when value is defined', () => {
      render(<ScreenEditor screenDraft={{background: {value: '#112233'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('#112233')).toBeInTheDocument();
    });

    it('calls onUpdate with the background type path when the Type select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<ScreenEditor screenDraft={{background: {type: 'solid'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Gradient'}));

      expect(onUpdate).toHaveBeenCalledWith(['background', 'type'], 'gradient');
    });
  });

  describe('Spacing section', () => {
    it('renders the Spacing section when spacing is defined', () => {
      render(<ScreenEditor screenDraft={{spacing: {componentGap: 8}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Spacing')).toBeInTheDocument();
    });

    it('renders a Component gap slider when componentGap is defined', () => {
      render(<ScreenEditor screenDraft={{spacing: {componentGap: 8}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Component gap')).toBeInTheDocument();
      expect(screen.getByText('8px')).toBeInTheDocument();
    });

    it('renders a Section gap slider when sectionGap is defined', () => {
      render(<ScreenEditor screenDraft={{spacing: {sectionGap: 24}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Section gap')).toBeInTheDocument();
      expect(screen.getByText('24px')).toBeInTheDocument();
    });

    it('calls onUpdate with the spacing path when the component gap slider changes', () => {
      const onUpdate = vi.fn();
      render(<ScreenEditor screenDraft={{spacing: {componentGap: 8}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['spacing', 'componentGap'], expect.any(Number));
    });

    it('calls onUpdate with the spacing path when the section gap slider changes', () => {
      const onUpdate = vi.fn();
      render(<ScreenEditor screenDraft={{spacing: {sectionGap: 24}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['spacing', 'sectionGap'], expect.any(Number));
    });
  });

  describe('Slots section', () => {
    it('renders the Slots section when slots has entries', () => {
      render(<ScreenEditor screenDraft={{slots: {header: {height: 64}}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Slots')).toBeInTheDocument();
      expect(screen.getByText('header')).toBeInTheDocument();
    });

    it('does not render the Slots section when slots is an empty object', () => {
      render(<ScreenEditor screenDraft={{slots: {}}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('Slots')).not.toBeInTheDocument();
    });

    it('renders one SlotEditor per slot entry', () => {
      render(
        <ScreenEditor screenDraft={{slots: {header: {height: 64}, footer: {showLinks: true}}}} onUpdate={vi.fn()} />,
      );
      expect(screen.getByText('header')).toBeInTheDocument();
      expect(screen.getByText('footer')).toBeInTheDocument();
    });

    it('prefixes onUpdate calls from a slot editor with the slots path', () => {
      const onUpdate = vi.fn();
      render(<ScreenEditor screenDraft={{slots: {header: {height: 64}}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['slots', 'header', 'height'], expect.any(Number));
    });
  });

  describe('Multiple sections combined', () => {
    it('renders Background, Spacing, and Slots sections together without the empty state', () => {
      render(
        <ScreenEditor
          screenDraft={{
            background: {type: 'solid'},
            spacing: {componentGap: 8},
            slots: {header: {height: 64}},
          }}
          onUpdate={vi.fn()}
        />,
      );

      expect(screen.getByText('Background')).toBeInTheDocument();
      expect(screen.getByText('Spacing')).toBeInTheDocument();
      expect(screen.getByText('Slots')).toBeInTheDocument();
      expect(screen.queryByText('No overrides — inherits from base screen')).not.toBeInTheDocument();
    });
  });
});
