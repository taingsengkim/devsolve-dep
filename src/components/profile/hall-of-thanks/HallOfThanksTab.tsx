import { ThanksEntry } from "@/lib/types/profile/types";
import ThanksCard from "./ThanksCard";

interface HallOfThanksTabProps {
  entries: ThanksEntry[];
}

export default function HallOfThanksTab({ entries }: HallOfThanksTabProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500">
        No thank-you notes yet. Programs you&apos;ve helped will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <ThanksCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
