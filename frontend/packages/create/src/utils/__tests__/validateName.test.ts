// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import validateName from '../validateName';

describe('validateName', () => {
  describe('valid names', () => {
    it('should accept single letter names', () => {
      expect(() => validateName('a')).not.toThrow();
      expect(() => validateName('Z')).not.toThrow();
    });

    it('should accept names with letters and numbers', () => {
      expect(() => validateName('myFeature123')).not.toThrow();
      expect(() => validateName('feature2')).not.toThrow();
    });

    it('should accept names with hyphens', () => {
      expect(() => validateName('my-feature')).not.toThrow();
      expect(() => validateName('feature-name-123')).not.toThrow();
    });

    it('should accept names with underscores', () => {
      expect(() => validateName('my_feature')).not.toThrow();
      expect(() => validateName('feature_name_123')).not.toThrow();
    });

    it('should accept names with mixed separators', () => {
      expect(() => validateName('my_feature-name123')).not.toThrow();
      expect(() => validateName('a1_b2-c3')).not.toThrow();
    });

    it('should accept names up to 50 characters', () => {
      const fiftyCharName = 'a'.repeat(50);
      expect(() => validateName(fiftyCharName)).not.toThrow();
    });
  });

  describe('invalid names', () => {
    it('should reject empty strings', () => {
      expect(() => validateName('')).toThrow('Feature name cannot be empty');
    });

    it('should reject whitespace-only strings', () => {
      expect(() => validateName('   ')).toThrow('Feature name cannot be empty');
    });

    it('should reject names starting with numbers', () => {
      expect(() => validateName('123feature')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });

    it('should reject names starting with hyphens', () => {
      expect(() => validateName('-feature')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });

    it('should reject names starting with underscores', () => {
      expect(() => validateName('_feature')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });

    it('should reject names ending with hyphens', () => {
      expect(() => validateName('feature-')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });

    it('should reject names ending with underscores', () => {
      expect(() => validateName('feature_')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });

    it('should reject names with special characters', () => {
      expect(() => validateName('feature@name')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
      expect(() => validateName('feature.name')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
      expect(() => validateName('feature name')).toThrow(
        'Feature name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });

    it('should reject names longer than 50 characters', () => {
      const longName = 'a'.repeat(51);
      expect(() => validateName(longName)).toThrow('Feature name must be 50 characters or less');
    });

    it('should reject reserved words', () => {
      expect(() => validateName('index')).toThrow("Feature name 'index' is reserved");
      expect(() => validateName('src')).toThrow("Feature name 'src' is reserved");
      expect(() => validateName('dist')).toThrow("Feature name 'dist' is reserved");
      expect(() => validateName('build')).toThrow("Feature name 'build' is reserved");
      expect(() => validateName('node_modules')).toThrow("Feature name 'node_modules' is reserved");
      expect(() => validateName('package')).toThrow("Feature name 'package' is reserved");
      expect(() => validateName('test')).toThrow("Feature name 'test' is reserved");
    });

    it('should reject reserved words regardless of case', () => {
      expect(() => validateName('INDEX')).toThrow("Feature name 'INDEX' is reserved");
      expect(() => validateName('Src')).toThrow("Feature name 'Src' is reserved");
    });
  });

  describe('custom type parameter', () => {
    it('should use custom type in error messages', () => {
      expect(() => validateName('', 'Feature')).toThrow('Feature name cannot be empty');
      expect(() => validateName('123', 'Package')).toThrow(
        'Package name must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, and hyphens',
      );
    });
  });

  describe('name trimming', () => {
    it('should trim whitespace and validate', () => {
      expect(() => validateName('  validName  ')).not.toThrow();
      expect(() => validateName('  123invalid  ', 'Feature')).toThrow('Feature name must start with a letter');
    });
  });
});
