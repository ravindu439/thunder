// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {TranslationCreateFlowStep} from '@/models/translation-create-flow';

describe('translation-create-flow models', () => {
  describe('TranslationCreateFlowStep', () => {
    it('should have COUNTRY step', () => {
      expect(TranslationCreateFlowStep.COUNTRY).toBe('COUNTRY');
    });

    it('should have LANGUAGE step', () => {
      expect(TranslationCreateFlowStep.LANGUAGE).toBe('LANGUAGE');
    });

    it('should have LOCALE_CODE step', () => {
      expect(TranslationCreateFlowStep.LOCALE_CODE).toBe('LOCALE_CODE');
    });

    it('should have exactly 3 steps', () => {
      expect(Object.keys(TranslationCreateFlowStep)).toHaveLength(3);
    });

    it('should be usable as a record key', () => {
      const labels: Record<TranslationCreateFlowStep, string> = {
        COUNTRY: 'Select Country',
        LANGUAGE: 'Select Language',
        LOCALE_CODE: 'Review Locale Code',
      };

      expect(labels[TranslationCreateFlowStep.COUNTRY]).toBe('Select Country');
      expect(labels[TranslationCreateFlowStep.LANGUAGE]).toBe('Select Language');
      expect(labels[TranslationCreateFlowStep.LOCALE_CODE]).toBe('Review Locale Code');
    });

    it('step values should match their keys', () => {
      Object.entries(TranslationCreateFlowStep).forEach(([key, value]) => {
        expect(value).toBe(key);
      });
    });
  });
});
