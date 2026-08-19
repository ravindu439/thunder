// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const getInitials = (name?: string): string => {
  const normalized = name?.trim();
  if (!normalized) return '?';
  const parts = normalized.split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return normalized.slice(0, 2).toUpperCase();
};

export default getInitials;
