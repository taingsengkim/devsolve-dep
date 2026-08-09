/**
 * Display helpers shared by the problem and solution views.
 *
 * Each was written twice before this file existed, once per component, which
 * is how a card and the page above it came to disagree about what an empty
 * date looks like.
 */

/** A date as a reader wants it, or an em dash when there is nothing to show. */
export function formatDate(iso?: string, empty = "—"): string {
  if (!iso) return empty;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return empty;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Byte counts, rounded to something a person reads rather than parses. */
export function formatBytes(bytes?: number): string {
  if (bytes === undefined || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Up to two initials for an avatar fallback. */
export function initialsOf(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "?";
}

/** Pulls something readable out of an RTK Query error. */
export function messageOf(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data) return data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message) return message;
    }
  }
  return fallback;
}
