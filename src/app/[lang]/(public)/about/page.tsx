import { AboutHero } from "@/components/public-about/AboutHero";
import { ArchitectureAndTeamSection } from "@/components/public-about/ArchitectureAndTeamSection";
import { AboutContactSection } from "@/components/public-about/AboutContactSection";
import { JsonLd } from "@/lib/seo/jsonld";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, absoluteUrl } from "@/lib/seo/site";

export default function AboutPage() {
  return (
    <main className="text-slate-900 selection:bg-blue-100 selection:text-blue-900 dark:text-neutral-100 dark:selection:bg-blue-500/30 dark:selection:text-blue-50">
      {/* WebPage schema ties this URL to the Organisation node declared on the
          home page, giving search engines a structured signal that this is
          DevSolve's own "about" document rather than an arbitrary page about
          the company name. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${absoluteUrl("/about")}#webpage`,
          url: absoluteUrl("/about"),
          name: `About ${SITE_NAME}`,
          description:
            "Who builds DevSolve and why: a platform where developers solve real engineering problems together, publish what they ship, and get paid for the vulnerabilities they find.",
          inLanguage: "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": `${SITE_URL}/#organization` },
          publisher: { "@id": `${SITE_URL}/#organization` },
        }}
      />

      <AboutHero />
      <ArchitectureAndTeamSection />
      <AboutContactSection />
    </main>
  );
}
