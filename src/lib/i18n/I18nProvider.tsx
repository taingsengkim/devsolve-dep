"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { DEFAULT_LOCALE, localise, type Locale } from "./config";
import type { Dictionary } from "./get-dictionary";

/* The catalogue is resolved on the server and handed down once. Client
   components read it from context rather than importing a catalogue directly,
   which is what stops the Khmer strings being bundled into every page. */

type I18nValue = {
  locale: Locale;
  dict: Dictionary;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, dict }), [locale, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nValue | null {
  return useContext(I18nContext);
}

/** The active locale. Falls back rather than throwing, so a component used
 *  outside the provider (a storybook, a test) still renders. */
export function useLocale(): Locale {
  return useI18n()?.locale ?? DEFAULT_LOCALE;
}

/**
 * Resolves a dotted key against the catalogue: `t("nav.programs")`.
 *
 * A missing key returns the key itself rather than empty space — a visible
 * `nav.programs` in the UI is a bug report; a blank gap is a mystery.
 */
export function useT() {
  const ctx = useI18n();
  return useCallback(
    (key: string): string => {
      if (!ctx) return key;
      const found = key
        .split(".")
        .reduce<unknown>(
          (node, part) =>
            node && typeof node === "object"
              ? (node as Record<string, unknown>)[part]
              : undefined,
          ctx.dict,
        );
      return typeof found === "string" ? found : key;
    },
    [ctx],
  );
}

/**
 * Prefixes an internal path with the active locale.
 *
 * Bare links still work — the proxy would redirect them and the locale cookie
 * would land the visitor in the right language — but at the cost of a server
 * round trip that also drops client-side navigation. This keeps links
 * canonical from the start.
 */
export function useLocalePath() {
  const locale = useLocale();
  return useCallback(
    (href: string) => (href.startsWith("/") ? localise(href, locale) : href),
    [locale],
  );
}
