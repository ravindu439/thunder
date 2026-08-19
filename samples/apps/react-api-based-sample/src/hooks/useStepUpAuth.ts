// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { useState, useCallback } from "react";
import { fetchUsers, fetchUserById, type User } from "../utils/api";
import { decodeJwt, hasMinimumAAL } from "../utils/jwt";

interface UseStepUpAuthReturn {
  triggerStepUp: (
    criticalOperationMessage: string,
    onSuccess: () => void,
    requiredAAL?: string
  ) => Promise<void>;
  showStepUp: boolean;
  userMobileNumber: string | null;
  currentAssertion: string | null;
  criticalOperationMessage: string | null;
  onStepUpSuccess: (enrichedAssertion: string) => void;
  onStepUpClose: () => void;
  pendingAction: (() => void) | null;
}

export function useStepUpAuth(): UseStepUpAuthReturn {
  const [showStepUp, setShowStepUp] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState<string | null>(null);
  const [currentAssertion, setCurrentAssertion] = useState<string | null>(null);
  const [criticalOperationMessage, setCriticalOperationMessage] = useState<
    string | null
  >(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const triggerStepUp = useCallback(
    async (message: string, onSuccess: () => void, requiredAAL: string = "AAL2") => {
      // Get current assertion token
      const assertion = sessionStorage.getItem("assertion");
      if (!assertion) {
        throw new Error("No assertion token found. Please sign in again.");
      }

      // Check if assertion already meets the required AAL level
      if (hasMinimumAAL(assertion, requiredAAL)) {
        // Already has required AAL, execute action directly
        onSuccess();
        return;
      }

      // Decode token to get user ID
      const decodedToken = decodeJwt(assertion);
      if (!decodedToken) {
        throw new Error("Invalid assertion token. Please sign in again.");
      }

      // Get user ID from token (sub claim)
      const userId = decodedToken.payload.sub as string | undefined;
      const username = decodedToken.payload.username as string | undefined;
      
      if (!userId && !username) {
        throw new Error("User information not found in token. Please sign in again.");
      }

      // Fetch user to get mobile number
      let user: User | null = null;
      
      // Try to fetch by ID first (most direct)
      if (userId) {
        try {
          user = await fetchUserById(userId);
        } catch (error) {
          // Log at debug level and fall through to username filter
          console.debug("Failed to fetch user by ID, falling back to username filter:", error);
        }
      }
      
      // If ID fetch failed, try username filter
      if (!user && username) {
        // Escape special characters to prevent filter injection
        const escapedUsername = username.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const users = await fetchUsers(`username eq "${escapedUsername}"`);
        if (users.length > 0) {
          user = users[0];
        }
      }
      
      if (!user) {
        throw new Error("User not found. Please sign in again.");
      }
      const mobileNumber = user.attributes.mobile_number as string | undefined;

      if (!mobileNumber || mobileNumber.trim() === "") {
        throw new Error(
          "Mobile number not found. Please update your profile with a mobile number."
        );
      }

      // Set up step-up modal
      setUserMobileNumber(mobileNumber);
      setCurrentAssertion(assertion);
      setCriticalOperationMessage(message);
      setPendingAction(() => onSuccess);
      setShowStepUp(true);
    },
    []
  );

  const onStepUpSuccess = useCallback(
    (enrichedAssertion: string) => {
      // Update assertion token with enriched one (replace existing)
      sessionStorage.setItem("assertion", enrichedAssertion);
      setShowStepUp(false);

      // Execute pending action
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }

      // Reset state
      setUserMobileNumber(null);
      setCurrentAssertion(null);
      setCriticalOperationMessage(null);
    },
    [pendingAction]
  );

  const onStepUpClose = useCallback(() => {
    // Cancel step-up
    setShowStepUp(false);
    setPendingAction(null);
    setUserMobileNumber(null);
    setCurrentAssertion(null);
    setCriticalOperationMessage(null);
  }, []);

  return {
    triggerStepUp,
    showStepUp,
    userMobileNumber,
    currentAssertion,
    criticalOperationMessage,
    onStepUpSuccess,
    onStepUpClose,
    pendingAction,
  };
}
