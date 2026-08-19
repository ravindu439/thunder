// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {waitFor} from '@testing-library/react';
import {renderHook} from '@thunderid/test-utils';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {CorsConfigResponse} from '../../models/responses';

const mockHttpRequest = vi.fn();
vi.mock('@thunderid/react', () => ({
  useThunderID: () => ({
    http: {request: mockHttpRequest},
  }),
}));

const mockGetServerUrl = vi.fn<() => string>(() => 'https://localhost:8090');
vi.mock('@thunderid/contexts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/contexts')>();
  return {
    ...actual,
    useConfig: () => ({getServerUrl: mockGetServerUrl}),
  };
});

const {default: useGetCorsConfig} = await import('../useGetCorsConfig');

describe('useGetCorsConfig', () => {
  const mockResponse: CorsConfigResponse = {
    readOnly: {allowedOrigins: ['https://localhost:5190']},
    writable: {allowedOrigins: ['https://app.acme.com']},
    merged: {allowedOrigins: ['https://localhost:5190', 'https://app.acme.com']},
  };

  beforeEach(() => {
    mockHttpRequest.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches the CORS config from /server-config/cors', async () => {
    mockHttpRequest.mockResolvedValue({data: mockResponse});
    const {result} = renderHook(() => useGetCorsConfig());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://localhost:8090/server-config/cors',
        method: 'GET',
      }),
    );
  });

  it('surfaces fetch errors', async () => {
    mockHttpRequest.mockRejectedValue(new Error('boom'));
    const {result} = renderHook(() => useGetCorsConfig());

    await waitFor(() => {
      expect(result.current.error?.message).toBe('boom');
    });
  });
});
