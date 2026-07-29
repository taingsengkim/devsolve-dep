import { Award, CheckCircle2, RotateCw, TrendingUp } from "lucide-react";
import { HacktivityEntry, Severity } from "@/lib/types/profile/types";

interface HacktivityItemProps {
  entry: HacktivityEntry;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "text-red-500",
  high: "text-orange-500",
  medium: "text-amber-500",
  low: "text-blue-500",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Icon({ entry }: { entry: HacktivityEntry }) {
  const wrapper = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full";
  switch (entry.type) {
    case "resolved":
      return (
        <div className={`${wrapper} bg-emerald-50`}>
          <CheckCircle2 size={16} className="text-emerald-600" />
        </div>
      );
    case "badge":
      return (
        <div className={`${wrapper} bg-amber-50`}>
          <Award size={16} className="text-amber-500" />
        </div>
      );
    case "rank":
      return (
        <div className={`${wrapper} bg-blue-50`}>
          <TrendingUp size={16} className="text-blue-600" />
        </div>
      );
    case "retest":
      return (
        <div className={`${wrapper} bg-indigo-50`}>
          <RotateCw size={16} className="text-indigo-500" />
        </div>
      );
  }
}

function Description({ entry }: { entry: HacktivityEntry }) {
  if (entry.type === "resolved") {
    return (
      <p className="text-sm text-slate-700">
        <span className="font-medium">{entry.actorHandle}</span> resolved a{" "}
        <span className={`font-medium ${entry.severity ? SEVERITY_COLOR[entry.severity] : ""}`}>
          {entry.severity && entry.severity[0].toUpperCase() + entry.severity.slice(1)}
        </span>{" "}
        bug for <span className="font-semibold text-slate-900">{entry.program}</span>
      </p>
    );
  }
  if (entry.type === "badge") {
    return (
      <p className="text-sm text-slate-700">
        <span className="font-medium">{entry.actorHandle}</span> earned the badge{" "}
        <span className="ml-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
          {entry.badgeName}
        </span>
      </p>
    );
  }
  if (entry.type === "rank") {
    return (
      <p className="text-sm text-slate-700">
        <span className="font-medium">{entry.actorHandle}</span> climbed to{" "}
        <span className="font-semibold text-blue-600">{entry.rankLabel}</span>
      </p>
    );
  }
  return (
    <p className="text-sm text-slate-700">
      <span className="font-medium">{entry.actorHandle}</span> completed a retest for{" "}
      <span className="font-semibold text-slate-900">{entry.program}</span>
    </p>
  );
}

export default function HacktivityItem({ entry }: HacktivityItemProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="flex items-start gap-3">
        <Icon entry={entry} />
        <div>
          <Description entry={entry} />
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">{formatDate(entry.date)}</p>
        </div>
      </div>

      {entry.bounty ? <span className="shrink-0 text-sm font-semibold text-emerald-600">${entry.bounty.toLocaleString()}</span> : null}
    </div>
  );
}