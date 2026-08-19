// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {JSX, ReactNode} from 'react';

/**
 * Validation step status during configuration import
 */
export interface ValidationStep {
  id: string;
  label: string;
  status: 'pending' | 'validating' | 'completed' | 'failed';
}

/**
 * Parse error details for failed configuration sections
 */
export interface ParseError {
  resourceType: string;
  fileName: string;
  error: string;
}

/**
 * Configuration summary item for display
 */
export interface ConfigSummaryItem {
  id: string;
  icon: JSX.Element;
  label: string;
  value: string | number;
  content?: ReactNode;
  /**
   * Status for export items (optional, used in export flow)
   */
  status?: 'ready' | 'warning';
  /**
   * Dependency count for export items (optional, used in export flow)
   */
  dependencyCount?: number;
}

/**
 * Product configuration structure
 */
export interface ProductConfig {
  application?: unknown[];
  connection?: unknown[];
  user_type?: unknown[];
  organization_unit?: unknown[];
  user?: unknown[];
  flow?: unknown[];
  translation?: unknown[];
  layout?: unknown[];
  theme?: unknown[];
  [key: string]: unknown;
}

/**
 * Import request payload for /import endpoint.
 */
export interface ImportRequest {
  content: string;
  variables?: Record<string, string | string[]>;
  dryRun?: boolean;
  options?: {
    upsert?: boolean;
    continueOnError?: boolean;
    target?: 'runtime';
  };
}

/**
 * Per-document import outcome.
 */
export interface ImportItemOutcome {
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  operation?: 'create' | 'update';
  status: 'success' | 'failed';
  code?: string;
  message?: string;
}

/**
 * Import response payload from /import endpoint.
 */
export interface ImportResponse {
  summary: {
    totalDocuments: number;
    imported: number;
    failed: number;
    importedAt: string;
  };
  results: ImportItemOutcome[];
}
