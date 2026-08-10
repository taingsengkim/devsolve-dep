"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import type { ShowcaseReviewQueueItem } from "@/lib/redux/services/admin/showcaseReviewApi";

interface ShowcaseDataTableProps {
  items: ShowcaseReviewQueueItem[];
  isLoading: boolean;
  onReview: (id: string) => void;
}

export function ShowcaseDataTable({
  items,
  isLoading,
  onReview,
}: ShowcaseDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const paginatedItems = items.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold px-2.5 py-0.5">
            APPROVED
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold px-2.5 py-0.5">
            REJECTED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold px-2.5 py-0.5">
            PENDING
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3 shadow-2xs">
        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
          <Sparkles className="size-6 text-blue-500" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          No Showcase Submissions Found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          There are currently no showcase submissions matching your selected filter parameters.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Showcase Title & Overview</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {paginatedItems.map((item) => (
                <tr
                  key={item.showcaseId}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Title & Overview */}
                  <td className="py-4 px-4 max-w-xs sm:max-w-md">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.overview}
                      </p>
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <User className="size-3.5 text-slate-400" />
                      {item.authorName || "Anonymous"}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {item.categoryName ? (
                      <Badge variant="outline" className="text-xs font-medium border-slate-300 dark:border-slate-700">
                        <Tag className="size-3 mr-1 text-blue-500" />
                        {item.categoryName}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {item.submissionType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getStatusBadge(item.reviewStatus)}
                  </td>

                  {/* Submitted At */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-slate-400" />
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onReview(item.showcaseId)}
                      className="h-8 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-2xs"
                    >
                      <Eye className="size-3.5 mr-1" />
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <div className="w-20">
              <Select
                value={String(rowsPerPage)}
                onValueChange={(val: string | null) => {
                  if (val) {
                    setRowsPerPage(Number(val));
                    setCurrentPage(1);
                  }
                }}
              >
                <SelectTrigger className="h-8 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-semibold">
                  <SelectValue placeholder={String(rowsPerPage)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <span className="ml-2">
              Showing {(currentPage - 1) * rowsPerPage + 1}–
              {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems} items
            </span>
          </div>

          <div className="flex items-center gap-2 self-center sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <ChevronLeft className="size-4 mr-1" /> Previous
            </Button>
            <span className="font-bold text-slate-700 dark:text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Next <ChevronRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
