/**
 * Timestamps as machines read them.
 *
 * Upstream sends two shapes: `2026-08-12T08:27:58.476348Z` on some fields and
 * `2026-08-12T08:23:39.513952` on others. The second is UTC with the marker
 * left off, so it is added rather than letting `Date` read it as local time —
 * which would shift every `lastmod` and `datePublished` by the rendering
 * server's offset.
 */
export function isoDateTime(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;

  const normalized = /(Z|[+-]\d{2}:?\d{2})$/.test(value) ? value : `${value}Z`;
  const parsed = new Date(normalized);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}
