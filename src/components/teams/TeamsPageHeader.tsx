import Link from "next/link";
import { Plus } from "lucide-react";

import type { TeamCounts } from "@/components/teams/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TeamsPageHeaderProps = {
  counts: TeamCounts;
};

export function TeamsPageHeader({ counts }: TeamsPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Team Management
        </h1>
        <p className="text-base font-medium text-slate-500">
          {counts.active} active members across {counts.managers} managers and {counts.members} collaborators
        </p>
        <p className="text-sm text-slate-400">
          {counts.total} total members in this workspace
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/dashboard/teams/invite-member"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Plus data-icon="inline-start" />
          Invite Member
        </Link>
      </div>
    </header>
  );
}
