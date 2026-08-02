"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, Plus, Command } from "lucide-react";
import Link from "next/link";

interface DiscussionHeaderProps {
  searchQuery: string;
  onSearch: (v: string) => void;
}

export function DiscussionHeader({ searchQuery, onSearch }: DiscussionHeaderProps) {
  return (
    <div className="space-y-6">
      {/* ── Standard Page Header ────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Discussions</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Discussions
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Browse problems, share showcase projects, and collaborate with the developer community.
          </p>
        </div>

        {/* Add Post CTA Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/discussions/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-base font-bold text-white shadow-md transition-colors shrink-0"
          >
            <Plus className="size-5 stroke-[2.5]" />
            Add Post
          </Link>
        </motion.div>
      </header>

      {/* ── Search Bar ──────────────────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          id="discussions-search"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search problems, tags, keywords..."
          className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 pl-12 pr-14 py-3.5 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-xs transition-shadow"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-mono pointer-events-none">
          <Command className="size-3.5" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
}
