import type { Metadata } from "next";
import { DiscussionsFeed } from "@/components/discussions/DiscussionsFeed";
import { JsonLd, collectionSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Real bugs, blockers and architecture questions posted by developers — each with the stack it happened on, the steps to reproduce it, and the solutions that worked.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
    title: "Problems",
    description: DESCRIPTION,
    path: "/problems",
    locale: lang,
  });
}

export default function ProblemsPage() {
  return (
    <>
      <JsonLd
        data={collectionSchema({
          name: "Developer problems",
          description: DESCRIPTION,
          path: "/problems",
        })}
      />

      <DiscussionsFeed
        defaultCategory="Problems"
        breadcrumbLabel="Problems"
        title="Problems"
        badgeLabel="Ask · Answer · Accept"
        description="Post the bug, blocker, or question you are stuck on and get answers from people who have shipped in that stack."
        createHref="/community/create/problem"
        createLabel="Post a problem"
        emptyLabel="No problems found"
      />
    </>
  );
}
