// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import {AgentCreateFlowStep} from '../agent-create-flow';

describe('AgentCreateFlowStep', () => {
  it('should have ORGANIZATION_UNIT step', () => {
    expect(AgentCreateFlowStep.ORGANIZATION_UNIT).toBe('ORGANIZATION_UNIT');
  });

  it('should have NAME step', () => {
    expect(AgentCreateFlowStep.NAME).toBe('NAME');
  });

  it('should have PROFILE step', () => {
    expect(AgentCreateFlowStep.PROFILE).toBe('PROFILE');
  });

  it('should have OWNER step', () => {
    expect(AgentCreateFlowStep.OWNER).toBe('OWNER');
  });

  it('should have exactly 4 steps', () => {
    expect(Object.keys(AgentCreateFlowStep)).toHaveLength(4);
  });
});
