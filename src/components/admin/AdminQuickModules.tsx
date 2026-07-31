"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  FileCheck,
  Users,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuickModule {
  href: string;
  label: string;
  Icon: LucideIcon;
  iconColor: string;
}

const QUICK_MODULES: QuickModule[] = [
  {
    href: "/dashboard/company-verification",
    label: "Company Verifications",
    Icon: Building2,
    iconColor: "text-blue-600",
  },
  {
    href: "/dashboard/report-confirmation",
    label: "Report Confirmation",
    Icon: FileCheck,
    iconColor: "text-emerald-600",
  },
  {
    href: "/dashboard/users",
    label: "User Management",
    Icon: Users,
    iconColor: "text-purple-600",
  },
  {
    href: "/dashboard/community-moderation",
    label: "Community Moderation",
    Icon: MessageSquare,
    iconColor: "text-amber-600",
  },
];

export function AdminQuickModules() {
  return (
    <Card className="lg:col-span-5 rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Quick Admin Modules
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Direct access to administrative platform suites
        </p>

        <div className="space-y-2.5">
          {QUICK_MODULES.map(({ href, label, Icon, iconColor }) => (
            <Link key={href} href={href} className="block">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition group cursor-pointer">
                <div className="flex items-center gap-3">
                  <Icon className={`size-4 ${iconColor}`} />
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                    {label}
                  </span>
                </div>
                <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}
