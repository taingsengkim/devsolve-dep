"use client";

import React from "react";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { CreateProblemForm } from "@/components/discussions/create/CreateProblemForm";

export default function DashboardCreateProblemPage() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
            >
              <Link
                href="/dashboard/discussions"
                className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
              >
                Posts
              </Link>
              <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
              <Link
                href="/dashboard/discussions/create"
                className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
              >
                New post
              </Link>
              <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
              <span
                aria-current="page"
                className="text-slate-900 dark:text-slate-200"
              >
                Problem
              </span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Create a problem
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Describe the issue, environment, and evidence so the community
              can help.
            </p>
          </div>
        </header>

        <CreateProblemForm
          successHref="/dashboard/my-community"
          cancelHref="/dashboard/discussions/create"
        />
      </motion.div>
    </MotionConfig>
  );
}
