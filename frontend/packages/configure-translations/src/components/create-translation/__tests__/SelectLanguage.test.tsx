// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, renderHook, screen} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, expect, it, vi, beforeAll, beforeEach} from 'vitest';
import SelectLanguage from '@/components/create-translation/SelectLanguage';

const mockLocales = [
  {code: 'fr-FR', displayName: 'French (France)', flag: '🇫🇷'},
  {code: 'fr-BE', displayName: 'French (Belgium)', flag: '🇧🇪'},
  {code: 'fr-CA', displayName: 'French (Canada)', flag: '🇨🇦'},
];

vi.mock('@thunderid/i18n', () => ({
  buildLocaleOptions: vi.fn(() => mockLocales),
}));

const selectedCountry = {name: 'France', regionCode: 'FR', flag: '🇫🇷'};

const defaultProps = {
  selectedCountry,
  selectedLocale: null,
  onLocaleChange: vi.fn(),
  onReadyChange: vi.fn(),
};

describe('SelectLanguage', () => {
  let t: (key: string, options?: Record<string, unknown>) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation('translations')).result.current);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the step title and subtitle', () => {
      render(<SelectLanguage {...defaultProps} />);

      expect(screen.getByText(t('language.create.language.title'))).toBeInTheDocument();
      expect(
        screen.getByText(t('language.create.language.subtitle', {country: selectedCountry.name})),
      ).toBeInTheDocument();
    });

    it('renders the language autocomplete label', () => {
      render(<SelectLanguage {...defaultProps} />);

      expect(screen.getByText(t('language.create.language.label'))).toBeInTheDocument();
    });

    it('renders the helper tip', () => {
      render(<SelectLanguage {...defaultProps} />);

      expect(screen.getByText(t('language.create.language.helperText'))).toBeInTheDocument();
    });

    it('renders the autocomplete combobox', () => {
      render(<SelectLanguage {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Options', () => {
    it('shows all locale options when the dropdown is opened', async () => {
      const user = userEvent.setup();

      render(<SelectLanguage {...defaultProps} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('French (France)')).toBeInTheDocument();
      expect(screen.getByText('French (Belgium)')).toBeInTheDocument();
      expect(screen.getByText('French (Canada)')).toBeInTheDocument();
    });

    it('shows the BCP 47 code chip for each option', async () => {
      const user = userEvent.setup();

      render(<SelectLanguage {...defaultProps} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('fr-FR')).toBeInTheDocument();
      expect(screen.getByText('fr-BE')).toBeInTheDocument();
    });

    it('filters options by display name', async () => {
      const user = userEvent.setup();

      render(<SelectLanguage {...defaultProps} />);

      await user.type(screen.getByRole('combobox'), 'Belgium');

      expect(screen.getByText('French (Belgium)')).toBeInTheDocument();
      expect(screen.queryByText('French (France)')).not.toBeInTheDocument();
    });

    it('filters options by locale code', async () => {
      const user = userEvent.setup();

      render(<SelectLanguage {...defaultProps} />);

      await user.type(screen.getByRole('combobox'), 'fr-CA');

      expect(screen.getByText('French (Canada)')).toBeInTheDocument();
      expect(screen.queryByText('French (Belgium)')).not.toBeInTheDocument();
    });
  });

  describe('buildLocaleOptions', () => {
    it('calls buildLocaleOptions with the selected country regionCode', async () => {
      const {buildLocaleOptions} = await import('@thunderid/i18n');

      render(<SelectLanguage {...defaultProps} />);

      expect(buildLocaleOptions).toHaveBeenCalledWith('FR');
    });
  });

  describe('onReadyChange', () => {
    it('calls onReadyChange(false) on mount when no locale is selected', () => {
      const onReadyChange = vi.fn();

      render(<SelectLanguage {...defaultProps} onReadyChange={onReadyChange} selectedLocale={null} />);

      expect(onReadyChange).toHaveBeenCalledWith(false);
    });

    it('calls onReadyChange(true) on mount when a locale is already selected', () => {
      const onReadyChange = vi.fn();

      render(<SelectLanguage {...defaultProps} onReadyChange={onReadyChange} selectedLocale={mockLocales[0]} />);

      expect(onReadyChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Interaction', () => {
    it('calls onLocaleChange with the selected locale when an option is clicked', async () => {
      const onLocaleChange = vi.fn();
      const user = userEvent.setup();

      render(<SelectLanguage {...defaultProps} onLocaleChange={onLocaleChange} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('French (France)'));

      expect(onLocaleChange).toHaveBeenCalledWith(mockLocales[0]);
    });

    it('calls onLocaleChange(null) when the selection is cleared', async () => {
      const onLocaleChange = vi.fn();
      const user = userEvent.setup();

      render(<SelectLanguage {...defaultProps} selectedLocale={mockLocales[0]} onLocaleChange={onLocaleChange} />);

      await user.clear(screen.getByRole('combobox'));

      expect(onLocaleChange).toHaveBeenCalledWith(null);
    });
  });
});
