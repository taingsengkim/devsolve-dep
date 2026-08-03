import { HacktivityEntry } from "@/lib/types/profile/types";
import HacktivityItem from "./HacktivityItem";

interface HacktivityTabProps {
  entries: HacktivityEntry[];
}

export default function HacktivityTab({ entries }: HacktivityTabProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-400">
        No activity yet. Resolved reports, badges, and rank changes will show up here.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white px-5 shadow-2xs">
      {entries.map((entry) => (
        <HacktivityItem key={entry.id} entry={entry} />
      ))}
    </div>
  );
}