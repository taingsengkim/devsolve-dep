import { getShowcase } from "@/lib/seo/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/seo/og-card";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/site";
import { describe } from "@/lib/seo/text";

/**
 * The card a shared showcase link unfurls into.
 *
 * The project's own cover image is not used as the card: covers are uploaded
 * at whatever aspect the author had, and a 4:3 screenshot letterboxed into a
 * 1.91:1 slot reads as a mistake. The generated card carries the title, which
 * is what a reader is deciding on anyway.
 */

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `A project showcase on ${SITE_NAME}`;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const showcase = await getShowcase(id);

  if (!showcase?.title) {
    return ogCard({
      eyebrow: "Showcase",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    });
  }

  return ogCard({
    eyebrow: showcase.categoryName
      ? `Showcase · ${showcase.categoryName}`
      : "Showcase",
    title: showcase.title,
    description: describe(showcase.overview, "", 140),
    chips: (showcase.tags ?? [])
      .map((tag) => tag.name)
      .filter((name): name is string => Boolean(name)),
    footnote: showcase.authorName ? `Built by ${showcase.authorName}` : undefined,
  });
}
