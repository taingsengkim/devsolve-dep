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
    <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Organization Members
          </h1>
          <p className="mt-1.5 max-w-3xl text-base font-normal text-slate-600">
            Manage teammate access, pending invitations, and workspace roles with a
            cleaner member directory inspired by the program marketplace layout.
          </p>
        </div>
      </div>

      <div className="flex self-start md:self-auto">
        <Link
          href="/dashboard/teams/invite-member"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-11 rounded-xl px-4 shadow-xs"
          )}
        >
          <Plus data-icon="inline-start" />
          Invite member
        </Link>
      </div>
    </header>
  );
}
