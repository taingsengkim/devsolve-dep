"use client";

import React from "react";
import Link from "next/link";
import { BookmarkItem } from "@/lib/types/bookmarks/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, Clock, ShieldAlert, Award, ThumbsUp, Layers, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface BookmarkCardProps {
  item: BookmarkItem;
  onRemove: (id: string) => void;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ item, onRemove }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item.id);
    toast.success("Bookmark removed", {
      description: `"${item.title}" removed from your saved items.`,
    });
  };

  const getCategoryBadge = () => {
    switch (item.category) {
      case "Program":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-800 text-xs font-medium rounded-lg px-2.5 py-0.5">
            Program
          </Badge>
        );
      case "Problems":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-800 text-xs font-medium rounded-lg px-2.5 py-0.5">
            Problem
          </Badge>
        );
      case "Solutions":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800 text-xs font-medium rounded-lg px-2.5 py-0.5">
            Solution
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSeverityColor = (sev?: string) => {
    switch (sev) {
      case "Critical":
        return "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800";
      case "High":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "Medium":
        return "bg-yellow-50 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group space-y-4 relative"
    >
      {/* CARD TOP BAR */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {getCategoryBadge()}
          {item.severity && (
            <Badge variant="outline" className={`text-xs rounded-lg px-2 py-0.5 font-medium border ${getSeverityColor(item.severity)}`}>
              <ShieldAlert className="w-3 h-3 mr-1 inline" />
              {item.severity}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.savedAt}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            title="Remove from saved bookmarks"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 fill-blue-600 dark:fill-blue-400 stroke-blue-600 dark:stroke-blue-400 hover:fill-transparent hover:stroke-red-600" />
          </button>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="space-y-2 flex-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* CATEGORY SPECIFIC METADATA */}
      <div className="pt-1">
        {item.category === "Program" && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {item.companyName || "Organization"}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Max {item.bountyMax || "Bounty"}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {item.inScopeCount} assets
            </span>
          </div>
        )}

        {item.category === "Problems" && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <Award className="w-3.5 h-3.5" />
              {item.points} Points
            </span>
            <span>{item.submissionsCount} submissions</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              {item.status}
            </span>
          </div>
        )}

        {item.category === "Solutions" && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              By {item.authorName || "Community Member"}
            </span>
            <span>{item.readTime}</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
              {item.likesCount}
            </span>
          </div>
        )}
      </div>

      {/* TAGS CHIPS */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {item.tags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
          >
            #{tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="text-[11px] text-slate-400 font-medium">
            +{item.tags.length - 3} more
          </span>
        )}
      </div>

      {/* FOOTER VIEW LINK */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <Link href={item.url || "#"} className="w-full">
          <Button
            variant="outline"
            className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 justify-between"
          >
            View Details
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};
