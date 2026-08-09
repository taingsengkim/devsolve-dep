"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Share2 } from "lucide-react";
import { Profile } from "@/lib/types/profile/types";

interface ProfileHeaderProps {
  profile: Profile;
  backHref?: string;
}

/**
 * A slim utility bar at the top: breadcrumb nav on the left,
 * share button on the right. The profile name / avatar / bio live
 * in the sidebar (GitHub-style) rather than in the page header.
 */
export default function ProfileHeader({
  profile,
  backHref,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy profile link:", err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-slate-200"
        >
          <ArrowLeft size={14} />
          Back to profile
        </Link>
      ) : (
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
        >
          <Link
            href="/dashboard"
            className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          >
            Dashboard
          </Link>
          <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
          <Link
            href="/dashboard/profile"
            className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
          >
            Profile
          </Link>
          <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-900 dark:text-slate-200">
            @{profile.username}
          </span>
        </nav>
      )}

      <button
        type="button"
        id="profile-share-btn"
        onClick={handleShare}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {copied ? (
          <Check size={13} className="text-emerald-600" />
        ) : (
          <Share2 size={13} className="text-slate-500" />
        )}
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>
    </div>
  );
}
