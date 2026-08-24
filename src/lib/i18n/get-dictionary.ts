import "server-only";
import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";

/**
 * Message catalogues, imported lazily so a request only ships the language it
 * is actually rendering. The dynamic `import()` is what keeps the Khmer
 * catalogue out of an English response's bundle.
 */
const loaders = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  km: () => import("./dictionaries/km.json").then((m) => m.default),
} as const;

/** The shape every catalogue must satisfy — English is the source of truth. */
export type Dictionary = Awaited<ReturnType<(typeof loaders)["en"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders[DEFAULT_LOCALE];
  return load() as Promise<Dictionary>;
}
