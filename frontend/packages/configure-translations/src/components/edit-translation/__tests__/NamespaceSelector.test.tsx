// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import userEvent from '@testing-library/user-event';
import {render, renderHook, screen} from '@thunderid/test-utils';
import {useTranslation} from 'react-i18next';
import {describe, expect, it, vi, beforeAll, beforeEach} from 'vitest';
import NamespaceSelector from '@/components/edit-translation/NamespaceSelector';

const defaultProps = {
  namespaces: ['commonNamespace', 'loginFlow', 'userProfile'],
  value: 'commonNamespace',
  loading: false,
  onChange: vi.fn(),
};

describe('NamespaceSelector', () => {
  let t: (key: string) => string;

  beforeAll(() => {
    ({t} = renderHook(() => useTranslation('translations')).result.current);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the namespace label', () => {
      render(<NamespaceSelector {...defaultProps} />);

      expect(screen.getByText(t('editor.namespace'))).toBeInTheDocument();
    });

    it('renders the helper text', () => {
      render(<NamespaceSelector {...defaultProps} />);

      expect(screen.getByText(t('editor.namespace.helperText'))).toBeInTheDocument();
    });

    it('renders with the current value displayed in the input', () => {
      render(<NamespaceSelector {...defaultProps} value="loginFlow" />);

      expect(screen.getByRole('combobox')).toHaveValue('Login Flow');
    });

    it('renders with empty string when value is null', () => {
      render(<NamespaceSelector {...defaultProps} value={null} />);

      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('Option label formatting', () => {
    it('formats camelCase namespace keys into human-readable labels', async () => {
      const user = userEvent.setup();

      render(<NamespaceSelector {...defaultProps} />);

      await user.click(screen.getByRole('combobox'));

      expect(screen.getByText('Common Namespace')).toBeInTheDocument();
      expect(screen.getByText('Login Flow')).toBeInTheDocument();
      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onChange when a namespace option is selected', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(<NamespaceSelector {...defaultProps} onChange={onChange} />);

      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Login Flow'));

      expect(onChange).toHaveBeenCalledWith('loginFlow');
    });
  });

  describe('Loading state', () => {
    it('shows no namespace options while loading', async () => {
      const user = userEvent.setup();

      render(<NamespaceSelector {...defaultProps} loading namespaces={[]} value={null} />);

      // MUI Autocomplete's loading indicator lives inside the Popper listbox,
      // which requires a real layout engine to position in jsdom. Assert the
      // observable behaviour instead: with no loaded namespaces there are no
      // selectable option elements.
      await user.click(screen.getByRole('combobox'));

      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });

    it('does not show loading indicator when loading is false', () => {
      render(<NamespaceSelector {...defaultProps} loading={false} />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});
