"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  BookOpen,
  Building,
  Building2,
  CheckCircle2,
  ChevronRight,
  Gavel,
  Gift,
  Mail,
  MessageSquare,
  Sparkles,
  UserPlus,
} from "lucide-react";
import type { Notification, NotificationType } from "@/lib/types/notifications/types";

interface NotificationItemCardProps {
  item: Notification;
  onMarkRead?: (id: string) => void;
  onCloseModal?: () => void;
}

/**
 * Where tapping a notification goes.
 *
 * Every branch here is checked against a route that exists. Most of these used
 * to point at pages that were never built — `/dashboard/problems/{id}`,
 * `/dashboard/solutions/{id}`, `/dashboard/showcases/{id}`,
 * `/dashboard/organizations/invitations`, `/dashboard/profile/kyc`,
 * `/dashboard/disputes/{id}` and `/dashboard/recognitions/{id}` were all
 * 404s, so seven of the eleven kinds of notification led nowhere.
 *
 * Where the id cannot address a page on its own, this lands on the list that
 * contains the item rather than on a broken URL. `SOLUTION` is the clearest
 * case: `notifiableId` is the solution's id, but a solution is only readable
 * under its problem, whose id the payload does not carry.
 */
function getNotificationLink(type: NotificationType, id: string): string {
  switch (type) {
    case "PROBLEM":
      return `/community/${id}`;
    case "SHOWCASE":
      return `/showcases/${id}`;
    case "PROGRAM":
      return `/dashboard/programs/${id}`;
    case "ORGANIZATION":
      return `/dashboard/organizations/${id}`;
    case "REPORT":
      return `/dashboard/my-reports/${id}`;
    case "SOLUTION":
      return `/dashboard/my-community`;
    case "INVITATION":
      return `/dashboard/team-management`;
    case "KYC":
      // Verification state and its next action live on the org page.
      return `/dashboard/organizations`;
    case "REWARD":
    case "RECOGNITION":
      return `/dashboard/rewards`;
    case "USER":
      // A follow. The payload carries the actor's uuid and the profile route
      // keys on username, so this opens the reader's own followers instead.
      return `/dashboard/profile`;
    case "COMMENT":
    case "DISPUTE":
    default:
      return `/dashboard`;
  }
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "PROBLEM":
      return <BookOpen className="w-4 h-4 text-blue-500" />;
    case "SOLUTION":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "PROGRAM":
      return <Building2 className="w-4 h-4 text-indigo-500" />;
    case "SHOWCASE":
      return <Sparkles className="w-4 h-4 text-amber-500" />;
    case "ORGANIZATION":
      return <Building className="w-4 h-4 text-cyan-500" />;
    case "REPORT":
      return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    case "INVITATION":
      return <Mail className="w-4 h-4 text-violet-500" />;
    case "KYC":
      return <BadgeCheck className="w-4 h-4 text-emerald-600" />;
    case "DISPUTE":
      return <Gavel className="w-4 h-4 text-orange-500" />;
    case "RECOGNITION":
      return <Award className="w-4 h-4 text-yellow-500" />;
    case "REWARD":
      return <Gift className="w-4 h-4 text-emerald-500" />;
    case "USER":
      return <UserPlus className="w-4 h-4 text-blue-500" />;
    case "COMMENT":
    default:
      return <MessageSquare className="w-4 h-4 text-slate-500" />;
  }
}

function formatNotificationTime(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  onMarkRead,
  onCloseModal,
}) => {
  const targetHref = getNotificationLink(item.notifiableType, item.notifiableId);
  const isUnread = !item.read;

  const handleClick = () => {
    if (isUnread && item.id && onMarkRead) {
      onMarkRead(item.id);
    }
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl transition-all border ${
        isUnread
          ? "bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 border-blue-500/20"
          : "bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60"
      }`}
    >
      {/* Icon Avatar */}
      <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 shadow-2xs border border-slate-200/50 dark:border-slate-700/50">
        {getNotificationIcon(item.notifiableType)}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={targetHref}
            onClick={handleClick}
            className="group/title block min-w-0"
          >
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors leading-snug truncate">
              {item.title}
            </h3>
          </Link>

          {/* Unread Red Dot Indicator */}
          {isUnread && item.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onMarkRead && item.id) onMarkRead(item.id);
              }}
              title="Mark as read"
              className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-1 shadow-xs hover:scale-125 transition-transform cursor-pointer"
            />
          )}
        </div>

        {/* Content Details */}
        <p className="text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed break-words">
          {item.content}
        </p>

        {/* Footer info & Link */}
        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <span>{formatNotificationTime(item.createdAt)}</span>

          <Link
            href={targetHref}
            onClick={handleClick}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>View details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
