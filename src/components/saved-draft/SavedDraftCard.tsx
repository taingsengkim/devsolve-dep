"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  MoreVertical,
  ChevronRight,
  PencilLine,
  Copy,
  FolderInput,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { SavedDraftItem } from "@/components/saved-draft/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SavedDraftCardProps {
  item: SavedDraftItem;
  onDelete?: (itemId: string) => void;
}

const STATIC_CARD_LOGO =
  "https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg";

function getDraftMeta(item: SavedDraftItem) {
  if (item.category === "problem") {
    return { label: "Problem draft" };
  }
  if (item.category === "solution") {
    return { label: "Solution draft" };
  }
  if (item.category === "report") {
    return { label: "Report draft" };
  }
  return {
    label: item.programDraftKind === "response" ? "Response draft" : "Program draft",
  };
}

function getDraftHref(item: SavedDraftItem) {
  if (item.category === "program") {
    return `/dashboard/create-program?id=${encodeURIComponent(item.id)}`;
  }
  if (item.category === "problem") {
    return `/dashboard/discussions/new?id=${encodeURIComponent(item.id)}`;
  }
  if (item.category === "solution") {
    return `/dashboard/discussions/${encodeURIComponent(item.id)}`;
  }
  if (item.category === "report") {
    return `/dashboard/submit-report?id=${encodeURIComponent(item.id)}`;
  }
  return "/dashboard/my-reports";
}

export function SavedDraftCard({ item, onDelete }: SavedDraftCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const meta = getDraftMeta(item);
  const href = getDraftHref(item);

  return (
    <>
      <div className="group relative bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 p-6 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:ring-blue-500/40 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40">
        
        {/* DROPDOWN ACTIONS MENU (Top Right) */}
        <div className="absolute top-5 right-5 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Draft actions for ${item.title}`}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-2 rounded-xl text-muted-foreground hover:text-blue-600 hover:bg-blue-50/80 active:scale-95 transition-all duration-200 outline-none dark:hover:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <MoreVertical className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-52 rounded-xl bg-card ring-1 ring-foreground/5 dark:ring-foreground/10 p-1 shadow-lg z-30"
            >
              <DropdownMenuItem
                onClick={() => router.push(href)}
                className="rounded-[10px] px-3 py-2 text-foreground focus:bg-blue-50 dark:focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 mr-2" />
                Continue editing
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-[10px] px-3 py-2 text-foreground focus:bg-blue-50 dark:focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer">
                <PencilLine className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-[10px] px-3 py-2 text-foreground focus:bg-blue-50 dark:focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-[10px] px-3 py-2 text-foreground focus:bg-blue-50 dark:focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer">
                <FolderInput className="w-4 h-4 mr-2" />
                Move category
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-[10px] px-3 py-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {/* HEADER: STATIC LOGO, TITLE & BADGES */}
          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-11 h-11 bg-muted rounded-xl flex items-center justify-center ring-1 ring-foreground/5 dark:ring-foreground/10 shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-all duration-300">
              <Image
                src={item.logoSrc || STATIC_CARD_LOGO}
                alt={item.logoAlt || item.title}
                className="w-full h-full object-cover"
                width={44}
                height={44}
              />
            </div>
            <div>
              <h4 className="font-bold text-[17px] leading-tight text-blue-600 dark:text-blue-400 truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors bg-blue-50 text-blue-600 border-blue-100/80 group-hover:border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
                  {meta.label}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-600 border-amber-100/80 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20">
                  Draft
                </span>
              </div>
            </div>
          </div>

          {/* DRAFT CONTENT & SUBTITLE */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-foreground text-[17px] leading-snug line-clamp-1 transition-colors">
              {item.title}
            </h3>
            <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description || "No description provided for this draft."}
            </p>
          </div>

          {/* IN-SCOPE ASSETS / TAGS SECTION */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              In-Scope Assets
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {item.tags && item.tags.length > 0 ? (
                <>
                  {item.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={tag || index}
                      className="bg-muted text-foreground/80 text-xs font-mono font-medium px-2.5 py-1 rounded-lg ring-1 ring-foreground/5 dark:ring-foreground/10 max-w-[200px] truncate transition-colors"
                      title={tag}
                    >
                      {tag}
                    </span>
                  ))}

                  {item.tags.length > 2 && (
                    <span className="bg-muted/70 text-muted-foreground text-xs font-semibold px-2 py-1 rounded-md ring-1 ring-foreground/5 dark:ring-foreground/10">
                      +{item.tags.length - 2} more
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[13px] text-muted-foreground italic">No assets listed</span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER: UPDATED DATE & CONTINUE BUTTON */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium">Status</p>
            <p className="text-[13px] font-semibold text-foreground">
              Updated {item.updatedAt}
            </p>
          </div>

          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted ring-1 ring-foreground/5 dark:ring-foreground/10 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md active:scale-95 transition-all duration-200"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
          </Link>
        </div>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showDeleteDialog && (
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
              className="w-full max-w-md rounded-2xl bg-card ring-1 ring-foreground/5 dark:ring-foreground/10 p-5 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`delete-draft-${item.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              <h3
                id={`delete-draft-${item.id}`}
                className="text-lg font-semibold text-foreground"
              >
                Delete draft?
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Remove <span className="font-medium text-foreground">{item.title}</span> from your saved drafts. This action cannot be undone.
              </p>

              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  className="h-10 rounded-xl bg-card px-4 text-foreground hover:bg-muted"
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
        )}
      </AnimatePresence>
    </>
  );
}