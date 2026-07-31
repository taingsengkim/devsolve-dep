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
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Organization Members
        </h1>
        <p className="text-sm leading-6 text-slate-500">
          Access and invitation
        </p>
        <p className="text-sm leading-6 text-slate-400">
          {counts.total} members
        </p>
      </div>

      <Link
        href="/dashboard/teams/invite-member"
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-11 rounded-full bg-[#2563EB] px-5 text-sm text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        )}
      >
        <Plus data-icon="inline-start" />
        Invite member
      </Link>
    </header>
  );
}
