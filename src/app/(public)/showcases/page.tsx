"use client";

import { DiscussionsFeed } from "@/components/discussions/DiscussionsFeed";

export default function ShowcasesPage() {
  return (
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
  );
}
