// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it, vi} from 'vitest';
import getErrorMessage from '../getErrorMessage';

describe('getErrorMessage', () => {
  const makeApiError = (code: string): Error =>
    Object.assign(new Error('request failed'), {
      response: {data: {code}},
    });

  it('should return the specific error message when the code resolves to a translation', () => {
    const t = vi.fn((key: string) =>
      key === 'errors.APP-1020' ? 'An application with this name already exists.' : '',
    );

    expect(getErrorMessage(makeApiError('APP-1020'), t, 'create.error')).toBe(
      'An application with this name already exists.',
    );
  });

  it('should fall back to the fallback key when no specific translation exists', () => {
    const t = vi.fn((key: string) => (key === 'create.error' ? 'Failed to create application.' : ''));

    expect(getErrorMessage(makeApiError('APP-9999'), t, 'create.error')).toBe('Failed to create application.');
  });

  it('should fall back to the fallback key when the error has no response code', () => {
    const t = vi.fn((key: string) => (key === 'create.error' ? 'Failed to create application.' : ''));

    expect(getErrorMessage(new Error('network error'), t, 'create.error')).toBe('Failed to create application.');
  });

  it('should call the fallback key without options when no fallbackDefaultValue is given', () => {
    const t = vi.fn().mockReturnValue('Failed to create application.');

    getErrorMessage(new Error('network error'), t, 'create.error');

    expect(t).toHaveBeenLastCalledWith('create.error');
  });

  it('should pass fallbackDefaultValue as the translation default when the key is missing', () => {
    const t = vi.fn((key: string, options?: {defaultValue: string}) =>
      key === 'errors.APP-9999' ? '' : (options?.defaultValue ?? ''),
    );

    expect(
      getErrorMessage(makeApiError('APP-9999'), t, 'create.error', 'Failed to create application. Please try again.'),
    ).toBe('Failed to create application. Please try again.');
    expect(t).toHaveBeenLastCalledWith('create.error', {
      defaultValue: 'Failed to create application. Please try again.',
    });
  });

  it('should prefer the specific translation over fallbackDefaultValue', () => {
    const t = vi.fn((key: string) =>
      key === 'errors.APP-1020' ? 'An application with this name already exists.' : '',
    );

    expect(
      getErrorMessage(makeApiError('APP-1020'), t, 'create.error', 'Failed to create application. Please try again.'),
    ).toBe('An application with this name already exists.');
  });

  it('should fall back to the shared common catalog when the feature namespace has no entry', () => {
    const t = vi.fn((key: string) =>
      key === 'common:errors.SSE-4030' ? 'You do not have permission to perform this action.' : '',
    );

    expect(getErrorMessage(makeApiError('SSE-4030'), t, 'update.error')).toBe(
      'You do not have permission to perform this action.',
    );
  });

  it('should prefer the feature namespace over the shared common catalog', () => {
    const t = vi.fn((key: string) => {
      if (key === 'errors.SSE-4030') return 'Feature-specific permission message.';
      if (key === 'common:errors.SSE-4030') return 'Generic permission message.';
      return '';
    });

    expect(getErrorMessage(makeApiError('SSE-4030'), t, 'update.error')).toBe('Feature-specific permission message.');
  });

  it('should fall back to the fallback key when neither namespace resolves the code', () => {
    const t = vi.fn((key: string) => (key === 'update.error' ? 'Failed to update. Please try again.' : ''));

    expect(getErrorMessage(makeApiError('XYZ-0000'), t, 'update.error')).toBe('Failed to update. Please try again.');
  });
});
