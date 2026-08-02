"use client";

import React from "react";
import { motion } from "motion/react";
import { CreatePostHeader } from "@/components/discussions/create/CreatePostHeader";
import { CreatePostSelection } from "@/components/discussions/create/CreatePostSelection";

export default function PublicCreatePostSelectionPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[100dvh] bg-[#F8FAFC]"
    >
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <CreatePostHeader
          title="Create a New Post"
          subtitle="Choose the type of discussion post you want to create."
        />
        <CreatePostSelection />
      </main>
    </motion.div>
  );
}
