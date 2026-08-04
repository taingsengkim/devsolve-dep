"use client";

import React from "react";
import { ProgramItem } from "@/lib/types/programs/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink, ShieldCheck, DollarSign, Users, Award } from "lucide-react";
import Link from "next/link";

interface ProgramDetailsModalProps {
  program: ProgramItem | null;
  onClose: () => void;
}

export function ProgramDetailsModal({ program, onClose }: ProgramDetailsModalProps) {
  if (!program) return null;

  return (
    <Dialog open={!!program} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`size-12 rounded-xl ${program.logoBgColor || "bg-blue-600"} flex items-center justify-center text-white font-bold text-lg`}>
                {program.companyName.charAt(0)}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {program.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                  {program.companyName}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={program.type === "Bounty" ? "default" : "secondary"}>
                {program.type}
              </Badge>
              <Badge variant="outline">{program.status}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {program.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reward Range</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <DollarSign className="size-4" />
                {program.rewardRange}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Researchers</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Users className="size-4" />
                {program.researchersCount ?? program.activeResearchers ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Response</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Award className="size-4" />
                {program.stats?.responseTime || "N/A"}
              </p>
            </div>
          </div>

          {program.inScopeAssets && program.inScopeAssets.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">In-Scope Assets</h4>
              <div className="flex flex-wrap gap-2">
                {program.inScopeAssets.map((asset, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Link
              href={`/programs/${program.companySlug || program.id}`}
              className={cn(buttonVariants({ variant: "default" }), "gap-2")}
            >
              View Full Details <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
