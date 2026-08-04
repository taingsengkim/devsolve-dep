import { Hero } from "@/components/landing/Hero";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { StatsSection } from "@/components/landing/StatsSection";
import { BountyPreview } from "@/components/landing/BountyPreview";
import { ProblemsSolutions } from "@/components/landing/ProblemsSolutions";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { CTABanner } from "@/components/landing/CTABanner";

export default function Page() {
  return (
    <main className="text-slate-900 selection:bg-blue-100 selection:text-blue-900">
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
