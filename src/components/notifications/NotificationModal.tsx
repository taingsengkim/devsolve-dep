"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Scan,
  Maximize2,
  Minimize2,
  X,
  CheckCheck,
  ChevronDown,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useReplyNotificationMutation,
} from "@/lib/redux/services/notificationsApi";
import { NotificationItemCard } from "./NotificationItemCard";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/lib/types/notifications/types";

interface NotificationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen = true,
  onClose,
  isEmbedded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const { data, isLoading, isError } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [replyNotification] = useReplyNotificationMutation();

  const handleMarkAllRead = () => {
    markAsRead();
  };

  const handleMarkSingleRead = (id: string) => {
    markAsRead(id);
  };

  const handleReply = (id: string, message: string) => {
    replyNotification({ notificationId: id, message });
  };

  const notifications = data?.items || [];

  // Get unique date groups for filter options
  const dateOptions = Array.from(new Set(notifications.map((n) => n.dateGroup)));

  // Filter notifications based on selected date
  const filteredNotifications =
    selectedDateFilter === "all"
      ? notifications
      : notifications.filter((n) => n.dateGroup === selectedDateFilter);

  // Group notifications by dateGroup preserving chronological order
  const groupedNotifications: { date: string; items: NotificationItem[] }[] = [];
  filteredNotifications.forEach((item) => {
    const existingGroup = groupedNotifications.find((g) => g.date === item.dateGroup);
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groupedNotifications.push({ date: item.dateGroup, items: [item] });
    }
  });

  if (!isOpen && !isEmbedded) return null;

  const cardContent = (
    <div
      className={`flex flex-col h-full w-full bg-white overflow-hidden ${
        isEmbedded
          ? "rounded-2xl border border-slate-200/90 shadow-xl"
          : "rounded-l-2xl border-l border-slate-200"
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notification</h2>
        <div className="flex items-center gap-1.5 text-slate-500">
          {!isEmbedded && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
              title={isExpanded ? "Collapse width" : "Expand width"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}

          {onClose && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Action / Filter Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100/80 bg-slate-50/40 gap-3 flex-wrap shrink-0">
        {/* Date Filter Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="h-9 px-3.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-xl gap-2 cursor-pointer shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>
              {selectedDateFilter === "all" ? "Date Added" : selectedDateFilter}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </Button>

          {/* Date Filter Dropdown Menu */}
          <AnimatePresence>
            {isFilterDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setSelectedDateFilter("all");
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-between ${
                    selectedDateFilter === "all" ? "text-blue-600 bg-blue-50/50 font-semibold" : "text-slate-700"
                  }`}
                >
                  <span>All Dates</span>
                  {selectedDateFilter === "all" && <CheckCheck className="w-4 h-4 text-blue-600" />}
                </button>

                {dateOptions.map((date) => (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDateFilter(date);
                      setIsFilterDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-between ${
                      selectedDateFilter === date ? "text-blue-600 bg-blue-50/50 font-semibold" : "text-slate-700"
                    }`}
                  >
                    <span>{date}</span>
                    {selectedDateFilter === date && <CheckCheck className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mark As Read Button */}
        <Button
          variant="outline"
          onClick={handleMarkAllRead}
          className="h-9 px-3.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-xl gap-2 cursor-pointer shadow-2xs"
        >
          <Scan className="w-4 h-4 text-slate-500" />
          <span>Mark As Read</span>
        </Button>
      </div>

      {/* Notifications List Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 space-y-2">
        {isLoading ? (
          // Skeleton Loading State
          <div className="space-y-4 py-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-100/70">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-slate-500 font-medium text-sm">
            Failed to load notifications. Please try again.
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium text-sm space-y-2">
            <p className="text-slate-600 font-semibold text-base">No notifications found</p>
            <p>You&apos;re all caught up!</p>
          </div>
        ) : (
          groupedNotifications.map((group, groupIdx) => (
            <React.Fragment key={group.date}>
              {/* Centered Date Separator */}
              {groupIdx > 0 && (
                <div className="relative flex py-3 items-center justify-center my-1 select-none">
                  <div className="grow border-t border-slate-200/80" />
                  <span className="shrink mx-4 text-xs sm:text-sm font-medium text-slate-400 bg-white px-2">
                    {group.date}
                  </span>
                  <div className="grow border-t border-slate-200/80" />
                </div>
              )}

              {group.items.map((item) => (
                <NotificationItemCard
                  key={item.id}
                  item={item}
                  onMarkRead={handleMarkSingleRead}
                  onReply={handleReply}
                />
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return cardContent;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Slide Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[290] bg-slate-900/40 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Right Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className={`fixed inset-y-0 right-0 z-[300] h-full shadow-2xl bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ${
              isExpanded
                ? "w-full sm:w-[720px] lg:w-[800px]"
                : "w-full sm:w-[480px] md:w-[540px]"
            }`}
          >
            {cardContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
