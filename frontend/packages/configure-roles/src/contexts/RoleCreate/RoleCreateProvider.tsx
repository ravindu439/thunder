// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {PropsWithChildren} from 'react';
import {useState, useMemo, useCallback} from 'react';
import RoleCreateContext, {type RoleCreateContextType} from './RoleCreateContext';
import type {ResourcePermissions} from '../../models/role';
import {RoleCreateFlowStep} from '../../models/role-create-flow';

const INITIAL_STATE = {
  currentStep: RoleCreateFlowStep.ORGANIZATION_UNIT as RoleCreateFlowStep,
  name: '',
  ouId: '',
  error: null as string | null,
  permissions: [] as ResourcePermissions[],
};

/**
 * React context provider component that provides role creation state
 * to all child components in the wizard flow.
 *
 * @public
 */
export default function RoleCreateProvider({children}: PropsWithChildren) {
  const [currentStep, setCurrentStep] = useState<RoleCreateFlowStep>(INITIAL_STATE.currentStep);
  const [name, setName] = useState<string>(INITIAL_STATE.name);
  const [ouId, setOuId] = useState<string>(INITIAL_STATE.ouId);
  const [error, setError] = useState<string | null>(INITIAL_STATE.error);
  const [permissions, setPermissions] = useState<ResourcePermissions[]>(INITIAL_STATE.permissions);

  // A create failure goes stale the moment any wizard input changes, so any edit clears it.
  // currentStep is deliberately excluded: stepping back and forth is navigation, not a field edit.
  // Adjusted during render (React's documented pattern for state that must stay in sync with
  // another value) rather than in an effect, since a useEffect here would run a fully committed
  // render with the stale error still visible before clearing it a tick later.
  const formFingerprint = JSON.stringify([name, ouId, permissions]);
  const [prevFormFingerprint, setPrevFormFingerprint] = useState(formFingerprint);

  if (formFingerprint !== prevFormFingerprint) {
    setPrevFormFingerprint(formFingerprint);
    setError(null);
  }

  const reset = useCallback((): void => {
    setCurrentStep(INITIAL_STATE.currentStep);
    setName(INITIAL_STATE.name);
    setOuId(INITIAL_STATE.ouId);
    setError(INITIAL_STATE.error);
    setPermissions(INITIAL_STATE.permissions);
  }, []);

  const contextValue: RoleCreateContextType = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      name,
      setName,
      ouId,
      setOuId,
      error,
      setError,
      permissions,
      setPermissions,
      reset,
    }),
    [currentStep, name, ouId, error, permissions, reset],
  );

  return <RoleCreateContext.Provider value={contextValue}>{children}</RoleCreateContext.Provider>;
}
