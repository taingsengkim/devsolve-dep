"use client";

import { useState } from "react";
import { ArrowLeft, Check, MapPin, Settings, Share2 } from "lucide-react";
import Link from "next/link";
import { Profile } from "@/lib/types/profile/types";
import FollowButton from "@/components/profile/FollowButton";

interface ProfileHeaderProps {
  profile: Profile;
  backHref?: string;
}

export default function ProfileHeader({ profile, backHref }: ProfileHeaderProps) {
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
    <div className="space-y-4">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft size={14} />
          Back to profile
        </Link>
      )}

      {/* Name, Location & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {profile.displayName}
            </h1>
            {profile.location && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <MapPin size={15} className="text-slate-500 dark:text-slate-400" />
                {profile.location}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FollowButton />

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-200/80 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} className="text-slate-500" />}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>

          {profile.isOwnProfile && (
            <Link
              href="/dashboard/profile/settings"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer border border-blue-100 shadow-2xs"
            >
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}