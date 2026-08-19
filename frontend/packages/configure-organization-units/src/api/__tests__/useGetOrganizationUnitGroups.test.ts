// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {waitFor, renderHook} from '@thunderid/test-utils';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {GroupListResponse} from '../../models/group';
import useGetOrganizationUnitGroups from '../useGetOrganizationUnitGroups';

// Mock useThunderID
const mockHttpRequest = vi.fn();
vi.mock('@thunderid/react', () => ({
  useThunderID: () => ({
    http: {
      request: mockHttpRequest,
    },
  }),
}));

// Mock useConfig
vi.mock('@thunderid/contexts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@thunderid/contexts')>();
  return {
    ...actual,
    useConfig: () => ({
      getServerUrl: () => 'https://localhost:8090',
    }),
  };
});

describe('useGetOrganizationUnitGroups', () => {
  const mockGroupList: GroupListResponse = {
    totalResults: 2,
    startIndex: 1,
    count: 2,
    groups: [
      {id: 'group-1', name: 'Admin Group', ouId: 'ou-123'},
      {id: 'group-2', name: 'User Group', ouId: 'ou-123'},
    ],
    links: [{rel: 'self', href: 'https://localhost:8090/organization-units/ou-123/groups'}],
  };

  beforeEach(() => {
    mockHttpRequest.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch organization unit groups on mount', async () => {
    mockHttpRequest.mockResolvedValue({data: mockGroupList});

    const {result} = renderHook(() => useGetOrganizationUnitGroups('ou-123'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockGroupList);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('/organization-units/ou-123/groups') as unknown,
        method: 'GET',
      }),
    );
  });

  it('should not fetch when organizationUnitId is undefined', async () => {
    const {result} = renderHook(() => useGetOrganizationUnitGroups(undefined));

    // Wait a bit to ensure query doesn't execute
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockHttpRequest).not.toHaveBeenCalled();
  });

  it('should fetch with default pagination params', async () => {
    mockHttpRequest.mockResolvedValue({data: mockGroupList});

    renderHook(() => useGetOrganizationUnitGroups('ou-123'));

    await waitFor(() => {
      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringMatching(/limit=30.*offset=0|offset=0.*limit=30/) as unknown,
        }),
      );
    });
  });

  it('should fetch with custom limit parameter', async () => {
    mockHttpRequest.mockResolvedValue({data: mockGroupList});

    renderHook(() => useGetOrganizationUnitGroups('ou-123', {limit: 10}));

    await waitFor(() => {
      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('limit=10') as unknown,
        }),
      );
    });
  });

  it('should fetch with custom offset parameter', async () => {
    mockHttpRequest.mockResolvedValue({data: mockGroupList});

    renderHook(() => useGetOrganizationUnitGroups('ou-123', {offset: 20}));

    await waitFor(() => {
      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('offset=20') as unknown,
        }),
      );
    });
  });

  it('should fetch with both limit and offset parameters', async () => {
    mockHttpRequest.mockResolvedValue({data: mockGroupList});

    renderHook(() => useGetOrganizationUnitGroups('ou-123', {limit: 15, offset: 30}));

    await waitFor(() => {
      expect(mockHttpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringMatching(/limit=15.*offset=30|offset=30.*limit=15/) as unknown,
        }),
      );
    });
  });

  it('should set loading state during fetch', () => {
    mockHttpRequest.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolve to keep loading state
        }),
    );

    const {result, unmount} = renderHook(() => useGetOrganizationUnitGroups('ou-123'));

    expect(result.current.isLoading).toBe(true);

    unmount();
  });

  it('should handle API error', async () => {
    mockHttpRequest.mockRejectedValue(new Error('Failed to fetch groups'));

    const {result} = renderHook(() => useGetOrganizationUnitGroups('ou-123'));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should return empty list when no groups exist', async () => {
    const emptyList: GroupListResponse = {
      totalResults: 0,
      startIndex: 1,
      count: 0,
      groups: [],
    };
    mockHttpRequest.mockResolvedValue({data: emptyList});

    const {result} = renderHook(() => useGetOrganizationUnitGroups('ou-123'));

    await waitFor(() => {
      expect(result.current.data?.groups).toHaveLength(0);
      expect(result.current.data?.totalResults).toBe(0);
    });
  });

  it('should refetch when refetch is called', async () => {
    mockHttpRequest.mockResolvedValue({data: mockGroupList});

    const {result} = renderHook(() => useGetOrganizationUnitGroups('ou-123'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockGroupList);
    });

    const updatedList = {...mockGroupList, totalResults: 3};
    mockHttpRequest.mockResolvedValue({data: updatedList});
    const callsBeforeRefetch = mockHttpRequest.mock.calls.length;

    await result.current.refetch();

    await waitFor(() => {
      expect(mockHttpRequest.mock.calls.length).toBeGreaterThan(callsBeforeRefetch);
    });
  });
});
