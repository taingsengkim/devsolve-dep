export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import MarketplacePage from "@/components/programs/details/PublicProgramBrowsePage";
import React from "react";
import { JsonLd, collectionSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Every bug bounty and vulnerability disclosure program running on DevSolve — their scope, their reward ranges, and what each organization is asking researchers to look at.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    title: "Bug bounty programs",
    description: DESCRIPTION,
    path: "/programs",
    locale: lang,
  });
}

export default function PublicProgramBrowse() {
  return (
    <>
      <JsonLd
        data={collectionSchema({
          name: "Bug bounty programs",
          description: DESCRIPTION,
          path: "/programs",
        })}
      />

      <MarketplacePage />
    </>
  );
}
