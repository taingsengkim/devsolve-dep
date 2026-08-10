"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  FileCheck,
  Users,
  PanelsTopLeft,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuickModule {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const QUICK_MODULES: QuickModule[] = [
  {
    href: "/dashboard/company-verification",
    label: "Company Verifications",
    Icon: Building2,
  },
  {
    href: "/dashboard/report-confirmation",
    label: "Report Confirmation",
    Icon: FileCheck,
  },
  {
    href: "/dashboard/users",
    label: "User Management",
    Icon: Users,
  },
  {
    href: "/dashboard/content-moderation",
    label: "Content Management",
    Icon: PanelsTopLeft,
  },
];

export function AdminQuickModules() {
  return (
    <Card className="gap-4 rounded-2xl border border-slate-200/70 bg-white py-5 shadow-2xs lg:col-span-5 dark:border-neutral-800 dark:bg-neutral-900">
      <CardHeader className="px-5">
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-neutral-100">
          Quick admin modules
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-neutral-400">
          Direct access to administrative platform suites
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2.5 px-5">
        {QUICK_MODULES.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-neutral-800 dark:bg-neutral-950/60 dark:hover:bg-neutral-800"
          >
            <div className="flex items-center gap-3">
              <Icon className="size-4 text-slate-500 transition-colors group-hover:text-slate-800 dark:text-neutral-500 dark:group-hover:text-neutral-200" />
              <span className="text-sm font-semibold text-slate-800 dark:text-neutral-200">
                {label}
              </span>
            </div>
            <ArrowUpRight className="size-3.5 text-slate-400 transition-colors group-hover:text-slate-700 dark:text-neutral-500 dark:group-hover:text-neutral-200" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
