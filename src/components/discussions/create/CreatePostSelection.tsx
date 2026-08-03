"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Plus, ArrowUpRight, X } from "lucide-react";

interface CreatePostSelectionProps {
  basePath?: string;
  backHref?: string;
}

export function CreatePostSelection({
  basePath = "/discussions/create",
  backHref = "/discussions",
}: CreatePostSelectionProps) {
  return (
    <div className="relative w-full rounded-3xl border border-slate-200/80 bg-slate-100/70 p-6 sm:p-8 lg:p-10 pb-6 sm:pb-8 lg:pb-60 shadow-xs transition-all">
      {/* Top Right Exit Button */}
      <Link
        href={backHref}
        className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
        aria-label="Back to discussions"
      >
        <X className="size-5" />
      </Link>

      {/* Header Title */}
      <div className="text-center space-y-2 pt-8 sm:pt-14 pb-10 sm:pb-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Create a new discussion
        </h1>
        <p className="text-base text-slate-500 font-medium">
          Select a format to start sharing with the community.
        </p>
      </div>

      {/* Option Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Problem Option */}
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}>
          <Link
            href={`${basePath}/problem`}
            className="group flex flex-col justify-between h-48 sm:h-52 rounded-2xl bg-white p-6 sm:p-7 shadow-2xs border border-slate-200/70 hover:border-blue-500/50 hover:shadow-md transition-all duration-200"
          >
            <div className="text-slate-900 group-hover:text-blue-600 transition-colors">
              <Plus className="size-7 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Problem & Bug
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Report a security flaw, system bug, or technical blocker.
              </p>
            </div>
          </Link>
        </motion.div>

        {/* 2. Showcase Option */}
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}>
          <Link
            href={`${basePath}/showcase`}
            className="group flex flex-col justify-between h-48 sm:h-52 rounded-2xl bg-white p-6 sm:p-7 shadow-2xs border border-slate-200/70 hover:border-purple-500/50 hover:shadow-md transition-all duration-200"
          >
            <div className="text-slate-900 group-hover:text-purple-600 transition-colors">
              <ArrowUpRight className="size-7 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Showcase Project
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Share your full-stack project, architecture diagrams, or guides.
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

