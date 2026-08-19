// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {I18nDefaultConstants} from '@thunderid/i18n';
import {useThunderID} from '@thunderid/react';
import i18next from 'i18next';
import type {JSX, ComponentType} from 'react';
import {useEffect} from 'react';
import {initReactI18next, useTranslation} from 'react-i18next';

const enUS = await import('@thunderid/i18n/locales/en-US').then((m) => m.default);

interface I18nMeta {
  i18n?: {
    language?: string;
    translations?: Record<string, Record<string, string>>;
  };
}

await i18next.use(initReactI18next).init({
  resources: {
    [I18nDefaultConstants.FALLBACK_LANGUAGE]: enUS,
  },
  lng: I18nDefaultConstants.FALLBACK_LANGUAGE,
  fallbackLng: I18nDefaultConstants.FALLBACK_LANGUAGE,
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  debug: import.meta.env.DEV,
});

export default function withI18n<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithI18n(props: P): JSX.Element {
    const {meta} = useThunderID();
    const {i18n} = useTranslation();

    useEffect(() => {
      const i18nMeta = (meta as I18nMeta)?.i18n;
      const translations = i18nMeta?.translations;
      if (!translations) {
        return;
      }

      const language: string = i18nMeta?.language ?? i18n.language;
      let added = false;

      Object.entries(translations).forEach(([namespace, keys]) => {
        if (!keys || Object.keys(keys).length === 0) {
          return;
        }

        const existing = (i18n.getResourceBundle(language, namespace) as Record<string, string> | undefined) ?? {};

        i18n.addResourceBundle(language, namespace, {...existing, ...keys}, true, true);
        added = true;
      });

      if (added) {
        i18n.emit('added', language, Object.keys(translations));
      }

      if (language !== i18n.language) {
        i18n.changeLanguage(language).catch(() => undefined);
      }
    }, [meta, i18n]);

    return <WrappedComponent {...props} />;
  };
}
