import type { Metadata } from "next";
import { DiscussionsFeed } from "@/components/discussions/DiscussionsFeed";
import { JsonLd, collectionSchema } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Browse everything the DevSolve community is working on: problems people are stuck on, the solutions that fixed them, and the projects members have shipped.";

/* A server component wrapping the client feed, which is what lets the route
   describe itself — `export const metadata` is not available inside a
   component marked "use client". */
export const metadata: Metadata = pageMetadata({
  title: "Community",
  description: DESCRIPTION,
  path: "/community",
});

export default function DiscussionsPage() {
  return (
    <>
      <JsonLd
        data={collectionSchema({
          name: "DevSolve Community",
          description: DESCRIPTION,
          path: "/community",
        })}
      />

      <DiscussionsFeed
        defaultCategory="All"
        breadcrumbLabel="Community"
        title="Community"
        badgeLabel="Problems · Solutions · Showcases"
        description="Ask focused questions, share practical solutions, and showcase what you are building with other developers."
        createHref="/community/create"
        createLabel="Start a discussion"
        emptyLabel="No discussions found"
      />
    </>
  );
}
