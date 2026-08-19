// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {screen, cleanup, fireEvent} from '@testing-library/react';
import {describe, it, expect, afterEach, vi} from 'vitest';
import renderWithProviders from '../../../../test/renderWithProviders';
import ConsentAdapter from '../ConsentAdapter';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const noop = () => undefined;

// Mirrors the permission purpose the backend builds at runtime: it is never persisted, so purposeId
// arrives as an empty string and essential arrives as null.
const permissionsPurpose = JSON.stringify([
  {
    purposeName: 'permissions:app1',
    purposeId: '',
    type: 'permissions',
    essential: null,
    optional: [{name: 'system'}],
  },
]);

const nestedPermissionsPurpose = JSON.stringify([
  {
    purposeName: 'permissions:app1',
    purposeId: '',
    type: 'permissions',
    essential: null,
    optional: [{name: 'users'}, {name: 'users:read', parent: 'users'}, {name: 'users:write', parent: 'users'}],
  },
]);

const permissionKey = (name: string) => `__consent_opt____${name}`;

const switchFor = (name: string) => screen.getByRole<HTMLInputElement>('switch', {name});

describe('ConsentAdapter — permission default state', () => {
  it('renders an untouched permission as unchecked', () => {
    renderWithProviders(<ConsentAdapter consentData={permissionsPurpose} formValues={{}} onInputChange={noop} />);

    expect(switchFor('system').checked).toBe(false);
  });

  it('renders a permission the user enabled as checked', () => {
    renderWithProviders(
      <ConsentAdapter
        consentData={permissionsPurpose}
        formValues={{[permissionKey('system')]: 'true'}}
        onInputChange={noop}
      />,
    );

    expect(switchFor('system').checked).toBe(true);
  });

  it('renders a permission the user disabled as unchecked', () => {
    renderWithProviders(
      <ConsentAdapter
        consentData={permissionsPurpose}
        formValues={{[permissionKey('system')]: 'false'}}
        onInputChange={noop}
      />,
    );

    expect(switchFor('system').checked).toBe(false);
  });

  it('leaves every permission in a nested tree unchecked when nothing is selected', () => {
    renderWithProviders(<ConsentAdapter consentData={nestedPermissionsPurpose} formValues={{}} onInputChange={noop} />);

    expect(switchFor('users').checked).toBe(false);
    expect(switchFor('users:read').checked).toBe(false);
    expect(switchFor('users:write').checked).toBe(false);
  });
});

describe('ConsentAdapter — permission rollup', () => {
  it('cascades a parent toggle to its descendants', () => {
    const onInputChange = vi.fn();

    renderWithProviders(
      <ConsentAdapter consentData={nestedPermissionsPurpose} formValues={{}} onInputChange={onInputChange} />,
    );

    fireEvent.click(switchFor('users'));

    expect(onInputChange).toHaveBeenCalledWith(permissionKey('users'), 'true');
    expect(onInputChange).toHaveBeenCalledWith(permissionKey('users:read'), 'true');
    expect(onInputChange).toHaveBeenCalledWith(permissionKey('users:write'), 'true');
  });

  it('shows the parent as checked once every descendant is checked', () => {
    renderWithProviders(
      <ConsentAdapter
        consentData={nestedPermissionsPurpose}
        formValues={{
          [permissionKey('users:read')]: 'true',
          [permissionKey('users:write')]: 'true',
        }}
        onInputChange={noop}
      />,
    );

    expect(switchFor('users').checked).toBe(true);
  });
});
