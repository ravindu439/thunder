// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {PropsWithChildren} from 'react';
import {useState, useMemo, useCallback} from 'react';
import GroupCreateContext, {type GroupCreateContextType} from './GroupCreateContext';
import {GroupCreateFlowStep} from '../../models/group-create-flow';

/**
 * Initial state values for group creation.
 *
 * @internal
 */
const INITIAL_STATE = {
  currentStep: GroupCreateFlowStep.ORGANIZATION_UNIT as GroupCreateFlowStep,
  name: '',
  description: '',
  ouId: '',
  error: null as string | null,
};

/**
 * React context provider component that provides group creation state
 * to all child components in the wizard flow.
 *
 * @public
 */
export default function GroupCreateProvider({children}: PropsWithChildren) {
  const [currentStep, setCurrentStep] = useState<GroupCreateFlowStep>(INITIAL_STATE.currentStep);
  const [name, setName] = useState<string>(INITIAL_STATE.name);
  const [description, setDescription] = useState<string>(INITIAL_STATE.description);
  const [ouId, setOuId] = useState<string>(INITIAL_STATE.ouId);
  const [error, setError] = useState<string | null>(INITIAL_STATE.error);

  // A create failure goes stale the moment any wizard input changes, so any edit clears it.
  // currentStep is deliberately excluded: stepping back and forth is navigation, not a field edit.
  // Adjusted during render (React's documented pattern for state that must stay in sync with
  // another value) rather than in an effect, since a useEffect here would run a fully committed
  // render with the stale error still visible before clearing it a tick later.
  const formFingerprint = JSON.stringify([name, description, ouId]);
  const [prevFormFingerprint, setPrevFormFingerprint] = useState(formFingerprint);

  if (formFingerprint !== prevFormFingerprint) {
    setPrevFormFingerprint(formFingerprint);
    setError(null);
  }

  const reset = useCallback((): void => {
    setCurrentStep(INITIAL_STATE.currentStep);
    setName(INITIAL_STATE.name);
    setDescription(INITIAL_STATE.description);
    setOuId(INITIAL_STATE.ouId);
    setError(INITIAL_STATE.error);
  }, []);

  const contextValue: GroupCreateContextType = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      name,
      setName,
      description,
      setDescription,
      ouId,
      setOuId,
      error,
      setError,
      reset,
    }),
    [currentStep, name, description, ouId, error, reset],
  );

  return <GroupCreateContext.Provider value={contextValue}>{children}</GroupCreateContext.Provider>;
}
