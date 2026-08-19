// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getErrorMessage} from '@thunderid/utils';
import {Alert, Button, ListingTable, Stack} from '@wso2/oxygen-ui';
import {AlertCircle} from '@wso2/oxygen-ui-icons-react';
import type {JSX, ReactNode} from 'react';

/**
 * The subset of the i18next TFunction interface {@link QueryErrorNotice} needs from its caller.
 */
type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * Resolves a localized error message from a read failure. Matches `getErrorMessage`'s signature
 * (`@thunderid/utils`) exactly, so feature resolvers like `getUserErrorMessage` plug in with no
 * adapter.
 */
export type QueryErrorMessageResolver = (
  error: Error,
  t: TranslateFn,
  fallbackKey: string,
  fallbackDefaultValue?: string,
) => string;

/**
 * Props for {@link QueryErrorNotice}.
 *
 * @public
 */
export interface QueryErrorNoticeProps {
  /** The error thrown by the failed read. */
  error: Error;

  /** The i18next translation function scoped to the caller's namespace. */
  t: TranslateFn;

  /**
   * `'block'` (default) replaces a grid, list, or page body. `'inline'` renders a plain
   * `Alert` for a tab body or in-card section.
   */
  variant?: 'block' | 'inline';

  /** Title shown above the resolved message. Required for `variant="block"`. */
  title?: string;

  /** i18n key used to resolve the message when no error-code-specific translation exists. */
  fallbackKey?: string;

  /** Default value for {@link fallbackKey}, per the i18n Fallback Values convention. */
  fallbackDefaultValue?: string;

  /**
   * Resolves the localized message from `error`. Defaults to `getErrorMessage` from
   * `@thunderid/utils`. Pass a feature resolver (e.g. `getUserErrorMessage`) to interpolate
   * error-specific params.
   */
  resolveErrorMessage?: QueryErrorMessageResolver;

  /** Called when the user retries. Renders a `common:actions.refresh` button above `action`, if set. */
  onRetry?: () => void;

  /** A second action stacked below the retry button, e.g. an edit page's "Back to X" link. */
  action?: ReactNode;

  /** Custom illustration for `variant="block"`. Defaults to an `AlertCircle` icon. */
  illustration?: ReactNode;
}

/**
 * Renders a failed read (list, edit page, or tab section) in place of its content, resolving the
 * error through {@link QueryErrorMessageResolver} rather than surfacing raw server text. See
 * `frontend/AGENTS.md`'s Error Display section.
 *
 * @public
 */
export default function QueryErrorNotice({
  error,
  t,
  variant = 'block',
  title = undefined,
  fallbackKey = 'common:messages.somethingWentWrong',
  fallbackDefaultValue = 'Something went wrong',
  resolveErrorMessage = getErrorMessage,
  onRetry = undefined,
  action = undefined,
  illustration = undefined,
}: QueryErrorNoticeProps): JSX.Element {
  const message = resolveErrorMessage(error, t, fallbackKey, fallbackDefaultValue);
  const retryButton = onRetry ? (
    <Button variant="outlined" onClick={onRetry}>
      {t('common:actions.refresh', {defaultValue: 'Refresh'})}
    </Button>
  ) : undefined;

  // Stack the retry button above a secondary action (e.g. a back link) so both read as
  // one action group instead of competing side by side.
  const resolvedAction =
    retryButton && action ? (
      <Stack direction="column" spacing={1} alignItems="center">
        {retryButton}
        {action}
      </Stack>
    ) : (
      (retryButton ?? action)
    );

  if (variant === 'inline') {
    return (
      <Alert severity="error" action={resolvedAction}>
        {message}
      </Alert>
    );
  }

  return (
    <ListingTable.EmptyState
      illustration={illustration ?? <AlertCircle size={40} />}
      title={title}
      description={message}
      action={resolvedAction}
    />
  );
}
