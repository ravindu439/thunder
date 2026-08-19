// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {waitFor, renderHook} from '@thunderid/test-utils';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {OrganizationUnit} from '../../models/organization-unit';
import type {UpdateOrganizationUnitRequest} from '../../models/requests';
import useUpdateOrganizationUnit from '../useUpdateOrganizationUnit';

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

describe('useUpdateOrganizationUnit', () => {
  const mockUpdatedOU: OrganizationUnit = {
    id: 'ou-123',
    handle: 'updated-ou',
    name: 'Updated Organization Unit',
    description: 'An updated organization unit',
    parent: null,
  };

  const updateRequest: UpdateOrganizationUnitRequest = {
    handle: 'updated-ou',
    name: 'Updated Organization Unit',
    description: 'An updated organization unit',
    parent: null,
  };

  beforeEach(() => {
    mockHttpRequest.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be idle initially', () => {
    const {result} = renderHook(() => useUpdateOrganizationUnit());

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should update organization unit successfully', async () => {
    mockHttpRequest.mockResolvedValue({data: mockUpdatedOU});

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: 'ou-123', data: updateRequest});

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockUpdatedOU);
    });

    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://localhost:8090/organization-units/ou-123',
        method: 'PUT',
        data: updateRequest,
      }),
    );
  });

  it('should set pending state during mutation', async () => {
    let resolvePromise: (value: {data: OrganizationUnit}) => void;
    mockHttpRequest.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: 'ou-123', data: updateRequest});

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });

    // Resolve to clean up
    resolvePromise!({data: mockUpdatedOU});

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('should handle API error', async () => {
    const errorMessage = 'Failed to update organization unit';
    mockHttpRequest.mockRejectedValue(new Error(errorMessage));

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: 'ou-123', data: updateRequest});

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe(errorMessage);
    });
  });

  it('should call onSuccess callback when provided', async () => {
    mockHttpRequest.mockResolvedValue({data: mockUpdatedOU});
    const onSuccess = vi.fn();

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    const variables = {id: 'ou-123', data: updateRequest};
    result.current.mutate(variables, {onSuccess});

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onSuccess.mock.calls[0][0]).toEqual(mockUpdatedOU);
      expect(onSuccess.mock.calls[0][1]).toEqual(variables);
    });
  });

  it('should call onError callback when provided', async () => {
    const error = new Error('Update failed');
    mockHttpRequest.mockRejectedValue(error);
    const onError = vi.fn();

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: 'ou-123', data: updateRequest}, {onError});

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should update organization unit name only', async () => {
    const partialUpdate: UpdateOrganizationUnitRequest = {
      handle: 'original-handle',
      name: 'New Name Only',
      description: 'Same description',
      parent: null,
    };
    const updatedOU: OrganizationUnit = {
      id: 'ou-123',
      ...partialUpdate,
    };
    mockHttpRequest.mockResolvedValue({data: updatedOU});

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: 'ou-123', data: partialUpdate});

    await waitFor(() => {
      expect(result.current.data?.name).toBe('New Name Only');
    });
  });

  it('should update organization unit description to null', async () => {
    const updateWithNullDescription: UpdateOrganizationUnitRequest = {
      handle: 'test-handle',
      name: 'Test Name',
      description: null,
      parent: null,
    };
    const updatedOU: OrganizationUnit = {
      id: 'ou-123',
      ...updateWithNullDescription,
    };
    mockHttpRequest.mockResolvedValue({data: updatedOU});

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: 'ou-123', data: updateWithNullDescription});

    await waitFor(() => {
      expect(result.current.data?.description).toBeNull();
    });
  });

  it('should use mutateAsync for promise-based mutation', async () => {
    mockHttpRequest.mockResolvedValue({data: mockUpdatedOU});

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    const response = await result.current.mutateAsync({id: 'ou-123', data: updateRequest});

    expect(response).toEqual(mockUpdatedOU);
  });

  it('should update organization unit with different id', async () => {
    const differentId = 'ou-456';
    mockHttpRequest.mockResolvedValue({data: {...mockUpdatedOU, id: differentId}});

    const {result} = renderHook(() => useUpdateOrganizationUnit());

    result.current.mutate({id: differentId, data: updateRequest});

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `https://localhost:8090/organization-units/${differentId}`,
      }),
    );
  });
});
