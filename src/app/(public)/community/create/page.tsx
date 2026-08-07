"use client";

import React from "react";
import { CreatePostSelection } from "@/components/discussions/create/CreatePostSelection";

export default function PublicCreatePostSelectionPage() {
  return (
    /* Full-bleed: no max-width column, no page padding. The navbar is a fixed
       island the layout already clears with padding, so the shell fills what
       is left of the viewport rather than a flat 100dvh — which would push
       exactly the navbar's height of empty space past the fold. */
    <CreatePostSelection
      basePath="/community/create"
      backHref="/community"
      backLabel="Back to community"
      className="min-h-[calc(100dvh-var(--navbar-height))]"
    />
  );
}
