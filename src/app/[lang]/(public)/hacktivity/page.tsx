import type { Metadata } from "next";
import HacktivityFeature from "@/components/Hackitvitty/HacktivityFeature";
import { JsonLd, collectionSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "A live feed of disclosed security findings on DevSolve — what researchers reported, which programs resolved them, and the severity each one was rated.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    title: "Hacktivity",
    description: DESCRIPTION,
    path: "/hacktivity",
    locale: lang,
  });
}

export default function HacktivityPage() {
  return (
    <>
      <JsonLd
        data={collectionSchema({
          name: "Hacktivity",
          description: DESCRIPTION,
          path: "/hacktivity",
        })}
      />

      <HacktivityFeature />
    </>
  );
}
