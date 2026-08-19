// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useConfig} from '@thunderid/contexts';
import {Link} from '@wso2/oxygen-ui';
import {ArrowUpRight} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import {useTranslation} from 'react-i18next';
import ExternalLinkConfirmDialog from '../ExternalLinkConfirm/ExternalLinkConfirmDialog';
import useExternalLinkConfirmation from '../ExternalLinkConfirm/useExternalLinkConfirmation';

/**
 * Props for {@link ExternalLink}.
 *
 * @public
 */
export interface ExternalLinkProps {
  /** Section id to look up in `documentation.links`, e.g. "users", "applications". */
  docKey: string;

  /** Optional label override. Defaults to the `common:learnMore` translation. */
  label?: string;

  /** Whether to prompt with an {@link ExternalLinkConfirmDialog} before navigating. Defaults to `true`. */
  confirmBeforeNavigate?: boolean;
}

/**
 * Renders an external link to the documentation page configured for `docKey`. Renders nothing
 * when no link is configured for that key, so pages can add this unconditionally and the link
 * only appears once an operator configures a URL for it.
 *
 * Clicking the link prompts the user with an {@link ExternalLinkConfirmDialog} before navigating
 * away, unless `confirmBeforeNavigate` is set to `false`.
 *
 * @public
 */
export default function ExternalLink({
  docKey,
  label = undefined,
  confirmBeforeNavigate = true,
}: ExternalLinkProps): JSX.Element | null {
  const {t} = useTranslation();
  const {getDocumentationLink} = useConfig();
  const {isOpen, pendingUrl, requestNavigation, confirm, cancel} = useExternalLinkConfirmation();

  const href = getDocumentationLink(docKey);

  if (!href) {
    return null;
  }

  const handleClick = (): void => {
    if (confirmBeforeNavigate) {
      requestNavigation(href);
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Link
        component="button"
        type="button"
        onClick={handleClick}
        style={{
          color: 'inherit',
          fontWeight: 500,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        {label ?? t('common:learnMore')}
        <ArrowUpRight size={14} style={{flexShrink: 0}} />
      </Link>
      {confirmBeforeNavigate && (
        <ExternalLinkConfirmDialog isOpen={isOpen} pendingUrl={pendingUrl} onConfirm={confirm} onCancel={cancel} />
      )}
    </>
  );
}
