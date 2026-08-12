"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Profile } from "@/lib/types/profile/types";

interface ProfileHeaderProps {
  profile: Profile;
  backHref?: string;
  isPublicView?: boolean;
}

/**
 * Utility bar at the top: optional back link on the left,
 * share button on the right.
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
        toast.success("Profile link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy profile link:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <ArrowLeft size={14} />
          Back to profile
        </Link>
      ) : (
        <div />
      )}

      <button
        type="button"
        id="profile-share-btn"
        onClick={handleShare}
        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        {copied ? (
          <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Share2 size={14} className="text-slate-500 dark:text-neutral-400" />
        )}
        <span>{copied ? "Copied!" : "Share Profile"}</span>
      </button>
    </div>
  );
}

