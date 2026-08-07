// components/teams/invite-member/InviteMemberHeader.tsx

import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InviteMemberHeader() {
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-slate-200/80 pb-6 dark:border-slate-800 sm:flex-row sm:items-end">
      <div className="space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/dashboard"
            className="transition-colors hover:text-[#2563EB]"
          >
            Dashboard
          </Link>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          <Link
            href="/dashboard/team-management"
            className="transition-colors hover:text-[#2563EB]"
          >
            Team Management
          </Link>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          <span className="text-slate-900 dark:text-slate-100">
            Invite Member
          </span>
        </nav>

        <div className="flex items-start gap-4">
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400 sm:flex">
            <UserPlus className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Invite a New Member
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
              Add a trusted teammate to your organization and assign the
              appropriate role and permissions.
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/dashboard/team-management"
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "default",
          }),
          "h-11 shrink-0 rounded-xl border-slate-300 bg-white px-4 font-medium text-slate-700 shadow-none hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40",
        )}
      >
        <ArrowLeft className="size-4" />
        Back to members
      </Link>
    </header>
  );
}