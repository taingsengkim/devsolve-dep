import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";

import type { TeamCounts } from "@/components/teams/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TeamsPageHeaderProps = {
  counts: TeamCounts;
};

export function TeamsPageHeader({ counts }: TeamsPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            <ShieldCheck />
            Team access
          </Badge>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            {counts.active} active
          </Badge>
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            {counts.pending} pending
          </Badge>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Organization Members
          </h1>
          <p className="text-base font-medium text-slate-500">
            {counts.total} workspace members across manager, member, and viewer access levels.
          </p>
        </div>
      </div>

      <div className="flex self-start sm:self-auto">
        <Link
          href="/dashboard/teams/invite-member"
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-xl px-4 shadow-xs"
          )}
        >
          <Plus data-icon="inline-start" />
          Invite member
        </Link>
      </div>
    </header>
  );
}
