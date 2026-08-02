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
    <div className="space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-600 font-medium">
        <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Discussions</span>
      </nav>

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Discussions
          </h1>
          <p className="text-base text-slate-700 max-w-xl leading-relaxed">
            Browse problems, share showcases, and collaborate with the security community.
          </p>
        </div>

        {/* Add Post CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/discussions/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-base font-bold text-white shadow-md transition-colors shrink-0"
          >
            <Plus className="size-5 stroke-[2.5]" />
            Add Post
          </Link>
        </motion.div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          id="discussions-search"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search problems, tags, keywords..."
          className="w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-14 py-3.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-xs transition-shadow"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-slate-600 font-bold bg-slate-100 border border-slate-200 rounded-md px-2 py-1 font-mono pointer-events-none">
          <Command className="size-3.5" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
}
