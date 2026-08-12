"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CreateProgramHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link
            href="/dashboard/program-management"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Program Management
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">
            Create New Program
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Create New Program
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure and launch a new security bug bounty or vulnerability disclosure program for your organization.
        </p>
      </div>
    </header>
  );
}
