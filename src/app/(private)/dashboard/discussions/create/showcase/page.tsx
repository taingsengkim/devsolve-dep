"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { CreateShowcaseForm } from "@/components/showcases/create/CreateShowcaseForm";

export default function DashboardCreateShowcasePage() {
  return (
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
            <ChevronRight className="size-3.5 text-slate-300" />
            <Link
              href="/dashboard/discussions/create"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              New post
            </Link>
            <ChevronRight className="size-3.5 text-slate-300" />
            <span className="text-slate-900 dark:text-slate-200">Showcase</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create a showcase
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Publish a project with the build guide that made it work.
          </p>
        </div>
      </header>

      <CreateShowcaseForm
        successHref="/dashboard/discussions"
        cancelHref="/dashboard/discussions/create"
      />
    </motion.div>
  );
}
