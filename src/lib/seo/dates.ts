import { toDate } from "@/lib/format/datetime";

/**
 * Timestamps as machines read them — `lastmod` in the sitemap,
 * `datePublished` in structured data.
 *
 * The parsing rule (a missing zone marker means UTC, not local time) lives in
 * `@/lib/format/datetime` so the dates crawlers are given and the dates
 * readers are shown can never disagree about what an hour is.
 */
export function isoDateTime(
  value: string | null | undefined,
): string | undefined {
  return toDate(value)?.toISOString();
}
