// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {InboundAuthTypes, type InboundAuthType, type InboundAuthConfig} from '../inbound-auth';
import type {OAuth2Config} from '../oauth';

describe('inbound-auth', () => {
  describe('InboundAuthTypes', () => {
    it('should have OAUTH2 type defined', () => {
      expect(InboundAuthTypes.OAUTH2).toBe('oauth2');
    });

    it('should be a constant object', () => {
      expect(typeof InboundAuthTypes).toBe('object');
      expect(InboundAuthTypes).toHaveProperty('OAUTH2');
    });

    it('should have correct value for OAUTH2', () => {
      const authType: InboundAuthType = 'oauth2';
      expect(authType).toBe(InboundAuthTypes.OAUTH2);
    });
  });

  describe('InboundAuthConfig interface', () => {
    it('should allow creating a valid OAuth2 inbound auth config', () => {
      const mockOAuth2Config: OAuth2Config = {
        redirectUris: ['https://example.com/callback'],
        grantTypes: ['authorization_code'],
        responseTypes: ['code'],
        scopes: ['openid', 'profile'],
      };

      const inboundAuthConfig: InboundAuthConfig = {
        type: InboundAuthTypes.OAUTH2,
        config: mockOAuth2Config,
      };

      expect(inboundAuthConfig.type).toBe('oauth2');
      expect(inboundAuthConfig.config).toEqual(mockOAuth2Config);
    });

    it('should work with string type for type field', () => {
      const mockConfig: OAuth2Config = {
        redirectUris: ['https://app.com/auth'],
        grantTypes: ['authorization_code', 'refresh_token'],
        responseTypes: ['code'],
        scopes: ['openid'],
      };

      const config: InboundAuthConfig = {
        type: 'oauth2',
        config: mockConfig,
      };

      expect(config.type).toBe(InboundAuthTypes.OAUTH2);
    });

    it('should allow PKCE configuration for SPAs', () => {
      const spaConfig: OAuth2Config = {
        redirectUris: ['http://localhost:3000/callback'],
        grantTypes: ['authorization_code', 'refresh_token'],
        responseTypes: ['code'],
        pkceRequired: true,
        publicClient: true,
        scopes: ['openid', 'profile', 'email'],
      };

      const inboundAuthConfig: InboundAuthConfig = {
        type: InboundAuthTypes.OAUTH2,
        config: spaConfig,
      };

      expect(inboundAuthConfig.config.pkceRequired).toBe(true);
      expect(inboundAuthConfig.config.publicClient).toBe(true);
    });
  });
});
