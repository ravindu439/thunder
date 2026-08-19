// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Mask sensitive data in a string.
 * Replaces characters with asterisks, leaving first and last characters visible.
 * @param value - The value to mask
 * @param visibleChars - Number of characters to leave visible at start and end
 * @returns Masked string
 */
export function maskString(value: string, visibleChars = 2): string {
  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length);
  }

  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const maskLength = value.length - visibleChars * 2;

  return `${start}${'*'.repeat(maskLength)}${end}`;
}

/**
 * Common sensitive field names to mask in logs.
 */
const SENSITIVE_FIELD_NAMES = new Set([
  'password',
  'passwd',
  'pwd',
  'secret',
  'token',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'apikey',
  'api_key',
  'auth',
  'authorization',
  'cookie',
  'session',
  'sessionid',
  'session_id',
  'ssn',
  'credit_card',
  'creditcard',
  'cvv',
  'pin',
]);

/**
 * Recursively mask sensitive data in an object.
 * @param obj - The object to process
 * @returns New object with sensitive fields masked
 */
export default function maskSensitiveData(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Error) {
    return {
      name: obj.name,
      message: obj.message,
      stack: obj.stack,
    };
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item));
  }

  const masked: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();

    if (SENSITIVE_FIELD_NAMES.has(lowerKey)) {
      masked[key] = typeof value === 'string' ? maskString(value) : '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  });

  return masked;
}
