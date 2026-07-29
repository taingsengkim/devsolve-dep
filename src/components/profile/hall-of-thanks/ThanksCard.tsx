import Image from "next/image";
import { ThanksEntry } from "@/lib/types/profile/types";

interface ThanksCardProps {
  entry: ThanksEntry;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ThanksCard({ entry }: ThanksCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {entry.orgLogoUrl ? (
          <Image src={entry.orgLogoUrl} alt={entry.orgName} width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {entry.orgName.charAt(0)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{entry.orgName}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{entry.message}</p>
          <p className="mt-2 text-xs text-slate-400">{formatDate(entry.date)}</p>
        </div>
      </div>
    </div>
  );
}