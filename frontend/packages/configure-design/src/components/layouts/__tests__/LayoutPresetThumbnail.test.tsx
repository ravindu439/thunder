// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render} from '@thunderid/test-utils';
import {describe, it, expect} from 'vitest';
import LayoutPresetThumbnail from '../LayoutPresetThumbnail';

describe('LayoutPresetThumbnail', () => {
  describe('Rendering without crashing', () => {
    it('renders the centered variant', () => {
      const {container} = render(<LayoutPresetThumbnail variant="centered" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders the split variant', () => {
      const {container} = render(<LayoutPresetThumbnail variant="split" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders the fullscreen variant', () => {
      const {container} = render(<LayoutPresetThumbnail variant="fullscreen" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders the popup variant', () => {
      const {container} = render(<LayoutPresetThumbnail variant="popup" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Distinct rendering per variant', () => {
    it('renders different DOM for "centered" vs "split"', () => {
      const {container: a} = render(<LayoutPresetThumbnail variant="centered" />);
      const {container: b} = render(<LayoutPresetThumbnail variant="split" />);
      // The inner HTML may differ as each variant has a unique layout
      expect(a.innerHTML).not.toBe(b.innerHTML);
    });

    it('renders different DOM for "fullscreen" vs "popup"', () => {
      const {container: a} = render(<LayoutPresetThumbnail variant="fullscreen" />);
      const {container: b} = render(<LayoutPresetThumbnail variant="popup" />);
      expect(a.innerHTML).not.toBe(b.innerHTML);
    });
  });

  describe('Accessibility', () => {
    it('centered variant renders a container element', () => {
      const {container} = render(<LayoutPresetThumbnail variant="centered" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('split variant renders visual content (no missing elements)', () => {
      const {container} = render(<LayoutPresetThumbnail variant="split" />);
      expect(container.childElementCount).toBeGreaterThan(0);
    });
  });
});
