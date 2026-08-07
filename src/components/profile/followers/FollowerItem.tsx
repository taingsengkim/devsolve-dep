import { User } from "lucide-react";
import { FollowRecord } from "@/lib/types/profile/types";

interface FollowerItemProps {
  record: FollowRecord;
}

function formatFollowedSince(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// The backend's follow record has no follower user id or display name — only
// the relationship id and when it was created — since there's no per-user
// lookup endpoint yet to resolve who this is.
export default function FollowerItem({ record }: FollowerItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
          <User size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Follower</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">#{record.id.slice(0, 8)}</p>
        </div>
      </div>

      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Since {formatFollowedSince(record.createdAt)}</span>
    </div>
  );
}
