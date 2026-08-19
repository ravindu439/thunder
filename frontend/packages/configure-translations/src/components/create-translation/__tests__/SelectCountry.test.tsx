// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, renderHook, screen} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, expect, it, vi, beforeAll, beforeEach} from 'vitest';
import SelectCountry from '@/components/create-translation/SelectCountry';

const mockCountries = [
  {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
  {name: 'Germany', regionCode: 'DE', flag: '🇩🇪'},
  {name: 'Japan', regionCode: 'JP', flag: '🇯🇵'},
];

vi.mock('@thunderid/i18n', () => ({
  buildCountryOptions: () => mockCountries,
}));

const defaultProps = {
  selectedCountry: null,
  onCountryChange: vi.fn(),
  onReadyChange: vi.fn(),
};

describe('SelectCountry', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation('translations')).result.current);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the step title and subtitle', () => {
      render(<SelectCountry {...defaultProps} />);

      expect(screen.getByText(t('language.create.country.title'))).toBeInTheDocument();
      expect(screen.getByText(t('language.create.country.subtitle'))).toBeInTheDocument();
    });

    it('renders the country autocomplete label', () => {
      render(<SelectCountry {...defaultProps} />);

      expect(screen.getByText(t('language.create.countryLabel'))).toBeInTheDocument();
    });

    it('renders the helper tip', () => {
      render(<SelectCountry {...defaultProps} />);

      expect(screen.getByText(t('language.create.country.helperText'))).toBeInTheDocument();
    });

    it('renders the autocomplete combobox', () => {
      render(<SelectCountry {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('Options', () => {
    it('shows all country options when the dropdown is opened', async () => {
      const user = userEvent.setup();

      render(<SelectCountry {...defaultProps} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.getByText('Japan')).toBeInTheDocument();
    });

    it('shows the region code chip for each option', async () => {
      const user = userEvent.setup();

      render(<SelectCountry {...defaultProps} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('FR')).toBeInTheDocument();
      expect(screen.getByText('DE')).toBeInTheDocument();
    });

    it('filters options by country name', async () => {
      const user = userEvent.setup();

      render(<SelectCountry {...defaultProps} />);

      await user.type(screen.getByRole('combobox'), 'Ger');

      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('France')).not.toBeInTheDocument();
    });

    it('filters options by region code', async () => {
      const user = userEvent.setup();

      render(<SelectCountry {...defaultProps} />);

      await user.type(screen.getByRole('combobox'), 'JP');

      expect(screen.getByText('Japan')).toBeInTheDocument();
      expect(screen.queryByText('France')).not.toBeInTheDocument();
    });
  });

  describe('onReadyChange', () => {
    it('calls onReadyChange(false) on mount when no country is selected', () => {
      const onReadyChange = vi.fn();

      render(<SelectCountry {...defaultProps} onReadyChange={onReadyChange} selectedCountry={null} />);

      expect(onReadyChange).toHaveBeenCalledWith(false);
    });

    it('calls onReadyChange(true) on mount when a country is already selected', () => {
      const onReadyChange = vi.fn();

      render(<SelectCountry {...defaultProps} onReadyChange={onReadyChange} selectedCountry={mockCountries[0]} />);

      expect(onReadyChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Interaction', () => {
    it('calls onCountryChange with the selected country when an option is clicked', async () => {
      const onCountryChange = vi.fn();
      const user = userEvent.setup();

      render(<SelectCountry {...defaultProps} onCountryChange={onCountryChange} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('France'));

      expect(onCountryChange).toHaveBeenCalledWith(mockCountries[0]);
    });

    it('calls onCountryChange(null) when the selection is cleared', async () => {
      const onCountryChange = vi.fn();
      const user = userEvent.setup();

      render(<SelectCountry {...defaultProps} selectedCountry={mockCountries[0]} onCountryChange={onCountryChange} />);

      await user.clear(screen.getByRole('combobox'));

      expect(onCountryChange).toHaveBeenCalledWith(null);
    });
  });
});
