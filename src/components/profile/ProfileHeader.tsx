"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Profile } from "@/lib/types/profile/types";

interface ProfileHeaderProps {
  profile: Profile;
  backHref?: string;
  isPublicView?: boolean;
}

/**
 * Utility bar at the top of a profile: a back link, and nothing else.
 *
 * Pages that don't pass one render nothing rather than an empty row.
 */
export default function ProfileHeader({ backHref }: ProfileHeaderProps) {
  if (!backHref) return null;

  return (
    <div className="flex items-center gap-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to profile
      </Link>
    </div>
  );
}
