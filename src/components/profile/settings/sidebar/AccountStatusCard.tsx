import { BarChart3 } from "lucide-react";
import { AccountStatus } from "@/lib/types/profile/types";
import { card, sectionLabel } from "../styles";

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
    <div className={`${card} p-5`}>
      <p className={`inline-flex items-center gap-1.5 ${sectionLabel}`}>
        <BarChart3 size={13} />
        Account status
      </p>

      <div className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-[#4d4d4d]">{row.label}</span>
            <span className="font-semibold text-[#171717]">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 w-full rounded-full bg-[#ebebeb]">
        <div className="h-1.5 rounded-full bg-[#2563EB]" style={{ width: `${status.acceptanceRate}%` }} />
      </div>
      <p className="mt-1.5 text-sm text-[#4d4d4d]">{status.acceptanceRate}% acceptance rate</p>
    </div>
  );
}