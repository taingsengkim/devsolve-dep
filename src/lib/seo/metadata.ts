import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
} from "./site";

/**
 * One builder for every page's `<head>`, so a route only has to say what it is
 * about. Canonical URL, Open Graph and Twitter cards are derived from the same
 * three facts rather than restated — the common way these drift is a page
 * updating its title and forgetting the copy of it in `og:title`.
 *
 * Open Graph *images* are deliberately not set here: the `opengraph-image`
 * file convention already covers them, and file-based metadata outranks
 * anything returned from `generateMetadata`, so setting both would leave two
 * sources of truth where only one can win.
 */

export interface PageSeoInput {
  /** Bare page title. The root layout's template appends the site name. */
  title: string;
  /**
   * Set when the title already reads as a complete one — the home page, which
   * would otherwise render as `DevSolve — … · DevSolve`. Skips the template.
   */
  absoluteTitle?: boolean;
  description: string;
  /** Route path, leading slash included. Becomes the canonical URL. */
  path: string;
  type?: "website" | "article" | "profile";
  /** ISO timestamps — articles only, ignored otherwise. */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  /** Keeps the page out of search results while still serving it to people. */
  noIndex?: boolean;
}

/** Pages a crawler should never hold on to: private, transient, or duplicate. */
export const NO_INDEX: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/**
 * Search-result presentation for indexable pages: full-length snippets, large
 * image previews, no cap on video previews. Without these a page can be
 * rendered with a truncated snippet and a thumbnail-sized image.
 */
export const INDEX_RICH: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export function pageMetadata(input: PageSeoInput): Metadata {
  const {
    title,
    absoluteTitle = false,
    description,
    path,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    tags,
    noIndex = false,
  } = input;

  const url = absoluteUrl(path);
  /* The document title gets the site name from the root template; a social
     card has no template, so it is spelled out here. */
  const socialTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          title: socialTitle,
          description,
          url,
          siteName: SITE_NAME,
          locale: DEFAULT_LOCALE,
          publishedTime,
          modifiedTime,
          authors,
          tags,
        }
      : {
          type,
          title: socialTitle,
          description,
          url,
          siteName: SITE_NAME,
          locale: DEFAULT_LOCALE,
        };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(TWITTER_HANDLE ? { site: TWITTER_HANDLE, creator: TWITTER_HANDLE } : {}),
    },
    robots: noIndex ? NO_INDEX : INDEX_RICH,
  };
}
