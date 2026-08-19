// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {waitFor, renderHook} from '@thunderid/test-utils';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {OrganizationUnit} from '../../models/organization-unit';
import useGetOrganizationUnit from '../useGetOrganizationUnit';

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

describe('useGetOrganizationUnit', () => {
  const mockOrganizationUnit: OrganizationUnit = {
    id: 'ou-123',
    handle: 'test-ou',
    name: 'Test Organization Unit',
    description: 'A test organization unit',
    parent: null,
  };

  beforeEach(() => {
    mockHttpRequest.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch organization unit by id', async () => {
    mockHttpRequest.mockResolvedValue({data: mockOrganizationUnit});

    const {result} = renderHook(() => useGetOrganizationUnit('ou-123'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockOrganizationUnit);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://localhost:8090/organization-units/ou-123',
        method: 'GET',
      }),
    );
  });

  it('should not fetch when id is undefined', async () => {
    const {result} = renderHook(() => useGetOrganizationUnit(undefined));

    // Wait a bit to ensure query doesn't execute
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockHttpRequest).not.toHaveBeenCalled();
  });

  it('should not fetch when enabled is false', async () => {
    const {result} = renderHook(() => useGetOrganizationUnit('ou-123', false));

    // Wait a bit to ensure query doesn't execute
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockHttpRequest).not.toHaveBeenCalled();
  });

  it('should set loading state during fetch', () => {
    mockHttpRequest.mockImplementation(
      () =>
        new Promise(() => {
          // Never resolve to keep loading state
        }),
    );

    const {result, unmount} = renderHook(() => useGetOrganizationUnit('ou-123'));

    expect(result.current.isLoading).toBe(true);

    unmount();
  });

  it('should handle API error', async () => {
    mockHttpRequest.mockRejectedValue(new Error('Organization unit not found'));

    const {result} = renderHook(() => useGetOrganizationUnit('ou-123'));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should fetch organization unit with parent', async () => {
    const ouWithParent: OrganizationUnit = {
      ...mockOrganizationUnit,
      parent: 'parent-ou-id',
    };
    mockHttpRequest.mockResolvedValue({data: ouWithParent});

    const {result} = renderHook(() => useGetOrganizationUnit('ou-123'));

    await waitFor(() => {
      expect(result.current.data).toEqual(ouWithParent);
      expect(result.current.data?.parent).toBe('parent-ou-id');
    });
  });

  it('should fetch organization unit without description', async () => {
    const ouWithoutDescription: OrganizationUnit = {
      id: 'ou-123',
      handle: 'test-ou',
      name: 'Test Organization Unit',
      description: null,
      parent: null,
    };
    mockHttpRequest.mockResolvedValue({data: ouWithoutDescription});

    const {result} = renderHook(() => useGetOrganizationUnit('ou-123'));

    await waitFor(() => {
      expect(result.current.data).toEqual(ouWithoutDescription);
      expect(result.current.data?.description).toBeNull();
    });
  });

  it('should refetch when refetch is called', async () => {
    mockHttpRequest.mockResolvedValue({data: mockOrganizationUnit});

    const {result} = renderHook(() => useGetOrganizationUnit('ou-123'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockOrganizationUnit);
    });

    const updatedOU = {...mockOrganizationUnit, name: 'Updated OU Name'};
    mockHttpRequest.mockResolvedValue({data: updatedOU});
    const callsBeforeRefetch = mockHttpRequest.mock.calls.length;

    await result.current.refetch();

    await waitFor(() => {
      expect(mockHttpRequest.mock.calls.length).toBeGreaterThan(callsBeforeRefetch);
    });
  });
});
