"use client";

import React from "react";
import { Bell } from "lucide-react";
import { useNotification } from "./NotificationContext";
import { useGetUnreadCountQuery } from "@/lib/redux/services/notificationsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const NotificationTrigger: React.FC<{ className?: string }> = ({ className }) => {
  const { openNotification } = useNotification();
  const { data } = useGetUnreadCountQuery();
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openNotification}
      aria-label="Notifications"
      title="Notifications"
      className={cn(
        "relative size-10 shrink-0 cursor-pointer rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <Bell />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-0.5 -top-0.5 min-w-4 justify-center rounded-full px-1 py-0 text-[10px] font-bold tabular-nums shadow-xs"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </Button>
  );
};
