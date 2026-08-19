// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import isMetaTemplatePattern, {META_PATTERN, META_KEY_PATTERN} from '../isMetaTemplatePattern';

describe('isMetaTemplatePattern', () => {
  describe('valid meta patterns', () => {
    it('should return true for a simple meta key', () => {
      expect(isMetaTemplatePattern('{{meta(application.name)}}')).toBe(true);
    });

    it('should return true for a key with nested dots', () => {
      expect(isMetaTemplatePattern('{{meta(ou.description)}}')).toBe(true);
    });

    it('should return true for a boolean meta key', () => {
      expect(isMetaTemplatePattern('{{meta(is_registration_flow_enabled)}}')).toBe(true);
    });

    it('should return true when the value has leading and trailing whitespace', () => {
      expect(isMetaTemplatePattern('  {{meta(application.name)}}  ')).toBe(true);
    });
  });

  describe('invalid meta patterns', () => {
    it('should return false for a plain string', () => {
      expect(isMetaTemplatePattern('hello world')).toBe(false);
    });

    it('should return false for an i18n template', () => {
      expect(isMetaTemplatePattern('{{t(signin:heading)}}')).toBe(false);
    });

    it('should return false when the template is embedded in other text', () => {
      expect(isMetaTemplatePattern('Visit {{meta(application.sign_up_url)}} today')).toBe(false);
    });

    it('should return false for missing closing braces', () => {
      expect(isMetaTemplatePattern('{{meta(application.name)')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isMetaTemplatePattern('')).toBe(false);
    });

    it('should return false for empty parentheses', () => {
      expect(isMetaTemplatePattern('{{meta()}}')).toBe(false);
    });
  });
});

describe('META_PATTERN', () => {
  it('should match a full meta template string', () => {
    expect(META_PATTERN.test('{{meta(application.name)}}')).toBe(true);
  });

  it('should not match a partial string', () => {
    expect(META_PATTERN.test('prefix{{meta(application.name)}}')).toBe(false);
  });
});

describe('META_KEY_PATTERN', () => {
  it('should capture the key from a meta template', () => {
    const match = META_KEY_PATTERN.exec('{{meta(application.sign_up_url)}}');

    expect(match).not.toBeNull();
    expect(match?.[1]).toBe('application.sign_up_url');
  });

  it('should return null for a non-matching string', () => {
    expect(META_KEY_PATTERN.exec('hello')).toBeNull();
  });
});
