import { AboutHero } from "@/components/public-about/AboutHero";
import { ArchitectureAndTeamSection } from "@/components/public-about/ArchitectureAndTeamSection";
import { AboutContactSection } from "@/components/public-about/AboutContactSection";

export default function AboutPage() {
  return (
    <main className="text-slate-900 selection:bg-blue-100 selection:text-blue-900 dark:text-neutral-100 dark:selection:bg-blue-500/30 dark:selection:text-blue-50">
      <AboutHero />
      <ArchitectureAndTeamSection />
      <AboutContactSection />
    </main>
  );
}
