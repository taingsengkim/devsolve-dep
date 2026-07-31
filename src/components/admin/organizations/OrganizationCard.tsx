"use client";

import React from "react";
import { CompanyVerificationItem } from "@/lib/redux/services/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Globe, FileText, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import Link from "next/link";

interface OrganizationCardProps {
  item: CompanyVerificationItem;
  onSelect?: (item: CompanyVerificationItem) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ item, onSelect }) => {
  const getStatusBadge = () => {
    switch (item.status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 rounded-full px-2.5 py-0.5 text-xs font-bold">
            Approved & Verified
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800 rounded-full px-2.5 py-0.5 text-xs font-bold">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-0.5 text-xs font-bold">
            Pending Audit
          </Badge>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-xs transition duration-200 group">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
              <Building2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.companyName}
                </h3>
                {getStatusBadge()}
                <Badge variant="outline" className="text-[11px] font-medium rounded-md px-2 py-0.5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  {item.businessType}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {item.domain}
                </span>
                <span>•</span>
                <span className="font-mono">Tax ID: {item.taxId}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  {item.documentsCount} Docs Uploaded
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {item.registrationDate}
                </span>
              </div>

              {item.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-1 mt-1 w-fit max-w-full">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Notes: </span>
                  {item.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <Link href={`/dashboard/company-verification/${item.id}`}>
              <Button
                variant="outline"
                className="h-9 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer shadow-2xs gap-1.5"
              >
                Review KYC Details
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
