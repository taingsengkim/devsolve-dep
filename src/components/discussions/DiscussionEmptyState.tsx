"use client";

import React from "react";
import { motion } from "motion/react";
import { MessageSquareDashed, Plus } from "lucide-react";

import { AuthGatedLink } from "@/components/auth/AuthGatedLink";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DiscussionEmptyStateProps {
  onReset: () => void;
  hasFilters: boolean;
  createHref: string;
  emptyLabel?: string;
}

export function DiscussionEmptyState({
  onReset,
  hasFilters,
  createHref,
  emptyLabel = "No discussions found",
}: DiscussionEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-card p-10 text-center shadow-xs ring-1 ring-foreground/5 sm:p-12"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <MessageSquareDashed aria-hidden="true" className="size-7" />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          {emptyLabel}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {hasFilters
            ? "Try adjusting your search, category, or tag filters."
            : "Be the first to start a discussion."}
        </p>
      </div>
      {hasFilters ? (
        <Button
          type="button"
          id="discussions-clear-filters"
          size="lg"
          onClick={onReset}
          className="rounded-xl"
        >
          Clear all filters
        </Button>
      ) : (
        <AuthGatedLink
          href={createHref}
          className={cn(buttonVariants({ size: "lg" }), "rounded-xl")}
        >
          <Plus data-icon="inline-start" aria-hidden="true" />
          Start a post
        </AuthGatedLink>
      )}
    </motion.div>
  );
}
