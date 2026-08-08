"use client";

import React from "react";
import { motion } from "motion/react";
import { RequireAuth } from "@/components/auth/RequireAuth";
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
          subtitle="Describe the issue, environment, and error logs to get help from researchers."
          backHref="/community/create"
          currentType="problem"
        />
        {/* Covers the routes into this page that skip the gated link — a
            pasted URL, a bookmark, back/forward. */}
        <RequireAuth
          title="Sign in to post a problem"
          description="Posting a problem needs an account, so answers reach you and the thread stays attached to your profile. It only takes a moment."
        >
          <CreateProblemForm cancelHref="/problems" />
        </RequireAuth>
      </main>
    </motion.div>
  );
}

