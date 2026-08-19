// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import AgentTypeQueryKeys from '../agentTypeQueryKeys';

describe('AgentTypeQueryKeys', () => {
  it('should export valid query keys object', () => {
    expect(AgentTypeQueryKeys).toBeDefined();
    expect(typeof AgentTypeQueryKeys).toBe('object');
  });

  it('should have AGENT_TYPES key', () => {
    expect(AgentTypeQueryKeys).toHaveProperty('AGENT_TYPES');
    expect(AgentTypeQueryKeys.AGENT_TYPES).toBe('agent-types');
  });

  it('should have AGENT_TYPE key', () => {
    expect(AgentTypeQueryKeys).toHaveProperty('AGENT_TYPE');
    expect(AgentTypeQueryKeys.AGENT_TYPE).toBe('agent-type');
  });
});
