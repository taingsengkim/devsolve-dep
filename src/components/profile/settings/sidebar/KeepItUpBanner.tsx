import { TrendingUp } from "lucide-react";

interface KeepItUpBannerProps {
  percentile: number;
}

export default function KeepItUpBanner({ percentile }: KeepItUpBannerProps) {
  return (
    <div className="rounded-[18px] bg-[#10B981]/8 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]">
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#10B981]">
        <TrendingUp size={15} />
        Keep it up!
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[#171717]/70">
        You are in the top {percentile}% of hackers this month. Submit more reports to climb the leaderboard.
      </p>
    </div>
  );
}