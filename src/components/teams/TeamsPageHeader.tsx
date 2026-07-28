import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function TeamsPageHeader() {
  return (
    <header className="flex flex-col gap-4 rounded-4xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Team Access
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Organization Members
        </h1>
        <p className="text-base text-slate-500">
          Role, access, and invitation management for your organization.
        </p>
      </div>

      <Button className="rounded-full">
        <Plus data-icon="inline-start" />
        Invite member
      </Button>
    </header>
  );
}
