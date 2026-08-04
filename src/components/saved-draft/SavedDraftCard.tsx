"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Clock3,
  Copy,
  FolderInput,
  MoreVertical,
  PencilLine,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { SavedDraftItem } from "@/components/saved-draft/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SavedDraftCardProps = {
  item: SavedDraftItem;
  onDelete?: (itemId: string) => void;
};

function getDraftMeta(item: SavedDraftItem) {
  if (item.category === "problem") {
    return {
      label: "Problem draft",
      badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  if (item.category === "solution") {
    return {
      label: "Solution draft",
      badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  if (item.category === "report") {
    return {
      label: "Report draft",
      badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    label: item.programDraftKind === "response" ? "Response draft" : "Program draft",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
  };
}

function getDraftHref(item: SavedDraftItem) {
  if (item.category === "program") {
    return "/dashboard/programs";
  }

  if (item.category === "report") {
    return "/dashboard/report-management";
  }

  return "/dashboard/my-reports";
}

export function SavedDraftCard({
  item,
  onDelete,
}: SavedDraftCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const meta = getDraftMeta(item);
  const href = getDraftHref(item);

  return (
    <>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.18, ease: "easeOut" }}>
        <Card
          className={cn(
            "group relative h-full overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-white py-0 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(37,99,235,0.08)] has-[:focus-visible]:border-blue-300"
          )}
        >
          <Link
            href={href}
            aria-label={`Continue editing ${item.title}`}
            className="absolute inset-0 z-[1] rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/25"
          />

          <CardContent
            className="relative z-[2] flex h-full min-h-[258px] flex-col gap-4 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="pointer-events-none flex min-w-0 items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-none",
                    meta.badgeClassName
                  )}
                >
                  {meta.label}
                </Badge>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600 shadow-none"
                >
                  Draft
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Draft actions for ${item.title}`}
                    onClick={(event) => event.stopPropagation()}
                    onMouseDown={(event) => event.stopPropagation()}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  >
                    <MoreVertical className="size-4.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-52 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                  >
                    <DropdownMenuItem
                      onClick={() => router.push(href)}
                      className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]"
                    >
                      <ChevronRight className="size-4" />
                      Continue editing
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]">
                      <PencilLine className="size-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]">
                      <Copy className="size-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]">
                      <FolderInput className="size-4" />
                      Move to another category
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-slate-200" />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      className="rounded-[10px] px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600"
                    >
                      <Trash2 className="size-4" />
                      Delete draft
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="pointer-events-none flex min-w-0 items-start gap-3.5">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <Image
                  src={item.logoSrc}
                  alt={item.logoAlt}
                  width={30}
                  height={30}
                  className="size-[30px] object-contain"
                />
              </div>

              <div className="min-w-0 space-y-1.5">
                <h3 className="truncate text-[18px] font-semibold tracking-[-0.025em] text-[#0F172A]">
                  {item.title}
                </h3>
                <p className="flex items-center gap-1.5 text-sm text-[#64748B]">
                  <Clock3 className="size-3.5" />
                  Updated {item.updatedAt}
                </p>
              </div>
            </div>

            <div className="pointer-events-none min-h-[62px]">
              <p className="line-clamp-3 text-sm leading-6 text-[#64748B]">
                {item.description}
              </p>
            </div>

            <div className="pointer-events-none mt-auto space-y-3 pt-2">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex max-w-[132px] truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            
              <div className="h-px w-full bg-slate-100" />

              <div className="flex items-center justify-between gap-3">
                <div className="pointer-events-none">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Ready to continue
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(href);
                  }}
                  className="h-9 rounded-xl border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:border-blue-200 hover:bg-white hover:text-[#2563EB]"
                >
                  Continue
                  <ChevronRight
                    data-icon="inline-end"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showDeleteDialog ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]"
            onClick={() => setShowDeleteDialog(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`delete-draft-${item.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              <h3
                id={`delete-draft-${item.id}`}
                className="text-lg font-semibold text-[#0F172A]"
              >
                Delete draft?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Remove <span className="font-medium text-slate-700">{item.title}</span> from your saved drafts. This action cannot be undone.
              </p>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="h-10 rounded-xl border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onDelete?.(item.id);
                    setShowDeleteDialog(false);
                  }}
                  className="h-10 rounded-xl px-4"
                >
                  Delete draft
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
