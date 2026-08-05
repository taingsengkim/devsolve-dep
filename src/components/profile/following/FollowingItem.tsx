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

export default function FollowingItem({ record }: FollowingItemProps) {
  const Icon = TYPE_ICON[record.followableType] ?? Hash;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold capitalize text-slate-900">{record.followableType.toLowerCase()}</p>
          <p className="text-sm text-slate-400">{record.followableId}</p>
        </div>
      </div>

      <span className="text-sm text-slate-500">Followed {formatFollowedSince(record.createdAt)}</span>
    </div>
  );
}
