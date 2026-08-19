// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import AgentCreateContext from './AgentCreateContext';
import type {AgentCreateContextType} from './AgentCreateContext';

export default function useAgentCreate(): AgentCreateContextType {
  const context = useContext(AgentCreateContext);
  if (!context) {
    throw new Error('useAgentCreate must be used within AgentCreateProvider');
  }
  return context;
}
