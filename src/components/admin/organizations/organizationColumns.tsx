"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CompanyVerificationItem } from "@/lib/types/admin/types";
import { StatusBadge } from "./statusUtils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  Mail,
  User,
  Calendar,
  ArrowUpDown,
  Eye,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface ColumnCallbacks {
  onQuickAudit?: (company: CompanyVerificationItem) => void;
}

export function getOrganizationColumns({
  onQuickAudit,
}: ColumnCallbacks = {}): ColumnDef<CompanyVerificationItem>[] {
  return [
    {
      accessorKey: "companyName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Company
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const initial = item.companyName?.charAt(0)?.toUpperCase() || "C";
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 dark:border-blue-900/50">
              {initial}
            </div>
            <div className="min-w-0">
              <Link
                href={`/dashboard/company-verification/${item.id}`}
                className="font-bold text-slate-900 dark:text-slate-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
              >
                {item.companyName}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                {item.domain && (
                  <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                    <Globe className="w-3 h-3 text-slate-400" />
                    {item.domain.replace(/^https?:\/\//, "")}
                  </span>
                )}
                {item.domain && item.orgCode && <span>•</span>}
                {item.orgCode && (
                  <span className="font-mono text-slate-400 dark:text-slate-500 text-[11px]">
                    {item.orgCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "contactName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Contact / Owner
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-100 text-sm">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.contactName || "—"}</span>
            </div>
            {item.email && (
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Mail className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[180px]">{item.email}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "industry",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Industry & Size
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const industry = item.industry || item.businessType || "Technology";
        return (
          <div className="space-y-1">
            <Badge
              variant="outline"
              className="text-xs font-semibold rounded-lg px-2 py-0.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60"
            >
              {industry}
            </Badge>
            {item.companySize && (
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.companySize} employees
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Status
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "registrationDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-xs uppercase tracking-wider"
        >
          Submitted
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateVal = row.original.submittedAt || row.original.registrationDate;
        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateVal || "—"}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            {onQuickAudit && (item.status === "PENDING" || item.status === "UNDER_REVIEW") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuickAudit(item)}
                className="h-8 px-2.5 rounded-xl text-xs font-semibold border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer gap-1 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Audit
              </Button>
            )}

            <Link
              href={`/dashboard/company-verification/${item.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "h-8 px-3 rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer gap-1 shadow-2xs inline-flex items-center justify-center",
              })}
            >
              <Eye className="w-3.5 h-3.5" />
              Details
              <ChevronRight className="w-3 h-3 text-slate-400 ml-0.5" />
            </Link>
          </div>
        );
      },
    },
  ];
}
