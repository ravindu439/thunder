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

const {default: useSetDefaultResourceServer} = await import('../useSetDefaultResourceServer');

describe('useSetDefaultResourceServer', () => {
  const mockResponse: DefaultResourceServerConfigResponse = {
    readOnly: {},
    writable: {resourceServerId: 'rs-2'},
    merged: {resourceServerId: 'rs-2'},
  };

  beforeEach(() => {
    mockHttpRequest.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('PUTs the resource server id to /server-config/defaultResourceServer', async () => {
    mockHttpRequest.mockResolvedValue({data: mockResponse});
    const {result} = renderHook(() => useSetDefaultResourceServer());

    result.current.mutate({resourceServerId: 'rs-2'});

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://localhost:8090/server-config/defaultResourceServer',
        method: 'PUT',
        data: {resourceServerId: 'rs-2'},
      }),
    );
  });

  it('writes the returned config into the query cache on success', async () => {
    mockHttpRequest.mockResolvedValue({data: mockResponse});
    const {result, queryClient} = renderHook(() => useSetDefaultResourceServer());

    result.current.mutate({resourceServerId: 'rs-2'});

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(queryClient.getQueryData(['server-config', 'defaultResourceServer'])).toEqual(mockResponse);
  });

  it('surfaces update errors', async () => {
    mockHttpRequest.mockRejectedValue(new Error('nope'));
    const {result} = renderHook(() => useSetDefaultResourceServer());

    result.current.mutate({resourceServerId: 'rs-2'});

    await waitFor(() => {
      expect(result.current.error?.message).toBe('nope');
    });
  });
});
