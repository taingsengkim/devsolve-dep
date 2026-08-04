"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";

import { PRIORITY_REVIEW_ITEMS } from "@/components/report-management/review-queue/mock-data";
import { ReviewQueueHeader } from "@/components/report-management/review-queue/ReviewQueueHeader";
import { ReviewQueueLanes } from "@/components/report-management/review-queue/ReviewQueueLanes";
import { ReviewQueuePriorityList } from "@/components/report-management/review-queue/ReviewQueuePriorityList";
import type {
  ReviewQueueLaneFilter,
  ReviewSeverity,
} from "@/components/report-management/review-queue/types";

export default function Page() {
  const [activeQueue, setActiveQueue] = useState<ReviewQueueLaneFilter>("All");
  const [severityFilter, setSeverityFilter] = useState<"All" | ReviewSeverity>("All");
  const [sortBy, setSortBy] = useState<"priority" | "recent">("priority");

  const queueCounts = useMemo(() => {
    return {
      all: PRIORITY_REVIEW_ITEMS.length,
      pending: PRIORITY_REVIEW_ITEMS.filter((item) => item.queue === "Pending Intake").length,
      review: PRIORITY_REVIEW_ITEMS.filter((item) => item.queue === "Under Review").length,
      ready: PRIORITY_REVIEW_ITEMS.filter((item) => item.queue === "Approval Ready").length,
    };
  }, []);

  const filteredItems = useMemo(() => {
    const filtered = PRIORITY_REVIEW_ITEMS.filter((item) => {
      const matchesQueue = activeQueue === "All" || item.queue === activeQueue;
      const matchesSeverity = severityFilter === "All" || item.severity === severityFilter;
      return matchesQueue && matchesSeverity;
    });

    const severityRank: Record<ReviewSeverity, number> = {
      Critical: 0,
      High: 1,
      Medium: 2,
      Low: 3,
    };

    return [...filtered].sort((a, b) => {
      if (sortBy === "priority") {
        return severityRank[a.severity] - severityRank[b.severity] || b.id - a.id;
      }

      return b.id - a.id;
    });
  }, [activeQueue, severityFilter, sortBy]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-[1360px] flex-col gap-5 pb-12"
    >
      <ReviewQueueHeader />
      <ReviewQueueLanes
        activeQueue={activeQueue}
        onQueueChange={setActiveQueue}
      />
      <ReviewQueuePriorityList
        activeQueue={activeQueue}
        onQueueChange={setActiveQueue}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        queueCounts={queueCounts}
        items={filteredItems}
      />
    </motion.section>
  );
}
