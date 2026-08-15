import React from "react";
import { motion } from "motion/react";
import { RotateCw, SquareCheck, Clock, Sparkles, Eye } from "lucide-react";
import { RetestItem } from "@/lib/redux/services/reportsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportRetestTabProps {
  retestHistory: RetestItem[];
  onInitiateRetest: () => void;
  onResetRetest: () => void;
}

export function ReportRetestTab({
  retestHistory,
  onInitiateRetest,
  onResetRetest,
}: ReportRetestTabProps) {
  return (
    <div className="w-full space-y-4">
      {/* Quick Demo Toggle State Bar */}
      <div className="flex items-center justify-end gap-2 text-xs">
        <span className="text-slate-400 font-medium">Demo State:</span>
        {retestHistory.length === 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onInitiateRetest}
            className="text-xs text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100 rounded-lg cursor-pointer h-7"
          >
            Switch to Image 2 (Has Data)
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={onResetRetest}
            className="text-xs text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer h-7"
          >
            Switch to Image 1 (Empty State)
          </Button>
        )}
      </div>

      {retestHistory.length === 0 ? (
        /* Empty State Placeholder */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-3xl ring-1 ring-foreground/5 dark:ring-foreground/10 border border-border p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-xs my-2"
        >
          {/* Center Graphic */}
          <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-blue-500/10">
            <span className="absolute top-8 left-10 w-2.5 h-2.5 rounded-full bg-blue-400/40" />
            <span className="absolute right-8 top-24 w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="absolute bottom-10 right-16 w-3 h-3 rounded-full bg-muted-foreground/20" />

            <div className="relative w-28 h-28 bg-card rounded-2xl border border-border shadow-md flex items-center justify-center">
              <SquareCheck className="w-12 h-12 text-blue-600 dark:text-blue-400 stroke-[1.75]" />
              <div className="absolute -bottom-2 -right-2 bg-blue-500/20 text-foreground p-1.5 rounded-full border-2 border-card shadow-xs">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2 max-w-lg">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              No retest history found
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              This report has not been retested yet. Once the organization marks the fix as ready, you can perform a retest to verify the vulnerability has been properly mitigated.
            </p>
          </div>

          <Button
            onClick={onInitiateRetest}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-6 text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <RotateCw className="w-4.5 h-4.5" />
            <span>Initiate First Retest</span>
          </Button>
        </motion.div>
      ) : (
        /* Retest History Data Table */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 border border-border shadow-xs overflow-hidden my-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/60 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">REPORT ID & TITLE</th>
                  <th className="py-3.5 px-4 sm:px-6">VERSION</th>
                  <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                  <th className="py-3.5 px-4 sm:px-6">REQUEST DATE</th>
                  <th className="py-3.5 px-4 sm:px-6">BOUNTY BONUS</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {retestHistory.map((item, idx) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="hover:bg-muted/50 transition-colors group"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.reportIdTitle}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {item.securityCategory}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="font-mono text-xs text-muted-foreground font-semibold">
                        {item.version}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {item.status === "PASSED" ? (
                        <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          PASSED
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
                          FAILED
                        </Badge>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground font-medium">
                        {item.requestDate}
                      </span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {item.bountyBonus ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 shadow-xs">
                          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {item.bountyBonus}
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-medium text-xs">&mdash;</span>
                      )}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-muted transition-colors cursor-pointer"
                        aria-label="View Retest Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
