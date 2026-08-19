// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import getApplicationErrorMessage from '../getApplicationErrorMessage';

const LABELS: Record<string, string> = {
  'edit.flows.labels.authFlow': 'Sign-in Flow',
  'edit.flows.labels.registrationFlow': 'Sign-up Flow',
  'edit.flows.labels.recoveryFlow': 'Recovery Flow',
  'edit.flows.labels.signOutFlow': 'Sign Out Flow',
  'errors.APP-1039':
    "The {{sourceFlowType}} references a different {{flowType}} than the one configured for this application. Update the {{sourceFlowType}} so it calls the same {{flowType}}, or change the application's {{flowType}} configuration.",
  'update.error': 'Failed to update the application.',
};

function makeT(labels: Record<string, string>) {
  return (key: string, options?: Record<string, unknown>): string => {
    const template = labels[key] ?? (typeof options?.defaultValue === 'string' ? options.defaultValue : '');

    if (!options) {
      return template;
    }

    return Object.entries(options).reduce(
      (message, [name, value]) =>
        name === 'defaultValue' ? message : message.replaceAll(`{{${name}}}`, String(value)),
      template,
    );
  };
}

const t = makeT(LABELS);

function apiErrorFor(code: string, params?: {sourceFlowType?: string; flowType?: string}): Error {
  return {
    response: {
      data: {
        code,
        description: params ? {params} : undefined,
      },
    },
  } as unknown as Error;
}

describe('getApplicationErrorMessage', () => {
  it('builds an actionable message from APP-1039 params, using the Flows tab labels', () => {
    const error = apiErrorFor('APP-1039', {sourceFlowType: 'registration', flowType: 'authentication'});

    expect(getApplicationErrorMessage(error, t, 'update.error')).toBe(
      "The Sign-up Flow references a different Sign-in Flow than the one configured for this application. Update the Sign-up Flow so it calls the same Sign-in Flow, or change the application's Sign-in Flow configuration.",
    );
  });

  it('resolves every known flow-type value to its Flows tab label', () => {
    const error = apiErrorFor('APP-1039', {sourceFlowType: 'recovery', flowType: 'signout'});

    expect(getApplicationErrorMessage(error, t, 'update.error')).toBe(
      "The Recovery Flow references a different Sign Out Flow than the one configured for this application. Update the Recovery Flow so it calls the same Sign Out Flow, or change the application's Sign Out Flow configuration.",
    );
  });

  it('falls back to the generic message when APP-1039 has no params', () => {
    const error = apiErrorFor('APP-1039');

    expect(getApplicationErrorMessage(error, t, 'update.error')).toBe('Failed to update the application.');
  });

  it('falls back to the generic message when a flow-type value is unrecognized', () => {
    const error = apiErrorFor('APP-1039', {sourceFlowType: 'user_onboarding', flowType: 'authentication'});

    expect(getApplicationErrorMessage(error, t, 'update.error')).toBe('Failed to update the application.');
  });

  it('falls back to the generic message for unrelated error codes', () => {
    const error = apiErrorFor('APP-1020');

    expect(getApplicationErrorMessage(error, t, 'update.error')).toBe('Failed to update the application.');
  });

  it('falls back to the generic message when there is no response data', () => {
    const error = new Error('Network Error');

    expect(getApplicationErrorMessage(error, t, 'update.error')).toBe('Failed to update the application.');
  });

  it('uses fallbackDefaultValue for the generic message when the fallback key is missing', () => {
    const withoutFallback = Object.fromEntries(Object.entries(LABELS).filter(([key]) => key !== 'update.error'));
    const error = apiErrorFor('APP-1020');

    expect(
      getApplicationErrorMessage(error, makeT(withoutFallback), 'update.error', 'Failed to update application.'),
    ).toBe('Failed to update application.');
  });

  it('uses fallbackDefaultValue when APP-1039 has no params and the fallback key is missing', () => {
    const withoutFallback = Object.fromEntries(Object.entries(LABELS).filter(([key]) => key !== 'update.error'));
    const error = apiErrorFor('APP-1039');

    expect(
      getApplicationErrorMessage(error, makeT(withoutFallback), 'update.error', 'Failed to update application.'),
    ).toBe('Failed to update application.');
  });

  it('resolves flow labels from their own defaultValue when the label keys are missing', () => {
    const withoutLabels = Object.fromEntries(
      Object.entries(LABELS).filter(([key]) => !key.startsWith('edit.flows.labels')),
    );
    const error = apiErrorFor('APP-1039', {sourceFlowType: 'registration', flowType: 'authentication'});

    expect(getApplicationErrorMessage(error, makeT(withoutLabels), 'update.error')).toBe(
      "The Sign-up Flow references a different Sign-in Flow than the one configured for this application. Update the Sign-up Flow so it calls the same Sign-in Flow, or change the application's Sign-in Flow configuration.",
    );
  });
});
