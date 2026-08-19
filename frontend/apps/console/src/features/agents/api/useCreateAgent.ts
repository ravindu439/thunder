// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useMutation, useQueryClient, type UseMutationResult} from '@tanstack/react-query';
import {useConfig, useToast} from '@thunderid/contexts';
import {useThunderID} from '@thunderid/react';
import {useTranslation} from 'react-i18next';
import AgentQueryKeys from '../constants/agent-query-keys';
import type {Agent, CreateAgentRequest} from '../models/agent';

export default function useCreateAgent(): UseMutationResult<Agent, Error, CreateAgentRequest> {
  const {http} = useThunderID();
  const {getServerUrl} = useConfig();
  const queryClient = useQueryClient();
  const {t} = useTranslation('agents');
  const {showToast} = useToast();

  return useMutation<Agent, Error, CreateAgentRequest>({
    mutationFn: async (agentData: CreateAgentRequest): Promise<Agent> => {
      const serverUrl = getServerUrl();
      const response: {data: Agent} = await http.request({
        url: `${serverUrl}/agents`,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        data: agentData,
      } as unknown as Parameters<typeof http.request>[0]);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [AgentQueryKeys.AGENTS]}).catch(() => undefined);
      showToast(t('create.success', 'Agent created successfully'), 'success');
    },
  });
}
