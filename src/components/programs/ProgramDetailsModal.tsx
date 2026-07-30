"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { ProgramItem } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProgramDetailsModalProps {
  program: ProgramItem | null;
  onClose: () => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  program,
  onClose,
}) => {
  if (!program) return null;

  const isBounty = program.type === "Bounty";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="flex items-start justify-between p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
            <div className="flex items-center gap-4">
              {program.logoUrl ? (
                <Image
                  src={program.logoUrl}
                  alt={program.companyName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-2xl object-contain bg-white p-2 shadow-md shrink-0"
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center font-bold text-3xl text-white shadow-md shrink-0 ${
                    program.logoBgColor || "bg-blue-600"
                  }`}
                >
                  {program.companyName.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-xl font-bold tracking-tight">{program.companyName}</h2>
                  <Badge
                    variant="outline"
                    className="bg-slate-800 text-slate-300 border-slate-700 font-medium text-xs"
                  >
                    {program.type}
                  </Badge>
                  <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                    <span className="inline-block w-2 h-2 rounded-full bg-slate-400" />
                    {program.status}
                  </span>
                  {program.isPrivate && (
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200 gap-1">
                      <Lock className="w-3 h-3" /> Private
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-200">{program.title}</h3>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Program Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                Program Overview
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">{program.description}</p>
            </div>

            {/* Reward & Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Reward Range</span>
                <span
                  className={`text-base font-bold ${
                    isBounty ? "text-emerald-600" : "text-indigo-600"
                  }`}
                >
                  {program.rewardRange}
                </span>
              </div>
              {program.stats?.responseTime && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Avg Response Time</span>
                  <span className="text-base font-bold text-slate-800">
                    {program.stats.responseTime}
                  </span>
                </div>
              )}
              {program.stats?.reportsSubmitted && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">Reports Submitted</span>
                  <span className="text-base font-bold text-slate-800">
                    {program.stats.reportsSubmitted}
                  </span>
                </div>
              )}
            </div>

            {/* In-Scope Assets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  In-Scope Assets ({program.inScopeAssets.length})
                </h4>
                <div className="flex items-center gap-1">
                  {program.assetCategories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {program.inScopeAssets.map((asset, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 text-xs font-mono shadow-2xs hover:border-blue-400 transition-colors"
                  >
                    <span className="truncate">{asset}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 shadow-sm font-semibold">
              <Zap className="w-4 h-4" />
              Submit Security Report
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
