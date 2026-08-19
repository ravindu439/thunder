// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, screen} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import SlotEditor from '../SlotEditor';

describe('SlotEditor', () => {
  describe('Slot name', () => {
    it('renders the slot name label', () => {
      render(<SlotEditor name="header" slot={{}} onUpdate={vi.fn()} />);
      expect(screen.getByText('header')).toBeInTheDocument();
    });
  });

  describe('Top-level fields', () => {
    it('renders a Height slider when height is defined', () => {
      render(<SlotEditor name="header" slot={{height: 64}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Height')).toBeInTheDocument();
      expect(screen.getByText('64px')).toBeInTheDocument();
    });

    it('does not render a Height slider when height is undefined', () => {
      render(<SlotEditor name="header" slot={{}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('Height')).not.toBeInTheDocument();
    });

    it('renders a Padding slider when padding is defined', () => {
      render(<SlotEditor name="header" slot={{padding: 16}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Padding')).toBeInTheDocument();
      expect(screen.getByText('16px')).toBeInTheDocument();
    });

    it('renders a Show logo switch when showLogo is defined', () => {
      render(<SlotEditor name="header" slot={{showLogo: true}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Show logo')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('renders a Back button switch when showBackButton is defined', () => {
      render(<SlotEditor name="header" slot={{showBackButton: false}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Back button')).toBeInTheDocument();
      expect(screen.getByRole('switch')).not.toBeChecked();
    });

    it('renders a Language selector switch when showLanguageSelector is defined', () => {
      render(<SlotEditor name="footer" slot={{showLanguageSelector: true}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Language selector')).toBeInTheDocument();
    });

    it('renders a Links switch when showLinks is defined', () => {
      render(<SlotEditor name="footer" slot={{showLinks: true}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Links')).toBeInTheDocument();
    });

    it('calls onUpdate with the slot name and height path when the height slider changes', () => {
      const onUpdate = vi.fn();
      render(<SlotEditor name="header" slot={{height: 64}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['header', 'height'], expect.any(Number));
    });

    it('calls onUpdate with the toggled value when the Show logo switch is clicked', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="header" slot={{showLogo: false}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('switch'));

      expect(onUpdate).toHaveBeenCalledWith(['header', 'showLogo'], true);
    });

    it('calls onUpdate with the padding path when the padding slider changes', () => {
      const onUpdate = vi.fn();
      render(<SlotEditor name="header" slot={{padding: 16}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['header', 'padding'], expect.any(Number));
    });

    it('calls onUpdate with the toggled value when the Back button switch is clicked', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="header" slot={{showBackButton: false}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('switch'));

      expect(onUpdate).toHaveBeenCalledWith(['header', 'showBackButton'], true);
    });

    it('calls onUpdate with the toggled value when the Language selector switch is clicked', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="footer" slot={{showLanguageSelector: false}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('switch'));

      expect(onUpdate).toHaveBeenCalledWith(['footer', 'showLanguageSelector'], true);
    });

    it('calls onUpdate with the toggled value when the Links switch is clicked', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="footer" slot={{showLinks: false}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('switch'));

      expect(onUpdate).toHaveBeenCalledWith(['footer', 'showLinks'], true);
    });
  });

  describe('Position section', () => {
    it('renders the Position section title when position is defined', () => {
      render(<SlotEditor name="header" slot={{position: {anchor: 'center'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Position')).toBeInTheDocument();
    });

    it('does not render the Position section when position is undefined', () => {
      render(<SlotEditor name="header" slot={{}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('Position')).not.toBeInTheDocument();
    });

    it('renders an Anchor select with all anchor options when anchor is defined', () => {
      render(<SlotEditor name="header" slot={{position: {anchor: 'center'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Anchor')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
    });

    it('renders a V-align select when verticalAlign is defined', () => {
      render(<SlotEditor name="header" slot={{position: {verticalAlign: 'top'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('V-align')).toBeInTheDocument();
      expect(screen.getByText('Top')).toBeInTheDocument();
    });

    it('calls onUpdate with the position path when the Anchor select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="header" slot={{position: {anchor: 'center'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Left'}));

      expect(onUpdate).toHaveBeenCalledWith(['header', 'position', 'anchor'], 'left');
    });

    it('calls onUpdate with the position path when the V-align select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="header" slot={{position: {verticalAlign: 'top'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Bottom'}));

      expect(onUpdate).toHaveBeenCalledWith(['header', 'position', 'verticalAlign'], 'bottom');
    });
  });

  describe('Container section', () => {
    it('renders the Container section title when container is defined', () => {
      render(<SlotEditor name="body" slot={{container: {maxWidth: 480}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Container')).toBeInTheDocument();
    });

    it('does not render the Container section when container is undefined', () => {
      render(<SlotEditor name="body" slot={{}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('Container')).not.toBeInTheDocument();
    });

    it('renders a Max width slider when maxWidth is defined', () => {
      render(<SlotEditor name="body" slot={{container: {maxWidth: 480}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Max width')).toBeInTheDocument();
      expect(screen.getByText('480px')).toBeInTheDocument();
    });

    it('renders a Border radius slider when borderRadius is defined', () => {
      render(<SlotEditor name="body" slot={{container: {borderRadius: 8}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Border radius')).toBeInTheDocument();
    });

    it('renders an Elevation select with numeric options when elevation is defined', () => {
      render(<SlotEditor name="body" slot={{container: {elevation: 2}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Elevation')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders a Background select when background is defined', () => {
      render(<SlotEditor name="body" slot={{container: {background: 'paper'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Background')).toBeInTheDocument();
      expect(screen.getByText('Paper')).toBeInTheDocument();
    });

    it('calls onUpdate with a numeric value for elevation changes via the select', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="body" slot={{container: {elevation: 0}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: '3'}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'container', 'elevation'], 3);
    });

    it('calls onUpdate with the container path when the max width slider changes', () => {
      const onUpdate = vi.fn();
      render(<SlotEditor name="body" slot={{container: {maxWidth: 480}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'container', 'maxWidth'], expect.any(Number));
    });

    it('calls onUpdate with the container path when the container padding slider changes', () => {
      const onUpdate = vi.fn();
      render(<SlotEditor name="body" slot={{container: {padding: 8}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'container', 'padding'], expect.any(Number));
    });

    it('calls onUpdate with the container path when the border radius slider changes', () => {
      const onUpdate = vi.fn();
      render(<SlotEditor name="body" slot={{container: {borderRadius: 8}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'container', 'borderRadius'], expect.any(Number));
    });

    it('calls onUpdate with the container path when the Background select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="body" slot={{container: {background: 'paper'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Transparent'}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'container', 'background'], 'transparent');
    });
  });

  describe('Layout section', () => {
    it('renders the Layout section title when layout is defined', () => {
      render(<SlotEditor name="body" slot={{layout: {type: 'stack'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Layout')).toBeInTheDocument();
    });

    it('does not render the Layout section when layout is undefined', () => {
      render(<SlotEditor name="body" slot={{}} onUpdate={vi.fn()} />);
      expect(screen.queryByText('Layout')).not.toBeInTheDocument();
    });

    it('renders a Type select with Stack and Grid options', () => {
      render(<SlotEditor name="body" slot={{layout: {type: 'stack'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Stack')).toBeInTheDocument();
    });

    it('renders a Direction select when direction is defined', () => {
      render(<SlotEditor name="body" slot={{layout: {direction: 'row'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Direction')).toBeInTheDocument();
      expect(screen.getByText('Row')).toBeInTheDocument();
    });

    it('renders a Gap slider when gap is defined', () => {
      render(<SlotEditor name="body" slot={{layout: {gap: 12}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Gap')).toBeInTheDocument();
      expect(screen.getByText('12px')).toBeInTheDocument();
    });

    it('renders a Justify select when justify is defined', () => {
      render(<SlotEditor name="body" slot={{layout: {justify: 'center'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Justify')).toBeInTheDocument();
    });

    it('renders an Align select when align is defined', () => {
      render(<SlotEditor name="body" slot={{layout: {align: 'stretch'}}} onUpdate={vi.fn()} />);
      expect(screen.getByText('Align')).toBeInTheDocument();
      expect(screen.getByText('Stretch')).toBeInTheDocument();
    });

    it('calls onUpdate with the layout path when the direction select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="body" slot={{layout: {direction: 'column'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Row'}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'layout', 'direction'], 'row');
    });

    it('calls onUpdate with the layout path when the Type select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="body" slot={{layout: {type: 'stack'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Grid'}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'layout', 'type'], 'grid');
    });

    it('calls onUpdate with the layout path when the gap slider changes', () => {
      const onUpdate = vi.fn();
      render(<SlotEditor name="body" slot={{layout: {gap: 12}}} onUpdate={onUpdate} />);

      const slider = screen.getByRole('slider');
      slider.focus();
      slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'layout', 'gap'], expect.any(Number));
    });

    it('calls onUpdate with the layout path when the Justify select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="body" slot={{layout: {justify: 'center'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Between'}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'layout', 'justify'], 'space-between');
    });

    it('calls onUpdate with the layout path when the Align select changes', async () => {
      const onUpdate = vi.fn();
      const user = userEvent.setup();
      render(<SlotEditor name="body" slot={{layout: {align: 'center'}}} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(await screen.findByRole('option', {name: 'Stretch'}));

      expect(onUpdate).toHaveBeenCalledWith(['body', 'layout', 'align'], 'stretch');
    });
  });

  describe('Full slot definition', () => {
    it('renders every applicable section at once for a fully populated slot', () => {
      render(
        <SlotEditor
          name="header"
          slot={{
            height: 64,
            padding: 16,
            showLogo: true,
            position: {anchor: 'left', verticalAlign: 'top'},
            container: {maxWidth: 400, padding: 8, borderRadius: 4, elevation: 1, background: 'default'},
            layout: {type: 'grid', direction: 'row', gap: 8, justify: 'flex-start', align: 'center'},
          }}
          onUpdate={vi.fn()}
        />,
      );

      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Container')).toBeInTheDocument();
      expect(screen.getByText('Layout')).toBeInTheDocument();
    });
  });
});
