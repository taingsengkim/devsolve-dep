"use client";

import React from "react";
import { motion } from "motion/react";
import { CreatePostHeader } from "@/components/discussions/create/CreatePostHeader";
import { CreateProblemForm } from "@/components/discussions/create/CreateProblemForm";

export default function PublicCreateProblemPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[100dvh] bg-[#F8FAFC]"
    >
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <CreatePostHeader
          title="Create a Problem Post"
          subtitle="Report a security flaw, vulnerability, or technical blocker for community feedback."
          badgeText="Problem / Bug"
          badgeColor="blue"
          backHref="/discussions/create"
        />
        <CreateProblemForm />
      </main>
    </motion.div>
  );
}
