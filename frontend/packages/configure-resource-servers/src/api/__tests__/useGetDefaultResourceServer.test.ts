// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {waitFor} from '@testing-library/react';
import {renderHook} from '@thunderid/test-utils';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {DefaultResourceServerConfigResponse} from '../../models/resource-server';

const mockHttpRequest = vi.fn();
vi.mock('@thunderid/react', () => ({
  useThunderID: () => ({http: {request: mockHttpRequest}}),
}));

const mockGetServerUrl = vi.fn<() => string>(() => 'https://localhost:8090');
vi.mock('@thunderid/contexts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/contexts')>();
  return {
    ...actual,
    useConfig: () => ({getServerUrl: mockGetServerUrl}),
  };
});

const {default: useGetDefaultResourceServer} = await import('../useGetDefaultResourceServer');

describe('useGetDefaultResourceServer', () => {
  const mockResponse: DefaultResourceServerConfigResponse = {
    readOnly: {},
    writable: {resourceServerId: 'rs-1'},
    merged: {resourceServerId: 'rs-1'},
  };

  beforeEach(() => {
    mockHttpRequest.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('GETs the default resource server section', async () => {
    mockHttpRequest.mockResolvedValue({data: mockResponse});
    const {result} = renderHook(() => useGetDefaultResourceServer());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://localhost:8090/server-config/defaultResourceServer',
        method: 'GET',
      }),
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it('surfaces fetch errors', async () => {
    mockHttpRequest.mockRejectedValue(new Error('boom'));
    const {result} = renderHook(() => useGetDefaultResourceServer());

    await waitFor(() => {
      expect(result.current.error?.message).toBe('boom');
    });
  });
});
