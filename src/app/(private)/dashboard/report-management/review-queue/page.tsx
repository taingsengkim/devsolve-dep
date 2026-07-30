"use client";

import { motion } from "motion/react";

import { ReviewQueueHeader } from "@/components/report-management/review-queue/ReviewQueueHeader";
import { ReviewQueueLanes } from "@/components/report-management/review-queue/ReviewQueueLanes";
import { ReviewQueuePriorityList } from "@/components/report-management/review-queue/ReviewQueuePriorityList";

export default function Page() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <ReviewQueueHeader />
      <ReviewQueueLanes />
      <ReviewQueuePriorityList />
    </motion.section>
  );
}
