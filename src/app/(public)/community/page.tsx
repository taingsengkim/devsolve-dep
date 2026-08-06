"use client";

import { DiscussionsFeed } from "@/components/discussions/DiscussionsFeed";

export default function DiscussionsPage() {
  return (
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
  );
}
