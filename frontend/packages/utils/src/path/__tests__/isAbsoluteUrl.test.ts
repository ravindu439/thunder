// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import isAbsoluteUrl from '../isAbsoluteUrl';

describe('isAbsoluteUrl', () => {
  describe('absolute URLs', () => {
    it('should return true for an https URL', () => {
      expect(isAbsoluteUrl('https://example.com/foo')).toBe(true);
    });

    it('should return true for an http URL', () => {
      expect(isAbsoluteUrl('http://example.com/foo')).toBe(true);
    });

    it('should return true for a protocol-relative URL', () => {
      expect(isAbsoluteUrl('//example.com/foo')).toBe(true);
    });

    it('should return true for a custom scheme URL', () => {
      expect(isAbsoluteUrl('ftp://files.example.com/resource')).toBe(true);
    });
  });

  describe('relative URLs', () => {
    it('should return false for a current-directory relative path', () => {
      expect(isAbsoluteUrl('./foo')).toBe(false);
    });

    it('should return false for a parent-directory relative path', () => {
      expect(isAbsoluteUrl('../foo')).toBe(false);
    });

    it('should return false for a bare segment', () => {
      expect(isAbsoluteUrl('foo/bar')).toBe(false);
    });

    it('should return false for a root-relative path', () => {
      expect(isAbsoluteUrl('/foo/bar')).toBe(false);
    });

    it('should return false for an empty string', () => {
      expect(isAbsoluteUrl('')).toBe(false);
    });
  });
});
