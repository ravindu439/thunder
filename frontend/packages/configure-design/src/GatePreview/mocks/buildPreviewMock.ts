// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AuthenticatorTypes, IdentityProviderTypes, type IdentityProvider} from '@thunderid/configure-connections';
import type {EmbeddedFlowComponent} from '@thunderid/react';

interface PreviewMeta {
  application?: {
    logoUrl?: string;
  };
}

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const ICON_BASE = `${window.location.origin}${base}assets/images/icons`;

const IDP_ICONS: Record<string, string> = {
  GOOGLE: `${ICON_BASE}/google.svg`,
  GITHUB: `${ICON_BASE}/github.svg`,
};

/** Template literal keys for social provider button labels. */
const IDP_LABEL_KEYS: Record<string, string> = {
  GOOGLE: '{{t(elements:buttons.google.text)}}',
  GITHUB: '{{t(elements:buttons.github.text)}}',
};

/**
 * Builds a preview mock component list based on the enabled integrations and available identity providers.
 *
 * The mock is used to render a realistic sign-in preview via {@link GatePreview} without making real API calls.
 * The generated components reflect which authenticators (basic auth, passkey, social) are currently enabled.
 */
const DEFAULT_INTEGRATIONS: Record<string, boolean> = {
  [AuthenticatorTypes.CREDENTIALS_AUTH]: true,
  [AuthenticatorTypes.PASSKEY]: true,
  google: true,
  github: true,
};

const DEFAULT_IDENTITY_PROVIDERS: IdentityProvider[] = [
  {id: 'google', name: 'Google', type: IdentityProviderTypes.GOOGLE},
  {id: 'github', name: 'GitHub', type: IdentityProviderTypes.GITHUB},
];

export default function buildPreviewMock(
  integrations: Record<string, boolean> = DEFAULT_INTEGRATIONS,
  identityProviders: IdentityProvider[] = DEFAULT_IDENTITY_PROVIDERS,
  meta: PreviewMeta = {},
): EmbeddedFlowComponent[] {
  const hasCredentialsAuth: boolean = integrations[AuthenticatorTypes.CREDENTIALS_AUTH] ?? false;
  const hasPasskey: boolean = integrations[AuthenticatorTypes.PASSKEY] ?? false;
  const selectedProviders: IdentityProvider[] = identityProviders.filter(
    (idp: IdentityProvider): boolean => integrations[idp.id] ?? false,
  );
  const hasSocial: boolean = selectedProviders.length > 0;

  const components: Record<string, unknown>[] = [];

  // App Logo — wrapped in a STACK so it centers via the SDK's container-driven
  // alignment (StackAdapter defaults alignItems: 'center'), like the real gate.
  components.push({
    category: 'DISPLAY',
    components: [
      {
        alt: '',
        category: 'DISPLAY',
        id: 'app_logo',
        resourceType: 'ELEMENT',
        src: meta?.application?.logoUrl ?? '',
        type: 'IMAGE',
        width: '60',
        height: '60',
      },
    ],
    id: 'app_logo_stack',
    resourceType: 'ELEMENT',
    type: 'STACK',
  });

  // Heading
  components.push({
    align: 'center',
    category: 'DISPLAY',
    id: 'text_heading',
    label: '{{t(signin:heading)}}',
    resourceType: 'ELEMENT',
    type: 'TEXT',
    variant: 'HEADING_1',
  });

  // Basic auth block
  if (hasCredentialsAuth) {
    components.push({
      category: 'BLOCK',
      components: [
        {
          category: 'FIELD',
          hint: '',
          id: 'text_input_username',
          inputType: 'text',
          label: '{{t(elements:fields.username.label)}}',
          placeholder: '{{t(elements:fields.username.placeholder)}}',
          ref: 'username',
          required: true,
          resourceType: 'ELEMENT',
          type: 'TEXT_INPUT',
        },
        {
          category: 'FIELD',
          hint: '',
          id: 'password_input',
          inputType: 'password',
          label: '{{t(elements:fields.password.label)}}',
          placeholder: '{{t(elements:fields.password.placeholder)}}',
          ref: 'password',
          required: true,
          resourceType: 'ELEMENT',
          type: 'PASSWORD_INPUT',
        },
        {
          actionRef: 'ID_basic',
          category: 'ACTION',
          eventType: 'SUBMIT',
          id: 'action_submit',
          label: '{{t(elements:buttons.submit.text)}}',
          resourceType: 'ELEMENT',
          type: 'ACTION',
          variant: 'PRIMARY',
        },
      ],
      id: 'block_credentials_auth',
      resourceType: 'ELEMENT',
      type: 'BLOCK',
    });
  }

  // Divider — shown when basic/passkey coexist with social or each other
  const showDivider: boolean = (hasCredentialsAuth || hasPasskey) && (hasSocial || (hasCredentialsAuth && hasPasskey));
  if (showDivider) {
    components.push({
      category: 'DISPLAY',
      id: 'divider_or',
      label: '{{t(elements:display.divider.or_separator)}}',
      resourceType: 'ELEMENT',
      type: 'DIVIDER',
      variant: 'HORIZONTAL',
    });
  }

  // Social provider buttons
  selectedProviders.forEach((provider: IdentityProvider) => {
    components.push({
      category: 'ACTION',
      components: [
        {
          actionRef: `ID_${provider.id}`,
          category: 'ACTION',
          eventType: 'TRIGGER',
          id: `action_${provider.id}`,
          image: IDP_ICONS[provider.type] ?? '',
          label: IDP_LABEL_KEYS[provider.type] ?? `Continue with ${provider.name}`,
          resourceType: 'ELEMENT',
          type: 'ACTION',
          variant: 'SOCIAL',
        },
      ],
      eventType: 'TRIGGER',
      id: `block_${provider.id}`,
      resourceType: 'ELEMENT',
      type: 'BLOCK',
    });
  });

  // Passkey button
  if (hasPasskey) {
    components.push({
      category: 'ACTION',
      eventType: 'TRIGGER',
      id: 'action_passkey',
      label: '{{t(signin:passkey.button.use)}}',
      resourceType: 'ELEMENT',
      startIcon: `${ICON_BASE}/fingerprint.svg`,
      type: 'ACTION',
      variant: 'SOCIAL',
    });
  }

  return components as unknown as EmbeddedFlowComponent[];
}
