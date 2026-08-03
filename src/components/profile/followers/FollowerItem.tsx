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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <User size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Follower</p>
          <p className="text-sm text-slate-400">#{record.id.slice(0, 8)}</p>
        </div>
      </div>

      <span className="text-sm text-slate-500">Since {formatFollowedSince(record.createdAt)}</span>
    </div>
  );
}
