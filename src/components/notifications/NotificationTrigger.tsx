"use client";

import React from "react";
import { Bell } from "lucide-react";
import { useNotification } from "./NotificationContext";
import { useGetNotificationsQuery } from "@/lib/redux/services/notificationsApi";
import { Button } from "@/components/ui/button";

export const NotificationTrigger: React.FC<{ className?: string }> = ({ className }) => {
  const { openNotification } = useNotification();
  const { data } = useGetNotificationsQuery();
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openNotification}
      aria-label="Notifications"
      title="Notifications"
      className={`relative w-10 h-10 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ${className || ""}`}
    >
      <Bell className="w-5 h-5 text-slate-700" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] font-bold text-white items-center justify-center shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </span>
      )}
    </Button>
  );
};
