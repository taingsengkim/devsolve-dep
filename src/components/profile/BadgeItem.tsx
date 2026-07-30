import { Activity, Crown, Lock, Shield, Star, Target, Trophy, Zap, LucideIcon } from "lucide-react";
import { ProfileBadge } from "@/lib/types/profile/types";

const ICON_MAP: Record<ProfileBadge["icon"], LucideIcon> = {
  trophy: Trophy,
  shield: Shield,
  zap: Zap,
  activity: Activity,
  star: Star,
  target: Target,
  crown: Crown,
  check: Shield,
};

interface BadgeItemProps {
  badge: ProfileBadge;
}

export default function BadgeItem({ badge }: BadgeItemProps) {
  const Icon = ICON_MAP[badge.icon];

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${
        badge.locked ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${
          badge.locked ? "bg-slate-200 text-slate-400" : "bg-blue-50 text-blue-600"
        }`}
      >
        {badge.locked ? <Lock size={16} /> : <Icon size={18} />}
      </div>
      <div>
        <p className={`text-sm font-medium ${badge.locked ? "text-slate-400" : "text-slate-800"}`}>{badge.label}</p>
        {badge.locked && <p className="text-xs text-slate-400">Locked</p>}
      </div>
    </div>
  );
}