/**
 * Turning the backend's timestamps into something a reader can act on.
 *
 * Two shapes arrive: `2026-08-16T13:26:37.173010409Z` from some fields and
 * `2026-08-16T13:26:37.173010` from others. The second is UTC with the marker
 * left off, and `new Date` reads a bare timestamp as *local* time — so without
 * normalising it, every such value is displayed shifted by the viewer's own
 * offset. That is invisible while only the date is shown and obvious the
 * moment a clock time is.
 */

/** Parses either shape, treating a missing zone as UTC. Null when unusable. */
export function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const normalized = /(Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`;
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** `Aug 16, 2026` — for places where the day is the whole answer. */
export function formatDate(
  value: string | null | undefined,
  fallback = "—",
): string {
  const date = toDate(value);
  if (!date) return fallback;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

/**
 * `Aug 16, 2026, 8:42:37 PM` — the day and the full clock time, in the
 * reader's own timezone.
 *
 * Seconds included: on a list where several reports can be touched inside the
 * same minute, they are what settles the order.
 */
export function formatDateTime(
  value: string | null | undefined,
  fallback = "—",
): string {
  const date = toDate(value);
  if (!date) return fallback;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}
