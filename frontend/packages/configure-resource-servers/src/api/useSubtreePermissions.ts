// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useQueryClient} from '@tanstack/react-query';
import {useConfig} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {fetchResourceActions} from './useGetResourceActions';
import {fetchResources} from './useGetResources';
import {fetchServerActions} from './useGetServerActions';
import ResourceServerQueryKeys from '../constants/resource-server-query-keys';
import type {ActionListResponse, Resource, ResourceListResponse} from '../models/resource-server';

interface HttpClient {
  request: (config: unknown) => Promise<{data: unknown}>;
}

export default function useSubtreePermissions(resourceServerId: string): {
  collectSubtreePermissions: (resource: Resource) => Promise<string[]>;
  getCachedSubtreePermissions: (resource: Resource) => string[] | null;
  collectServerPermissions: () => Promise<string[]>;
  getCachedServerPermissions: () => string[] | null;
} {
  const queryClient = useQueryClient();
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();

  async function collectSubtreePermissions(resource: Resource): Promise<string[]> {
    const serverUrl = getServerUrl();
    const typedHttp = http as HttpClient;
    const permissions: string[] = [resource.permission];

    const actionsData = await queryClient.fetchQuery<ActionListResponse>({
      queryKey: [ResourceServerQueryKeys.RESOURCE_ACTIONS, resourceServerId, resource.id],
      queryFn: () =>
        fetchResourceActions(
          typedHttp as {request: (config: unknown) => Promise<{data: ActionListResponse}>},
          serverUrl,
          resourceServerId,
          resource.id,
        ),
    });
    for (const action of actionsData.actions) {
      permissions.push(action.permission);
    }

    const childData = await queryClient.fetchQuery<ResourceListResponse>({
      queryKey: [ResourceServerQueryKeys.RESOURCES, resourceServerId, {parentId: resource.id}],
      queryFn: () =>
        fetchResources(
          typedHttp as {request: (config: unknown) => Promise<{data: ResourceListResponse}>},
          serverUrl,
          resourceServerId,
          resource.id,
        ),
    });
    for (const child of childData.resources) {
      const childPerms = await collectSubtreePermissions(child);
      permissions.push(...childPerms);
    }

    return permissions;
  }

  function getCachedSubtreePermissions(resource: Resource): string[] | null {
    const permissions: string[] = [resource.permission];

    const actionsData = queryClient.getQueryData<ActionListResponse>([
      ResourceServerQueryKeys.RESOURCE_ACTIONS,
      resourceServerId,
      resource.id,
    ]);
    if (actionsData === undefined) return null;
    for (const action of actionsData.actions) {
      permissions.push(action.permission);
    }

    const childData = queryClient.getQueryData<ResourceListResponse>([
      ResourceServerQueryKeys.RESOURCES,
      resourceServerId,
      {parentId: resource.id},
    ]);
    if (childData === undefined) return null;
    for (const child of childData.resources) {
      const childPerms = getCachedSubtreePermissions(child);
      if (childPerms === null) return null;
      permissions.push(...childPerms);
    }

    return permissions;
  }

  async function collectServerPermissions(): Promise<string[]> {
    const serverUrl = getServerUrl();
    const typedHttp = http as HttpClient;
    const permissions: string[] = [];

    const actionsData = await queryClient.fetchQuery<ActionListResponse>({
      queryKey: [ResourceServerQueryKeys.SERVER_ACTIONS, resourceServerId],
      queryFn: () =>
        fetchServerActions(
          typedHttp as {request: (config: unknown) => Promise<{data: ActionListResponse}>},
          serverUrl,
          resourceServerId,
        ),
    });
    for (const action of actionsData.actions) {
      permissions.push(action.permission);
    }

    const rootData = await queryClient.fetchQuery<ResourceListResponse>({
      queryKey: [ResourceServerQueryKeys.RESOURCES, resourceServerId, {parentId: null}],
      queryFn: () =>
        fetchResources(
          typedHttp as {request: (config: unknown) => Promise<{data: ResourceListResponse}>},
          serverUrl,
          resourceServerId,
        ),
    });
    for (const resource of rootData.resources) {
      const subtree = await collectSubtreePermissions(resource);
      permissions.push(...subtree);
    }

    return permissions;
  }

  function getCachedServerPermissions(): string[] | null {
    const permissions: string[] = [];

    const actionsData = queryClient.getQueryData<ActionListResponse>([
      ResourceServerQueryKeys.SERVER_ACTIONS,
      resourceServerId,
    ]);
    if (actionsData === undefined) return null;
    for (const action of actionsData.actions) {
      permissions.push(action.permission);
    }

    const rootData = queryClient.getQueryData<ResourceListResponse>([
      ResourceServerQueryKeys.RESOURCES,
      resourceServerId,
      {parentId: null},
    ]);
    if (rootData === undefined) return null;
    for (const resource of rootData.resources) {
      const subtree = getCachedSubtreePermissions(resource);
      if (subtree === null) return null;
      permissions.push(...subtree);
    }

    return permissions;
  }

  return {collectSubtreePermissions, getCachedSubtreePermissions, collectServerPermissions, getCachedServerPermissions};
}
