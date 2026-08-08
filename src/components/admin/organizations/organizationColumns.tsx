"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {
  ArrowUpDown,
  Calendar,
  ChevronRight,
  Eye,
  Globe,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { CompanyVerificationItem } from "@/lib/types/admin/types";

import { StatusBadge } from "./statusUtils";

interface ColumnCallbacks {
  onQuickAudit?: (company: CompanyVerificationItem) => void;
}

const sortableHeaderClassName =
  "px-0 text-sm font-semibold text-slate-700 hover:bg-transparent dark:text-slate-300";

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
          className={sortableHeaderClassName}
        >
          Company
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const initial = item.companyName?.charAt(0)?.toUpperCase() || "C";

        return (
          <div className="flex items-center gap-3 py-1">
            <Avatar size="lg">
              {item.logoUrl && (
                <AvatarImage src={item.logoUrl} alt={`${item.companyName} logo`} />
              )}
              <AvatarFallback className="font-semibold text-slate-700 dark:text-slate-300">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <Link
                href={`/dashboard/company-verification/${item.id}`}
                className="block truncate text-sm font-semibold text-slate-900 underline-offset-4 transition-colors hover:text-slate-600 hover:underline dark:text-slate-100 dark:hover:text-slate-300"
              >
                {item.companyName}
              </Link>
              <div className="flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400">
                {item.domain && (
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Globe className="size-3.5 text-slate-400" />
                    {item.domain.replace(/^https?:\/\//, "")}
                  </span>
                )}
                {item.domain && item.orgCode && <span aria-hidden="true">•</span>}
                {item.orgCode && (
                  <span className="font-mono text-slate-500 dark:text-slate-400">
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
          className={sortableHeaderClassName}
        >
          Contact / Owner
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">
              <User className="size-4 text-slate-400" />
              <span>{item.contactName || "—"}</span>
            </div>
            {item.email && (
              <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="size-3.5 text-slate-400" />
                <span className="max-w-[180px] truncate">{item.email}</span>
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
          className={sortableHeaderClassName}
        >
          Industry & Size
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        const industry = item.industry || item.businessType || "Technology";

        return (
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="rounded-lg text-sm font-medium">
              {industry}
            </Badge>
            {item.companySize && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
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
          className={sortableHeaderClassName}
        >
          Status
          <ArrowUpDown data-icon="inline-end" />
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
          className={sortableHeaderClassName}
        >
          Submitted
          <ArrowUpDown data-icon="inline-end" />
        </Button>
      ),
      cell: ({ row }) => {
        const dateValue = row.original.submittedAt || row.original.registrationDate;

        return (
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Calendar className="size-4 text-slate-400" />
            <span>{dateValue || "—"}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            {onQuickAudit &&
              (item.status === "PENDING" || item.status === "UNDER_REVIEW") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickAudit(item)}
                  className="rounded-lg text-sm font-medium"
                >
                  <ShieldCheck data-icon="inline-start" />
                  Audit
                </Button>
              )}

            <Link
              href={`/dashboard/company-verification/${item.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "rounded-lg text-sm font-medium",
              })}
            >
              <Eye data-icon="inline-start" />
              Details
              <ChevronRight data-icon="inline-end" className="text-slate-400" />
            </Link>
          </div>
        );
      },
    },
  ];
}
