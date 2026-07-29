import Image from "next/image";
import { Users, FileText } from "lucide-react";
import { FollowedHacker } from "@/lib/types/profile/types";

interface FollowingItemProps {
  hacker: FollowedHacker;
}

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}

export default function FollowingItem({ hacker }: FollowingItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {hacker.avatarUrl ? (
          <Image src={hacker.avatarUrl} alt={hacker.displayName} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
            {hacker.displayName.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{hacker.displayName}</p>
          <p className="text-sm text-slate-400">{hacker.handle}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} />
          {formatCount(hacker.followers)} followers
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileText size={14} />
          {hacker.reports} reports
        </span>
      </div>
    </div>
  );
}