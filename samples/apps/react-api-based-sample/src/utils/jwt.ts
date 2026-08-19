// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const base64UrlDecode = (base64UrlString: string): string => {
  let base64 = base64UrlString.replace(/-/g, "+").replace(/_/g, "/");

  while (base64.length % 4 !== 0) {
    base64 += "=";
  }

  return atob(base64);
};

export interface DecodedToken {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export const decodeJwt = (token: string): DecodedToken | null => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      console.error("Invalid JWT format: token must have exactly 3 parts");
      return null;
    }

    const [header, payload, signature] = parts;

    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Gets the AAL (Authentication Assurance Level) from an assertion token
 * @param assertion - The JWT assertion token
 * @returns The AAL level (e.g., "AAL1", "AAL2", "AAL3") or null if not found
 */
export const getAALFromAssertion = (assertion: string): string | null => {
  const decoded = decodeJwt(assertion);
  if (!decoded) {
    return null;
  }

  const payload = decoded.payload;
  const assurance = payload.assurance as
    | {
        aal?: string;
        ial?: string;
        authenticators?: unknown[];
      }
    | undefined;

  if (assurance && assurance.aal) {
    return assurance.aal;
  }

  return null;
};

/**
 * Checks if the assertion token has at least the specified AAL level
 * @param assertion - The JWT assertion token
 * @param requiredAAL - The required AAL level (e.g., "AAL2")
 * @returns true if the assertion meets or exceeds the required AAL level
 */
export const hasMinimumAAL = (
  assertion: string,
  requiredAAL: string
): boolean => {
  const currentAAL = getAALFromAssertion(assertion);
  if (!currentAAL) {
    return false;
  }

  // AAL levels: UNKNOWN (0) < AAL1 (1) < AAL2 (2) < AAL3 (3)
  const aalLevels: Record<string, number> = {
    UNKNOWN: 0,
    AAL1: 1,
    AAL2: 2,
    AAL3: 3,
  };

  const currentLevel = aalLevels[currentAAL];
  const requiredLevel = aalLevels[requiredAAL];

  if (currentLevel === undefined || requiredLevel === undefined) {
    // Fail securely: unknown AAL levels are not trusted
    return false;
  }

  return currentLevel >= requiredLevel;
};
