// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import isI18nTemplatePattern, {I18N_PATTERN, I18N_KEY_PATTERN} from '../isI18nTemplatePattern';

describe('isI18nTemplatePattern', () => {
  describe('valid i18n patterns', () => {
    it('should return true for a simple i18n key', () => {
      expect(isI18nTemplatePattern('{{t(signin:heading)}}')).toBe(true);
    });

    it('should return true for a key without a namespace', () => {
      expect(isI18nTemplatePattern('{{t(heading)}}')).toBe(true);
    });

    it('should return true for a key with nested dots', () => {
      expect(isI18nTemplatePattern('{{t(common:button.submit)}}')).toBe(true);
    });

    it('should return true when the value has leading and trailing whitespace', () => {
      expect(isI18nTemplatePattern('  {{t(signin:heading)}}  ')).toBe(true);
    });
  });

  describe('invalid i18n patterns', () => {
    it('should return false for a plain string', () => {
      expect(isI18nTemplatePattern('hello world')).toBe(false);
    });

    it('should return false for a meta template', () => {
      expect(isI18nTemplatePattern('{{meta(application.name)}}')).toBe(false);
    });

    it('should return false when the template is embedded in other text', () => {
      expect(isI18nTemplatePattern('Click {{t(signin:heading)}} here')).toBe(false);
    });

    it('should return false for missing closing braces', () => {
      expect(isI18nTemplatePattern('{{t(signin:heading)')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isI18nTemplatePattern('')).toBe(false);
    });

    it('should return false for empty parentheses', () => {
      expect(isI18nTemplatePattern('{{t()}}')).toBe(false);
    });
  });
});

describe('I18N_PATTERN', () => {
  it('should match a full i18n template string', () => {
    expect(I18N_PATTERN.test('{{t(signin:heading)}}')).toBe(true);
  });

  it('should not match a partial string', () => {
    expect(I18N_PATTERN.test('prefix{{t(signin:heading)}}')).toBe(false);
  });
});

describe('I18N_KEY_PATTERN', () => {
  it('should capture the key from an i18n template', () => {
    const match = I18N_KEY_PATTERN.exec('{{t(signin:heading)}}');

    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('signin:heading');
  });

  it('should return null for a non-matching string', () => {
    expect(I18N_KEY_PATTERN.exec('hello')).toBeNull();
  });
});
