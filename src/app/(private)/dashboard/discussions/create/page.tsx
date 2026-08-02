"use client";

import React from "react";
import { motion } from "motion/react";
import { CreatePostSelection } from "@/components/discussions/create/CreatePostSelection";

export default function DashboardCreatePostSelectionPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <CreatePostSelection
        basePath="/dashboard/discussions/create"
        backHref="/dashboard/discussions"
      />
    </motion.div>
  );
}

