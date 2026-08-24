import type { Metadata } from "next";
import PublicOrganizationProfileView from "@/components/company/PublicOrganizationProfileView";
import { JsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo/site";

const DESCRIPTION =
  "Run a bug bounty or vulnerability disclosure program on DevSolve: publish your scope, set your reward ranges, and work with researchers who report findings you can act on.";

export const metadata: Metadata = pageMetadata({
  title: "For companies",
  description: DESCRIPTION,
  path: "/company",
});

export default function PublicOrganizationProfilePage() {
  return (
    <>
      {/* WebPage + audience schema helps Google surface this page for
          "bug bounty platform for companies" and similar B2B queries. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${absoluteUrl("/company")}#webpage`,
          url: absoluteUrl("/company"),
          name: `${SITE_NAME} for companies`,
          description: DESCRIPTION,
          inLanguage: "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          publisher: { "@id": `${SITE_URL}/#organization` },
          audience: {
            "@type": "Audience",
            audienceType: "Organizations running bug bounty programs",
          },
        }}
      />

      <PublicOrganizationProfileView />
    </>
  );
}

