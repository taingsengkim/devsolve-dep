import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og-card";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";

/**
 * The site-wide social card.
 *
 * Sitting at the root of `app`, it covers every route that does not draw its
 * own — the landing page, the feeds, the leaderboard. Routes that do (a
 * problem, a showcase, a program) place an `opengraph-image` of their own
 * further down the tree, and the closer file wins.
 *
 * Nothing here varies, so Next renders it once at build time.
 */

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;

export default function Image() {
  return ogCard({
    eyebrow: "Developer community",
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    chips: ["Problems", "Solutions", "Showcases", "Bug bounty"],
    footnote: "devsolve.app",
  });
}
