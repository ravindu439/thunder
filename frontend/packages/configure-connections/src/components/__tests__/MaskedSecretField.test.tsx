// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@thunderid/test-utils';
import {describe, expect, it, vi} from 'vitest';
import MaskedSecretField from '../MaskedSecretField';

describe('MaskedSecretField', () => {
  it('shows the editable hint when replacing or creating a secret', () => {
    render(
      <MaskedSecretField
        id="client-secret"
        label="Client secret"
        value=""
        onChange={vi.fn()}
        hasStoredSecret={false}
        replacing={false}
        onReplacingChange={vi.fn()}
        hint="connections:form.fields.clientSecret.hint"
      />,
    );

    expect(screen.getByText('connections:form.fields.clientSecret.hint')).toBeInTheDocument();
  });

  it('keeps the stored-secret helper when the secret is not being replaced', () => {
    render(
      <MaskedSecretField
        id="client-secret"
        label="Client secret"
        value=""
        onChange={vi.fn()}
        hasStoredSecret
        replacing={false}
        onReplacingChange={vi.fn()}
        hint="connections:form.fields.clientSecret.hint"
      />,
    );

    expect(screen.getByText('Leave unchanged to keep the stored secret.')).toBeInTheDocument();
    expect(screen.queryByText('connections:form.fields.clientSecret.hint')).not.toBeInTheDocument();
  });
});
