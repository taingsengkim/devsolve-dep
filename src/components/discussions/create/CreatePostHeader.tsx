"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Sparkles } from "lucide-react";

interface CreatePostHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: "blue" | "purple";
  backHref?: string;
  currentType?: "problem" | "showcase";
}

export function CreatePostHeader({
  title,
  subtitle = "Describe your problem or showcase to collaborate with the community.",
  badgeText,
  badgeColor = "blue",
  backHref = "/discussions",
  currentType = "problem",
}: CreatePostHeaderProps) {
  const isDashboard = backHref.startsWith("/dashboard");
  const problemHref = isDashboard ? "/dashboard/discussions/create/problem" : "/discussions/create/problem";
  const showcaseHref = isDashboard ? "/dashboard/discussions/create/showcase" : "/discussions/create/showcase";

  return (
    <div className="space-y-4">
      {/* Top Bar: Back Link + Format Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Discussions</span>
        </Link>

        {/* Format Switcher Pills */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 self-start sm:self-auto text-xs font-semibold">
          <Link
            href={problemHref}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentType === "problem"
                ? "bg-white text-blue-700 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Problem</span>
          </Link>
          <Link
            href={showcaseHref}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentType === "showcase"
                ? "bg-white text-purple-700 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Showcase</span>
          </Link>
        </div>
      </div>

      {/* Header title & subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {badgeText && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                  badgeColor === "purple"
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                <span className={`size-1.5 rounded-full ${badgeColor === "purple" ? "bg-purple-500 animate-pulse" : "bg-blue-500 animate-pulse"}`} />
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-base text-slate-600 leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

