// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import isRelativeUrl from '../isRelativeUrl';

describe('isRelativeUrl', () => {
  describe('relative URLs', () => {
    it('should return true for a current-directory relative path', () => {
      expect(isRelativeUrl('./foo')).toBe(true);
    });

    it('should return true for a parent-directory relative path', () => {
      expect(isRelativeUrl('../foo')).toBe(true);
    });

    it('should return true for a bare segment', () => {
      expect(isRelativeUrl('foo/bar')).toBe(true);
    });

    it('should return true for a root-relative path', () => {
      expect(isRelativeUrl('/foo/bar')).toBe(true);
    });

    it('should return true for an empty string', () => {
      expect(isRelativeUrl('')).toBe(true);
    });
  });

  describe('absolute URLs', () => {
    it('should return false for an https URL', () => {
      expect(isRelativeUrl('https://example.com/foo')).toBe(false);
    });

    it('should return false for an http URL', () => {
      expect(isRelativeUrl('http://example.com/foo')).toBe(false);
    });

    it('should return false for a protocol-relative URL', () => {
      expect(isRelativeUrl('//example.com/foo')).toBe(false);
    });

    it('should return false for a custom scheme URL', () => {
      expect(isRelativeUrl('ftp://files.example.com/resource')).toBe(false);
    });
  });
});
