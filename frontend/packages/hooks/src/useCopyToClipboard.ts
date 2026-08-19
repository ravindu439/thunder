// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * Options for configuring the copy to clipboard hook behavior
 *
 * @interface UseCopyToClipboardOptions
 */
export interface UseCopyToClipboardOptions {
  /**
   * Duration in milliseconds to keep the copied state as true
   * @default 2000
   */
  resetDelay?: number;
  /**
   * Callback function to execute after successful copy
   */
  onCopy?: () => void;
}

/**
 * Return type for useCopyToClipboard hook
 *
 * @interface UseCopyToClipboardResult
 */
export interface UseCopyToClipboardResult {
  /**
   * Whether the text has been copied (resets after resetDelay)
   */
  copied: boolean;
  /**
   * Function to copy text to clipboard
   * @param text - The text to copy
   * @returns Promise that resolves when copy is complete
   */
  copy: (text: string) => Promise<void>;
}

/**
 * Custom hook to copy text to clipboard with fallback support
 *
 * Provides a copy function that uses the modern Clipboard API with
 * a fallback to document.execCommand for older browsers.
 * Manages the copied state that automatically resets after a delay.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing the copied state and copy function
 *
 * @example
 * ```typescript
 * const { copied, copy } = useCopyToClipboard({
 *   resetDelay: 2000,
 *   onCopy: () => console.log('Copied!')
 * });
 *
 * // In your component
 * <button onClick={() => copy('Hello World')}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */
export default function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
  const {resetDelay = 2000, onCopy} = options;
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   *  Clean up timeout on unmount to prevent memory leaks.
   */
  useEffect(
    () => (): void => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const copy = useCallback(
    async (text: string): Promise<void> => {
      try {
        // Try modern Clipboard API first
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopy?.();

        // Clear existing timeout if any
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Reset copied state after delay
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch {
        // Fallback for older browsers using execCommand
        const textArea: HTMLTextAreaElement = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand('copy');
          setCopied(true);
          onCopy?.();

          // Clear existing timeout if any
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Reset copied state after delay
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
          }, resetDelay);
        } catch {
          // Silently fail if both methods don't work
        }

        document.body.removeChild(textArea);
      }
    },
    [resetDelay, onCopy],
  );

  return {copied, copy};
}
