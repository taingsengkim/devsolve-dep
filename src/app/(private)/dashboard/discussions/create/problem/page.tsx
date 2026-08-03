"use client";

import React from "react";
import { motion } from "motion/react";
import { CreatePostHeader } from "@/components/discussions/create/CreatePostHeader";
import { CreateProblemForm } from "@/components/discussions/create/CreateProblemForm";

export default function DashboardCreateProblemPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <CreatePostHeader
        title="Create a Problem Post"
        subtitle="Report a security flaw, vulnerability, or technical blocker for community feedback."
        badgeColor="blue"
        backHref="/dashboard/discussions/create"
        currentType="problem"
      />
      <CreateProblemForm cancelHref="/dashboard/discussions" />
    </motion.div>
  );
}
