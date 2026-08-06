"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetPendingOrganizationsQuery } from "@/lib/redux/services/adminApi";
import { PendingOrganizationCard } from "@/components/admin/organizations/PendingOrganizationCard";

const PAGE_SIZE = 20;

export default function OrganizationVerificationPage() {
  const [pageNumber, setPageNumber] = useState(0);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetPendingOrganizationsQuery({ pageNumber, pageSize: PAGE_SIZE });

  const items = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const isFirst = data?.first ?? true;
  const isLast = data?.last ?? true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Organization Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and manage pending company KYB / KYC requests.
          </p>
        </div>

        {/* Pending badge */}
        {totalElements > 0 && (
          <div className="shrink-0 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {totalElements} pending review{totalElements !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </header>

      {/* LIST */}
      <main className="space-y-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : isError ? (
          <Card className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-500 mx-auto flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Failed to Load Verifications
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Could not reach the server. Please check your connection and try again.
              </p>
            </div>
          </Card>
        ) : items.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No Pending Organizations
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                There are no organizations awaiting verification at this time.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <PendingOrganizationCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* PAGINATION */}
      {!isLoading && !isError && totalPages > 1 && (
        <nav className="flex items-center justify-between gap-4 pt-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page <span className="font-semibold text-slate-700 dark:text-slate-300">{pageNumber + 1}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{totalPages}</span>
            {" "}·{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{totalElements}</span> total
          </p>

          <div className="flex items-center gap-2">
            <Button
              id="pagination-prev"
              variant="outline"
              size="sm"
              disabled={isFirst || isFetching}
              onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
              className="rounded-xl h-9 px-3 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              id="pagination-next"
              variant="outline"
              size="sm"
              disabled={isLast || isFetching}
              onClick={() => setPageNumber((p) => p + 1)}
              className="rounded-xl h-9 px-3 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </nav>
      )}
    </motion.div>
  );
}
