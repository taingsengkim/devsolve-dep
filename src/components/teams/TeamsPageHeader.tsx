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
    <header className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Team Management
        </h1>
        <p className="text-base sm:text-lg font-medium text-muted-foreground leading-relaxed">
          {counts.active} active members across {counts.managers} managers and {counts.members} collaborators
        </p>
        <p className="text-sm text-muted-foreground/80">
          {counts.total} total members in this workspace
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/dashboard/team-management/invite"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 rounded-xl border-border bg-card px-4 text-sm font-semibold text-foreground shadow-xs hover:bg-muted cursor-pointer"
          )}
        >
          <Plus data-icon="inline-start" />
          Invite Member
        </Link>
      </div>
    </header>
  );
}
