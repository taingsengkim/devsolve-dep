import { ProfileBadge } from "@/lib/types/profile/types";
import BadgeItem from "./BadgeItem";

interface BadgesGridProps {
  badges: ProfileBadge[];
}

export default function BadgesGrid({ badges }: BadgesGridProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Badges & Achievements</p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {badges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}