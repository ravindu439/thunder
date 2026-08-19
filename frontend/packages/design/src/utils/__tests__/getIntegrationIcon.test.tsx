// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import getIntegrationIcon from '../getIntegrationIcon';

describe('getIntegrationIcon', () => {
  it('returns an icon for Google label', () => {
    expect(getIntegrationIcon('Continue with google', '')).not.toBeNull();
  });

  it('returns an icon for GitHub label', () => {
    expect(getIntegrationIcon('Sign in with github', '')).not.toBeNull();
  });

  it('returns an icon when image path contains google', () => {
    expect(getIntegrationIcon('Login', 'assets/google.svg')).not.toBeNull();
  });

  it('returns null for unknown provider', () => {
    expect(getIntegrationIcon('Unknown', 'unknown.png')).toBeNull();
  });
});
