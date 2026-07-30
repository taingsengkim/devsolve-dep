"use client";

import React from "react";
import Link from "next/link";
import {
  Bug,
  Rocket,
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  ArrowRight,
  Code2,
  Sparkles,
} from "lucide-react";

export default function CreatePostSelectionPage() {
  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Main Content (Centered & Compact) */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Title Header */}
        <div className="max-w-3xl w-full text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What would you like to share?
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Select a post format to start sharing with the developer community.
          </p>
        </div>

        {/* Compact Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl w-full">
          {/* 1. Problem Option */}
          <Link
            href="/dashboard/discussions/create/problem"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-500/80 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Bug className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center space-x-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                  <Code2 className="h-3 w-3" />
                  <span>Bug & Vulnerability</span>
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Problem
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Report a security flaw, system bug, or technical blocker for the community to review and solve.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Create Problem Post</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* 2. Showcase Option */}
          <Link
            href="/dashboard/discussions/create/showcase"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-purple-500/80 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Rocket className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center space-x-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors">
                  <Sparkles className="h-3 w-3" />
                  <span>Project & Architecture</span>
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Showcase
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                Share your full-stack project, architecture diagrams, step-by-step implementation guide, or code.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Create Showcase Post</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/dashboard/discussions"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel or Back to community</span>
          </Link>
        </div>
      </main>
    </div>
  );
}