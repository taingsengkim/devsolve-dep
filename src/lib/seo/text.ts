/**
 * Turning user-written Markdown into the one-line plain text a `<meta>`
 * description or a social card needs.
 *
 * Problem bodies and showcase overviews are Markdown, and a description that
 * still carries `##`, backticks and link syntax is what search engines show
 * under the title — so the syntax is stripped rather than escaped.
 */

/** Roughly what Google renders before truncating a description itself. */
export const DESCRIPTION_LIMIT = 160;

/**
 * Markdown to prose. Fenced code goes entirely — a description made of a stack
 * trace tells a reader nothing about the page — while link and image syntax
 * collapses to the text a human wrote.
 */
export function plainText(source: string | null | undefined): string {
  if (!source) return "";

  return (
    source
      // Fenced and indented code blocks.
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/~~~[\s\S]*?~~~/g, " ")
      // Images before links: `![alt](src)` would otherwise leave a stray `!`.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Reference-style links and bare autolinks.
      .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
      .replace(/<https?:\/\/[^>]+>/g, " ")
      // Inline HTML, which Markdown allows.
      .replace(/<[^>]+>/g, " ")
      // Inline code.
      .replace(/`+/g, "")
      /* Emphasis is unwrapped in pairs rather than by deleting every `*` and
         `_` in the text. Underscores carry meaning of their own here —
         stripping them blindly turned `invalid_grant` into `invalidgrant` —
         so the underscore forms only match when the run is delimited by
         something other than a word character, which is what makes it
         emphasis rather than part of an identifier. */
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*\n]+)\*/g, "$1")
      .replace(/~~([^~]+)~~/g, "$1")
      .replace(/(^|[^\w])__([^_\n]+)__(?!\w)/g, "$1$2")
      .replace(/(^|[^\w])_([^_\n]+)_(?!\w)/g, "$1$2")
      // Line-level markers: headings, quotes, list bullets, table pipes, rules.
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s{0,3}>\s?/gm, "")
      .replace(/^\s{0,3}([-*+]|\d+[.)])\s+/gm, "")
      .replace(/^\s{0,3}([-*_]\s*){3,}$/gm, " ")
      .replace(/\|/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Cuts to `limit` characters on a word boundary, adding an ellipsis only when
 * something was actually dropped.
 */
export function truncate(value: string, limit: number): string {
  if (value.length <= limit) return value;

  const clipped = value.slice(0, limit - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  /* Falling back to the hard cut covers a single word longer than the limit,
     where there is no space to break on. */
  const stem = lastSpace > limit * 0.6 ? clipped.slice(0, lastSpace) : clipped;

  return `${stem.replace(/[\s,;:.!?-]+$/, "")}…`;
}

/**
 * The description a page advertises: its own Markdown reduced to prose and
 * trimmed to length, or the fallback when the body is empty.
 */
export function describe(
  source: string | null | undefined,
  fallback: string,
  limit: number = DESCRIPTION_LIMIT,
): string {
  const text = plainText(source);
  return text ? truncate(text, limit) : truncate(fallback, limit);
}

/** Sentence-cases an upstream enum (`IN_PROGRESS` -> `In progress`). */
export function humanizeEnum(value: string | null | undefined): string {
  if (!value) return "";
  const words = value.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
