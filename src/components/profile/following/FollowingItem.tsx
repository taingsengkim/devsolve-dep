import { Building2, Hash, User } from "lucide-react";
import { FollowRecord } from "@/lib/types/profile/types";

interface FollowingItemProps {
  record: FollowRecord;
}

const TYPE_ICON: Record<string, typeof User> = {
  USER: User,
  ORGANIZATION: Building2,
};

function formatFollowedSince(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// The backend only returns the raw follow relationship (type + target id) —
// there's no per-type lookup endpoint yet to resolve a display name or avatar
// for the followed user/org/topic.
export default function FollowingItem({ record }: FollowingItemProps) {
  const Icon = TYPE_ICON[record.followableType] ?? Hash;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-bold capitalize text-slate-900 dark:text-slate-100">{record.followableType.toLowerCase()}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{record.followableId}</p>
        </div>
      </div>

      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Followed {formatFollowedSince(record.createdAt)}</span>
    </div>
  );
}
