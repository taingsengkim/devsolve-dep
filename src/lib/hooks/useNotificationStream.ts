"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { notificationsApi } from "@/lib/redux/services/notificationsApi";
import type { Notification } from "@/lib/types/notifications/types";

export function useNotificationStream(enabled = true) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connectStream = () => {
      eventSource = new EventSource("/api/notifications/stream");

      eventSource.addEventListener("notification", (event: MessageEvent) => {
        try {
          if (!event.data) return;
          const notification: Notification = JSON.parse(event.data);

          // Invalidate RTK query cache so badge count and inbox refresh automatically
          dispatch(notificationsApi.util.invalidateTags(["Notification"]));

          // Show interactive toast alert
          toast.info(notification.title || "New Notification", {
            description: notification.content,
            duration: 5000,
          });
        } catch {
          // Ignore invalid JSON / heartbeats
        }
      });

      eventSource.onerror = () => {
        // Close broken connection and attempt automatic reconnect after 5s
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        reconnectTimer = setTimeout(connectStream, 5000);
      };
    };

    connectStream();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [dispatch, enabled]);
}
