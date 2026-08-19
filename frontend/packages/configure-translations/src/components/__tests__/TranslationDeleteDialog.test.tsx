// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, renderHook, screen} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, expect, it, vi, beforeAll, beforeEach} from 'vitest';
import TranslationDeleteDialog from '@/components/TranslationDeleteDialog';

const mockMutate = vi.fn();
vi.mock('@thunderid/i18n', () => ({
  useDeleteTranslations: () => ({mutate: mockMutate, isPending: false}),
  getDisplayNameForCode: (code: string) => `DisplayName(${code})`,
}));

const defaultProps = {
  open: true,
  language: 'fr-FR',
  onClose: vi.fn(),
  onSuccess: vi.fn(),
};

describe('TranslationDeleteDialog', () => {
  let t: (key: string, options?: Record<string, unknown>) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation()).result.current);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the dialog title', () => {
      render(<TranslationDeleteDialog {...defaultProps} />);

      expect(screen.getByText(t('translations:delete.title'))).toBeInTheDocument();
    });

    it('renders the confirmation message', () => {
      render(<TranslationDeleteDialog {...defaultProps} />);

      expect(screen.getByText(t('translations:delete.message', {language: 'DisplayName(fr-FR)'}))).toBeInTheDocument();
    });

    it('renders the warning disclaimer', () => {
      render(<TranslationDeleteDialog {...defaultProps} />);

      expect(screen.getByText(t('translations:delete.disclaimer'))).toBeInTheDocument();
    });

    it('renders cancel and delete buttons', () => {
      render(<TranslationDeleteDialog {...defaultProps} />);

      expect(screen.getByText(t('common:actions.cancel'))).toBeInTheDocument();
      expect(screen.getByText(t('common:actions.delete'))).toBeInTheDocument();
    });
  });

  describe('Cancel', () => {
    it('calls onClose when cancel is clicked', async () => {
      const onClose = vi.fn();
      const user = userEvent.setup();
      render(<TranslationDeleteDialog {...defaultProps} onClose={onClose} />);

      await user.click(screen.getByText(t('common:actions.cancel')));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    it('calls deleteTranslations.mutate with the language when delete is clicked', async () => {
      const user = userEvent.setup();
      render(<TranslationDeleteDialog {...defaultProps} />);

      await user.click(screen.getByText(t('common:actions.delete')));

      expect(mockMutate).toHaveBeenCalledWith(
        'fr-FR',
        expect.objectContaining({
          onSuccess: expect.any(Function) as unknown as () => void,
          onError: expect.any(Function) as unknown as () => void,
        }),
      );
    });

    it('does not call mutate when language is null', async () => {
      const user = userEvent.setup();
      render(<TranslationDeleteDialog {...defaultProps} language={null} />);

      await user.click(screen.getByText(t('common:actions.delete')));

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('calls onClose and onSuccess on successful deletion', async () => {
      const onClose = vi.fn();
      const onSuccess = vi.fn();
      mockMutate.mockImplementation((_lang: string, opts: {onSuccess: () => void}) => {
        opts.onSuccess();
      });
      const user = userEvent.setup();
      render(<TranslationDeleteDialog {...defaultProps} onClose={onClose} onSuccess={onSuccess} />);

      await user.click(screen.getByText(t('common:actions.delete')));

      expect(onClose).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });

    it('shows a resolved error alert on deletion failure, not raw server text', async () => {
      mockMutate.mockImplementation((_lang: string, opts: {onError: (err: Error) => void}) => {
        opts.onError(new Error('raw server text'));
      });
      const user = userEvent.setup();
      render(<TranslationDeleteDialog {...defaultProps} />);

      await user.click(screen.getByText(t('common:actions.delete')));

      expect(screen.getByText('Failed to delete translations. Please try again.')).toBeInTheDocument();
      expect(screen.queryByText('raw server text')).not.toBeInTheDocument();
    });
  });
});
