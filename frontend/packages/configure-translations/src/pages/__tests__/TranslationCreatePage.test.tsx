// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, renderHook, screen, within} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, expect, it, vi, beforeAll, beforeEach} from 'vitest';
import type {ReviewLocaleCodeProps} from '@/components/create-translation/ReviewLocaleCode';
import type {SelectCountryProps} from '@/components/create-translation/SelectCountry';
import type {SelectLanguageProps} from '@/components/create-translation/SelectLanguage';
import type {TranslationCreateContextType} from '@/contexts/TranslationCreate/TranslationCreateContext';
import {TranslationCreateFlowStep} from '@/models/translation-create-flow';
import TranslationCreatePage from '@/pages/TranslationCreatePage';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const {mockRefetch, mockCreateTranslationsMutateAsync} = vi.hoisted(() => ({
  mockRefetch: vi.fn(),
  mockCreateTranslationsMutateAsync: vi.fn().mockResolvedValue({}),
}));

vi.mock('@thunderid/i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/i18n')>();
  return {
    ...actual,
    useGetTranslations: vi.fn().mockReturnValue({data: undefined, isLoading: false, refetch: mockRefetch}),
    useCreateTranslations: vi.fn().mockReturnValue({mutateAsync: mockCreateTranslationsMutateAsync}),
  };
});

vi.mock('@thunderid/logger/react', () => ({
  useLogger: () => ({error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn()}),
}));

// Stub step components so we can control onReadyChange
const mockSelectCountry = vi.fn<(props: SelectCountryProps) => void>();
const mockSelectLanguage = vi.fn<(props: SelectLanguageProps) => void>();
const mockReviewLocaleCode = vi.fn<(props: ReviewLocaleCodeProps) => void>();

vi.mock('@/components/create-translation/SelectCountry', () => ({
  default: (props: SelectCountryProps) => {
    mockSelectCountry(props);
    return (
      <div data-testid="select-country">
        <button type="button" onClick={() => props.onReadyChange?.(true)}>
          ready
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/create-translation/SelectLanguage', () => ({
  default: (props: SelectLanguageProps) => {
    mockSelectLanguage(props);
    return (
      <div data-testid="select-language">
        <button type="button" onClick={() => props.onReadyChange?.(true)}>
          ready
        </button>
      </div>
    );
  },
}));

vi.mock('@/components/create-translation/ReviewLocaleCode', () => ({
  default: (props: ReviewLocaleCodeProps) => {
    mockReviewLocaleCode(props);
    return <div data-testid="review-locale-code" />;
  },
}));

// Base context state – tests override individual fields as needed
const baseContext: TranslationCreateContextType = {
  currentStep: TranslationCreateFlowStep.COUNTRY,
  setCurrentStep: vi.fn(),
  selectedCountry: null,
  setSelectedCountry: vi.fn(),
  selectedLocale: null,
  setSelectedLocale: vi.fn(),
  localeCodeOverride: '',
  setLocaleCodeOverride: vi.fn(),
  localeCode: '',
  isCreating: false,
  setIsCreating: vi.fn(),
  error: null,
  setError: vi.fn(),
  reset: vi.fn(),
};

const mockUseTranslationCreate = vi.fn<() => TranslationCreateContextType>();

vi.mock('@/contexts/TranslationCreate/useTranslationCreate', () => ({
  default: () => mockUseTranslationCreate(),
}));

describe('TranslationCreatePage', () => {
  let t: (key: string, options?: Record<string, unknown>) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation()).result.current);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTranslationCreate.mockReturnValue({...baseContext});
  });

  describe('Rendering', () => {
    it('renders a linear progress bar', () => {
      render(<TranslationCreatePage />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders the current step breadcrumb label', () => {
      render(<TranslationCreatePage />);

      expect(screen.getByText(t('translations:language.create.steps.country'))).toBeInTheDocument();
    });

    it('renders the SelectCountry step on mount', () => {
      render(<TranslationCreatePage />);

      expect(screen.getByTestId('select-country')).toBeInTheDocument();
    });

    it('does not render the Back button on the first step', () => {
      render(<TranslationCreatePage />);

      expect(screen.queryByText(t('common:actions.back'))).not.toBeInTheDocument();
    });

    it('renders the Continue button on non-final steps', () => {
      render(<TranslationCreatePage />);

      expect(screen.getByText(t('common:actions.continue'))).toBeInTheDocument();
    });

    it('renders the Create button on the final step', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
      });

      render(<TranslationCreatePage />);

      expect(
        screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})),
      ).toBeInTheDocument();
    });

    it('renders the SelectLanguage step when currentStep is LANGUAGE', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LANGUAGE,
        selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
      });

      render(<TranslationCreatePage />);

      expect(screen.getByTestId('select-language')).toBeInTheDocument();
    });

    it('renders the ReviewLocaleCode step when currentStep is LOCALE_CODE', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        selectedLocale: {code: 'fr-FR', displayName: 'French (France)', flag: '🇫🇷'},
      });

      render(<TranslationCreatePage />);

      expect(screen.getByTestId('review-locale-code')).toBeInTheDocument();
    });

    it('renders an error alert when error is set', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        error: 'Something went wrong',
      });

      render(<TranslationCreatePage />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('clears the error when the alert is dismissed', async () => {
      const setError = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        error: 'Something went wrong',
        setError,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(within(screen.getByRole('alert')).getByRole('button', {name: /close/i}));

      expect(setError).toHaveBeenCalledWith(null);
    });

    it('does not render the SelectLanguage step when no country is selected yet', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LANGUAGE,
        selectedCountry: null,
      });

      render(<TranslationCreatePage />);

      expect(screen.queryByTestId('select-language')).not.toBeInTheDocument();
    });

    it('renders nothing for an unrecognized step', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: 'UNKNOWN_STEP' as TranslationCreateFlowStep,
      });

      render(<TranslationCreatePage />);

      expect(screen.queryByTestId('select-country')).not.toBeInTheDocument();
      expect(screen.queryByTestId('select-language')).not.toBeInTheDocument();
      expect(screen.queryByTestId('review-locale-code')).not.toBeInTheDocument();
    });
  });

  describe('Clearing stale errors on edit', () => {
    it('clears the error when the country changes', () => {
      const setError = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        setError,
      });

      render(<TranslationCreatePage />);

      mockSelectCountry.mock.calls[0][0].onCountryChange({name: 'France', regionCode: 'FR', flag: '🇫🇷'});

      expect(setError).toHaveBeenCalledWith(null);
    });

    it('clears the error when the language changes', () => {
      const setError = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LANGUAGE,
        selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
        setError,
      });

      render(<TranslationCreatePage />);

      mockSelectLanguage.mock.calls[0][0].onLocaleChange({code: 'fr-FR', displayName: 'French', flag: '🇫🇷'});

      expect(setError).toHaveBeenCalledWith(null);
    });

    it('clears the error when the locale code override changes', () => {
      const setError = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        selectedLocale: {code: 'fr-FR', displayName: 'French', flag: '🇫🇷'},
        setError,
      });

      render(<TranslationCreatePage />);

      mockReviewLocaleCode.mock.calls[0][0].onLocaleCodeChange('fr');

      expect(setError).toHaveBeenCalledWith(null);
    });
  });

  describe('Step readiness for the locale code step', () => {
    it('enables Create once ReviewLocaleCode reports ready', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        selectedLocale: {code: 'fr-FR', displayName: 'French', flag: '🇫🇷'},
      });

      render(<TranslationCreatePage />);

      mockReviewLocaleCode.mock.calls[0][0].onReadyChange(true);

      expect(
        screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})).closest('button'),
      ).not.toBeDisabled();
    });
  });

  describe('Resetting on country change', () => {
    it('resets the selected locale and language readiness when the country changes', () => {
      const setSelectedLocale = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
        setSelectedLocale,
      });

      const {rerender} = render(<TranslationCreatePage />);

      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        selectedCountry: {name: 'Germany', regionCode: 'DE', flag: '🇩🇪'},
        setSelectedLocale,
      });
      rerender(<TranslationCreatePage />);

      expect(setSelectedLocale).toHaveBeenCalledWith(null);
    });
  });

  describe('Step readiness', () => {
    it('disables Continue when the current step is not ready', () => {
      render(<TranslationCreatePage />);

      expect(screen.getByText(t('common:actions.continue')).closest('button')).toBeDisabled();
    });

    it('enables Continue after the step reports ready', async () => {
      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText('ready'));

      expect(screen.getByText(t('common:actions.continue')).closest('button')).not.toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('calls setCurrentStep with the next step when Continue is clicked', async () => {
      const setCurrentStep = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        setCurrentStep,
      });
      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      // Mark step ready then advance
      await user.click(screen.getByText('ready'));
      await user.click(screen.getByText(t('common:actions.continue')));

      expect(setCurrentStep).toHaveBeenCalledWith(TranslationCreateFlowStep.LANGUAGE);
    });

    it('calls setCurrentStep with the previous step when Back is clicked', async () => {
      const setCurrentStep = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LANGUAGE,
        selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
        setCurrentStep,
      });
      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('common:actions.back')));

      expect(setCurrentStep).toHaveBeenCalledWith(TranslationCreateFlowStep.COUNTRY);
    });

    it('navigates to /translations when the close button is clicked', async () => {
      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      // The close button renders an X icon; it's the only icon button in the header
      const closeButton = screen.getAllByRole('button')[0];
      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/translations');
    });
  });

  describe('Creating state', () => {
    it('disables Continue while isCreating is true', () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        isCreating: true,
      });

      render(<TranslationCreatePage />);

      expect(screen.getByText(t('common:actions.continue')).closest('button')).toBeDisabled();
    });

    it('logs and does not throw when navigating away on close fails', async () => {
      mockNavigate.mockRejectedValueOnce(new Error('navigation failed'));

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      const closeButton = screen.getAllByRole('button')[0];
      await user.click(closeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/translations');
    });

    it('does not navigate when the close button is clicked while isCreating is true', async () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        isCreating: true,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      const closeButton = screen.getAllByRole('button')[0];
      await user.click(closeButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Create flow', () => {
    it('calls setLocaleCodeOverride when advancing from LANGUAGE step', async () => {
      const setCurrentStep = vi.fn();
      const setLocaleCodeOverride = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LANGUAGE,
        selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
        selectedLocale: {code: 'fr-FR', displayName: 'French (France)', flag: '🇫🇷'},
        setCurrentStep,
        setLocaleCodeOverride,
      });
      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      // Mark step ready then advance
      await user.click(screen.getByText('ready'));
      await user.click(screen.getByText(t('common:actions.continue')));

      expect(setLocaleCodeOverride).toHaveBeenCalledWith('fr-FR');
      expect(setCurrentStep).toHaveBeenCalledWith(TranslationCreateFlowStep.LOCALE_CODE);
    });

    it('creates translations when Create is clicked on the final step', async () => {
      const setIsCreating = vi.fn();
      const setError = vi.fn();

      mockRefetch.mockResolvedValue({
        data: {
          translations: {
            common: {'actions.save': 'Save'},
          },
        },
        error: null,
      });

      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        localeCode: 'fr-FR',
        setIsCreating,
        setError,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})));

      expect(setIsCreating).toHaveBeenCalledWith(true);
      expect(mockRefetch).toHaveBeenCalled();

      // Wait for async create to complete
      await vi.waitFor(() => {
        expect(mockCreateTranslationsMutateAsync).toHaveBeenCalledWith({
          language: 'fr-FR',
          translations: {
            common: {'actions.save': 'Save'},
          },
        });
      });
    });

    it('sets error when fetching en-US translations fails during create', async () => {
      const setError = vi.fn();
      const setIsCreating = vi.fn();

      mockRefetch.mockResolvedValue({
        data: null,
        error: new Error('Fetch failed'),
      });

      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        localeCode: 'fr-FR',
        setError,
        setIsCreating,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})));

      await vi.waitFor(() => {
        expect(setError).toHaveBeenCalledWith('Failed to add language. Please try again.');
        expect(setIsCreating).toHaveBeenCalledWith(false);
      });
    });

    it('sets error when creating translations fails after fetching defaults', async () => {
      const setError = vi.fn();
      const setIsCreating = vi.fn();

      mockRefetch.mockResolvedValue({
        data: {
          translations: {
            common: {'actions.save': 'Save'},
          },
        },
        error: null,
      });
      mockCreateTranslationsMutateAsync.mockRejectedValueOnce(new Error('Create failed'));

      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        localeCode: 'fr-FR',
        setError,
        setIsCreating,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})));

      await vi.waitFor(() => {
        expect(setError).toHaveBeenCalledWith('Failed to add language. Please try again.');
        expect(setIsCreating).toHaveBeenCalledWith(false);
      });
    });

    it('logs when navigation after a successful create fails', async () => {
      const setIsCreating = vi.fn();

      mockRefetch.mockResolvedValue({
        data: {translations: {common: {'actions.save': 'Save'}}},
        error: null,
      });
      mockNavigate.mockRejectedValueOnce(new Error('navigation failed'));

      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        localeCode: 'fr-FR',
        setIsCreating,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})));

      await vi.waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/translations/fr-FR');
        expect(setIsCreating).toHaveBeenCalledWith(false);
      });
    });

    it('logs when fetching en-US translations rejects outright during create', async () => {
      const setError = vi.fn();

      mockRefetch.mockRejectedValueOnce(new Error('network down'));

      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        localeCode: 'fr-FR',
        setError,
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})));

      await vi.waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
      // handleCreate rejects outright (no internal catch around fetchEnTranslations), so it's
      // caught by handleNext's own .catch() instead of resolving via setError.
      expect(setError).not.toHaveBeenCalledWith('Failed to add language. Please try again.');
    });

    it('does not start creation when localeCode is empty', async () => {
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        localeCode: '',
      });

      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      await user.click(screen.getByText(t('translations:language.create.createButton', {defaultValue: 'Create'})));

      expect(mockRefetch).not.toHaveBeenCalled();
    });
  });

  describe('Breadcrumb navigation', () => {
    it('navigates to a previous step when a breadcrumb is clicked', async () => {
      const setCurrentStep = vi.fn();
      mockUseTranslationCreate.mockReturnValue({
        ...baseContext,
        currentStep: TranslationCreateFlowStep.LOCALE_CODE,
        selectedCountry: {name: 'France', regionCode: 'FR', flag: '🇫🇷'},
        selectedLocale: {code: 'fr-FR', displayName: 'French (France)', flag: '🇫🇷'},
        setCurrentStep,
      });
      const user = userEvent.setup();
      render(<TranslationCreatePage />);

      // Click on the first breadcrumb (COUNTRY)
      await user.click(screen.getByText(t('translations:language.create.steps.country')));

      expect(setCurrentStep).toHaveBeenCalledWith(TranslationCreateFlowStep.COUNTRY);
    });
  });
});
