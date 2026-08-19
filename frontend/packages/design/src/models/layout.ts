// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Base stylesheet configuration.
 */
export interface BaseStylesheet {
  /** Unique identifier for the stylesheet (used as element id in DOM) */
  id: string;
  /** The type of stylesheet */
  type: StylesheetType;
  /** When true the stylesheet is skipped during injection (preview-only toggle). */
  disabled?: boolean;
}

/**
 * Inline stylesheet that injects a `<style>` element.
 */
export interface InlineStylesheet extends BaseStylesheet {
  type: 'inline';
  /** The CSS content to inject */
  content: string;
}

/**
 * URL-based stylesheet that injects a `<link rel="stylesheet">` element.
 */
export interface UrlStylesheet extends BaseStylesheet {
  type: 'url';
  /** The URL of the external stylesheet (must be https) */
  href: string;
}

/**
 * Supported stylesheet types for head injection.
 */
export type StylesheetType = 'inline' | 'url';

/**
 * Union type for all supported stylesheet configurations.
 */
export type Stylesheet = InlineStylesheet | UrlStylesheet;

/**
 * Head configuration within layout, similar to an HTML document head.
 */
export interface LayoutHead {
  /** Stylesheets to inject into the document head */
  stylesheets?: Stylesheet[];
}

/**
 * Layout configuration as a flexible JSON structure.
 * Contains head configuration, screen definitions, and additional layout properties.
 */
export interface LayoutConfig {
  /**
   * Head configuration for injecting stylesheets into the document head
   */
  head?: LayoutHead;

  /**
   * Screen configurations for different authentication flows
   */
  screens?: Record<string, unknown>;

  /**
   * Additional layout properties
   */
  [key: string]: unknown;
}
