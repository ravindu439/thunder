// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, renderHook, screen} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, expect, it, vi, beforeAll, beforeEach} from 'vitest';
import ReviewLocaleCode from '@/components/create-translation/ReviewLocaleCode';

vi.mock('@thunderid/i18n', () => ({
  getDisplayNameForCode: (code: string) => (code ? `Name(${code})` : null),
  toFlagEmoji: (code: string) => (code ? `Flag(${code})` : ''),
}));

const derivedLocale = {code: 'fr-FR', displayName: 'French (France)', flag: '🇫🇷'};

const defaultProps = {
  derivedLocale,
  localeCode: '',
  onLocaleCodeChange: vi.fn(),
  onReadyChange: vi.fn(),
};

describe('ReviewLocaleCode', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation('translations')).result.current);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the step title and subtitle', () => {
      render(<ReviewLocaleCode {...defaultProps} />);

      expect(screen.getByText(t('language.create.localeCode.title'))).toBeInTheDocument();
      expect(screen.getByText(t('language.create.localeCode.subtitle'))).toBeInTheDocument();
    });

    it('renders the locale code input with the derived locale as placeholder', () => {
      render(<ReviewLocaleCode {...defaultProps} />);

      expect(screen.getByPlaceholderText('fr-FR')).toBeInTheDocument();
    });

    it('renders the BCP 47 helper tip', () => {
      render(<ReviewLocaleCode {...defaultProps} />);

      expect(screen.getByText(t('language.add.code.helperText'))).toBeInTheDocument();
    });
  });

  describe('Preview', () => {
    it('shows the derived locale code in the chip when localeCode is empty', () => {
      render(<ReviewLocaleCode {...defaultProps} localeCode="" />);

      expect(screen.getByText('fr-FR')).toBeInTheDocument();
    });

    it('shows the override code in the chip when localeCode is set', () => {
      render(<ReviewLocaleCode {...defaultProps} localeCode="fr-CA" />);

      expect(screen.getByText('fr-CA')).toBeInTheDocument();
    });

    it('shows the resolved display name from the effective code', () => {
      render(<ReviewLocaleCode {...defaultProps} localeCode="" />);

      // effectiveCode = 'fr-FR' → getDisplayNameForCode('fr-FR') = 'Name(fr-FR)'
      expect(screen.getByText('Name(fr-FR)')).toBeInTheDocument();
    });

    it('shows the display name for the override code when set', () => {
      render(<ReviewLocaleCode {...defaultProps} localeCode="fr-CA" />);

      expect(screen.getByText('Name(fr-CA)')).toBeInTheDocument();
    });
  });

  describe('onReadyChange', () => {
    it('calls onReadyChange(true) on mount when derivedLocale.code is non-empty', () => {
      const onReadyChange = vi.fn();

      render(<ReviewLocaleCode {...defaultProps} onReadyChange={onReadyChange} localeCode="" />);

      // effectiveCode falls back to derivedLocale.code = 'fr-FR', so ready
      expect(onReadyChange).toHaveBeenCalledWith(true);
    });

    it('calls onReadyChange(true) when an override code is provided', () => {
      const onReadyChange = vi.fn();

      render(<ReviewLocaleCode {...defaultProps} onReadyChange={onReadyChange} localeCode="en-AU" />);

      expect(onReadyChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Interaction', () => {
    it('calls onLocaleCodeChange when the user types in the input', async () => {
      const onLocaleCodeChange = vi.fn();
      const user = userEvent.setup();

      render(<ReviewLocaleCode {...defaultProps} onLocaleCodeChange={onLocaleCodeChange} localeCode="" />);

      // The input is controlled (value={localeCode}) so onChange fires once per
      // keystroke with just that character. Type a single character to keep the
      // assertion simple and deterministic.
      await user.type(screen.getByPlaceholderText('fr-FR'), 'f');

      expect(onLocaleCodeChange).toHaveBeenCalledWith('f');
    });
  });
});
