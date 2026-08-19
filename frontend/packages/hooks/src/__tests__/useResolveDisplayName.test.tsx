// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {renderHook} from '@thunderid/test-utils';
import {describe, it, expect, vi} from 'vitest';
import useResolveDisplayName from '../useResolveDisplayName';

describe('useResolveDisplayName', () => {
  describe('plain text display names', () => {
    it('should return plain text as-is', () => {
      const t = vi.fn();
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('First Name')).toBe('First Name');
      expect(t).not.toHaveBeenCalled();
    });

    it('should return empty string for empty input', () => {
      const t = vi.fn();
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('')).toBe('');
    });

    it('should return empty string for whitespace-only input', () => {
      const t = vi.fn();
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('   ')).toBe('');
    });
  });

  describe('i18n template patterns', () => {
    it('should resolve a translated i18n pattern', () => {
      const t = vi.fn((key: string) => {
        if (key === 'custom:firstName') return 'First Name';
        return key;
      });
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('{{t(custom:firstName)}}')).toBe('First Name');
    });

    it('should return empty string when translation key is missing (t returns raw key)', () => {
      const t = vi.fn((key: string) => key);
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('{{t(custom:missingKey)}}')).toBe('');
    });

    it('should return empty string when t returns namespace-stripped key (fallback behavior)', () => {
      // i18next strips namespace on fallback: "custom:myKey" -> "myKey"
      const t = vi.fn(() => 'myKey');
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('{{t(custom:myKey)}}')).toBe('');
    });

    it('should return empty string when t returns undefined', () => {
      const t = vi.fn(() => undefined as unknown as string);
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('{{t(custom:someKey)}}')).toBe('');
    });

    it('should handle keys without namespace', () => {
      const t = vi.fn((key: string) => {
        if (key === 'greeting') return 'Hello';
        return key;
      });
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('{{t(greeting)}}')).toBe('Hello');
    });

    it('should return empty string for non-namespaced key when t returns the key unchanged', () => {
      const t = vi.fn((key: string) => key);
      const {result} = renderHook(() => useResolveDisplayName({handlers: {t}}));

      expect(result.current.resolveDisplayName('{{t(missingKey)}}')).toBe('');
    });
  });
});
