"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Bug, Rocket, ArrowRight, Code2, Sparkles } from "lucide-react";

export function CreatePostSelection() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What would you like to share?
        </h1>
        <p className="text-base text-slate-700 max-w-lg mx-auto leading-relaxed">
          Select a post format to start sharing with the developer community.
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* 1. Problem Option */}
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/discussions/create/problem"
            className="group relative flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-md hover:border-blue-500 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Bug className="size-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  <Code2 className="size-3.5" />
                  <span>Bug & Vulnerability</span>
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Problem
              </h2>
              <p className="text-base text-slate-700 leading-relaxed mt-2">
                Report a security flaw, system bug, or technical blocker for the community to review and solve.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-base font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Create Problem Post</span>
              <ArrowRight className="size-5" />
            </div>
          </Link>
        </motion.div>

        {/* 2. Showcase Option */}
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/discussions/create/showcase"
            className="group relative flex flex-col justify-between h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-md hover:border-purple-500 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="size-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Rocket className="size-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-700 group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors">
                  <Sparkles className="size-3.5" />
                  <span>Project & Architecture</span>
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                Showcase
              </h2>
              <p className="text-base text-slate-700 leading-relaxed mt-2">
                Share your full-stack project, architecture diagrams, step-by-step implementation guide, or code.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-base font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Create Showcase Post</span>
              <ArrowRight className="size-5" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
