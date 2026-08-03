import { BarChart3 } from "lucide-react";
import { AccountStatus } from "@/lib/types/profile/types";

interface AccountStatusCardProps {
  status: AccountStatus;
}


export default function AccountStatusCard({ status }: AccountStatusCardProps) {
  const rows = [
    { label: "Member since", value: status.memberSince },
    { label: "Total submissions", value: status.totalSubmissions },
    { label: "Accepted reports", value: status.acceptedReports },
    { label: "Reputation points", value: status.reputationPoints.toLocaleString() },

  
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-5">
      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <BarChart3 size={13} />
        Account status
      </p>

      <div className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{row.label}</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${status.acceptanceRate}%` }} />
      </div>
      <p className="mt-1.5 text-sm text-slate-500">{status.acceptanceRate}% acceptance rate</p>
    </div>
  );
}
