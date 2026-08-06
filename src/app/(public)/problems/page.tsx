"use client";

import { DiscussionsFeed } from "@/components/discussions/DiscussionsFeed";

export default function ProblemsPage() {
  return (
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
  );
}
