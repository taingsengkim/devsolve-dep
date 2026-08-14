import type { Metadata } from "next";
import { DiscussionsFeed } from "@/components/discussions/DiscussionsFeed";
import { JsonLd, collectionSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Projects built by DevSolve members, written up step by step: the stack behind each one, the decisions that made it work, and links to the running thing.";

export const metadata: Metadata = pageMetadata({
  title: "Showcases",
  description: DESCRIPTION,
  path: "/showcases",
});

export default function ShowcasesPage() {
  return (
    <>
      <JsonLd
        data={collectionSchema({
          name: "Project showcases",
          description: DESCRIPTION,
          path: "/showcases",
        })}
      />

      <DiscussionsFeed
        defaultCategory="Showcase"
        breadcrumbLabel="Showcases"
        title="Showcases"
        badgeLabel="Ship · Share · Inspire"
        description="Share what you built, the stack behind it, and the decisions that made it work."
        createHref="/community/create/showcase"
        createLabel="Post a showcase"
        emptyLabel="No showcases found"
      />
    </>
  );
}
