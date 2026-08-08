"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function UserDataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  pageSize,
  pageCount,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: UserDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [localPagination, setLocalPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isServerPaged = typeof pageIndex === "number" && typeof pageCount === "number";

  const table = useReactTable({
    data,
    columns,
    pageCount: isServerPaged ? pageCount : undefined,
    manualPagination: isServerPaged,
    getCoreRowModel: getCoreRowModel(),
    ...(!isServerPaged && { getPaginationRowModel: getPaginationRowModel() }),
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (isServerPaged) {
        if (typeof updater === "function") {
          const nextState = updater({
            pageIndex: pageIndex ?? 0,
            pageSize: pageSize ?? 20,
          });
          if (nextState.pageIndex !== pageIndex && onPageChange) {
            onPageChange(nextState.pageIndex);
          }
          if (nextState.pageSize !== pageSize && onPageSizeChange) {
            onPageSizeChange(nextState.pageSize);
          }
        }
      } else {
        setLocalPagination(updater);
      }
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: isServerPaged
        ? { pageIndex: pageIndex ?? 0, pageSize: pageSize ?? 20 }
        : localPagination,
    },
  });


  return (
    <div className="flex flex-col gap-4">
      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center p-0"
                >
                  <Card className="gap-3 border-none bg-transparent py-8 shadow-none">
                    <CardHeader className="grid justify-items-center gap-3 px-8 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                        <Users className="size-6" />
                      </div>
                      <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
                        No matching users found
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                        Try another search or status filter.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        {data.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Rows per page
                </span>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(val) => {
                    if (val) table.setPageSize(Number(val));
                  }}
                >
                  <SelectTrigger className="h-8 w-16 cursor-pointer rounded-xl border-slate-300 bg-white px-2.5 text-sm font-semibold text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <SelectValue placeholder={String(table.getState().pagination.pageSize)} />
                  </SelectTrigger>
                  <SelectContent align="start" className="min-w-20 rounded-2xl shadow-lg">
                    <SelectGroup>
                      {[10, 20, 50, 100].map((pageSize) => (
                        <SelectItem
                          key={pageSize}
                          value={String(pageSize)}
                          className="cursor-pointer text-sm font-semibold"
                        >
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Page{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {table.getPageCount() || 1}
                </span>{" "}
                ({totalElements ?? data.length} total)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 cursor-pointer rounded-xl border-slate-200 px-3 text-sm font-semibold disabled:opacity-40 dark:border-slate-800"
              >
                <ChevronLeft data-icon="inline-start" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 cursor-pointer rounded-xl border-slate-200 px-3 text-sm font-semibold disabled:opacity-40 dark:border-slate-800"
              >
                Next
                <ChevronRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
