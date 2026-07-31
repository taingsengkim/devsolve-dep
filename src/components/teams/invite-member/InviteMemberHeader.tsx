import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InviteMemberHeader() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-slate-400">
          <span>Team Management</span>
          <span className="mx-2 text-slate-300">{">"}</span>
          <span className="text-slate-600">Invite Member</span>
        </p>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Invite a New Member
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            Invite a teammate and assign the appropriate organization role.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/teams"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-10 rounded-2xl border-slate-300 bg-white px-4 font-medium text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:border-blue-200 hover:bg-white"
        )}
      >
        <ArrowLeft data-icon="inline-start" />
        Back to members
      </Link>
    </header>
  );
}
