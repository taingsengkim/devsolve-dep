/**
 * The locales the site is served in.
 *
 * Both are addressed by sub-path — `/en/programs` and `/km/programs` — so each
 * language is a real, indexable, shareable URL rather than a cookie-dependent
 * view of one. `en` is the fallback whenever a request cannot be matched.
 */
export const LOCALES = ["en", "km"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** What each locale calls itself, for the switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  km: "ភាសាខ្មែរ",
};

/** Short label for the collapsed switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  km: "KH",
};

/** The `lang` attribute and `hreflang` value for each locale. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  km: "km-KH",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/**
 * Splits a pathname into its locale and the rest.
 *
 * Returns the default locale when the path carries none, so callers can treat
 * an unprefixed path (an asset, an API route, a stale link) uniformly.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  rest: string;
  hadLocale: boolean;
} {
  const [, first = "", ...others] = pathname.split("/");
  if (isLocale(first)) {
    return { locale: first, rest: `/${others.join("/")}`, hadLocale: true };
  }
  return { locale: DEFAULT_LOCALE, rest: pathname, hadLocale: false };
}

/** Prefixes a path with a locale, without doubling an existing one. */
export function localise(pathname: string, locale: Locale): string {
  const { rest } = splitLocale(pathname);
  const clean = rest === "/" ? "" : rest;
  return `/${locale}${clean}`;
}
