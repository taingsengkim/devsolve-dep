"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/notifications/NotificationContext";

export default function NotificationsPage() {
  const { openNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    openNotification();
    router.replace("/dashboard");
  }, [openNotification, router]);

  return null;
}
