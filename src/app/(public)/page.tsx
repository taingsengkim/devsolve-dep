import { Hero } from "@/components/landing/Hero";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { StatsSection } from "@/components/landing/StatsSection";
import { BountyPreview } from "@/components/landing/BountyPreview";
import { DiscussionsTeaser } from "@/components/landing/DiscussionsTeaser";
import { CTABanner } from "@/components/landing/CTABanner";

export default function Page() {
  return (
    <main className="text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Hero />
      <FeatureHighlights />
      <StatsSection />
      <BountyPreview />
      <DiscussionsTeaser />
      <CTABanner />
    </main>
  );
}