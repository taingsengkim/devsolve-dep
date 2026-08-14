import type { Metadata } from "next";
import PublicOrganizationProfileView from "@/components/company/PublicOrganizationProfileView";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "For companies",
  description:
    "Run a bug bounty or vulnerability disclosure program on DevSolve: publish your scope, set your reward ranges, and work with researchers who report findings you can act on.",
  path: "/company",
});

export default function PublicOrganizationProfilePage() {
  return <PublicOrganizationProfileView />;
}
