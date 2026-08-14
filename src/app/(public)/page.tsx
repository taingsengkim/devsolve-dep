import type { Metadata } from "next";
import { Hero } from "@/components/landing/Hero";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { StatsSection } from "@/components/landing/StatsSection";
import { BountyPreview } from "@/components/landing/BountyPreview";
import { ProblemsSolutions } from "@/components/landing/ProblemsSolutions";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { CTABanner } from "@/components/landing/CTABanner";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Page() {
  return (
    <main className="text-slate-900 selection:bg-blue-100 selection:text-blue-900 dark:text-neutral-100 dark:selection:bg-blue-500/30 dark:selection:text-blue-50">
      {/* The site's identity, declared once here — every other page's
          structured data references these two nodes by id rather than
          restating them. */}
      <JsonLd data={[organizationSchema(), websiteSchema()]} />

      {/* The pitch */}
      <Hero />

      {/* How the three pillars work, scrubbed on scroll */}
      <FeatureHighlights />

      {/* Proof the platform is in use */}
      <StatsSection />

      {/* Pillar 1 — bug bounty */}
      <BountyPreview />

      {/* Pillar 2 — problems and solutions */}
      <ProblemsSolutions />

      {/* Pillar 3 — showcases */}
      <ShowcaseSection />

      {/* <CTABanner /> */}
    </main>
  );
}
