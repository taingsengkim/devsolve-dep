/**
 * A showcase overview and its step bodies are markdown. Anywhere one is shown
 * as a one- or two-line summary — a feed card, a review queue row — the syntax
 * has to come off first: a stray `##` or `[label](url)` inside a clamp reads as
 * noise rather than as formatting.
 */
export function excerptOf(markdown: string, max = 220): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}
