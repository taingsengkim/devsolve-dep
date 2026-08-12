"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Bell,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  KeyRound,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Toggle from "./Toggle";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/lib/redux/services/notificationsApi";
import type { NotificationCategoryKey } from "@/lib/types/notifications/types";
import type { NotificationPreferences } from "@/lib/types/profile/types";


const NOTIFICATION_ITEMS: { key: NotificationCategoryKey; label: string }[] = [
  { key: "reportStatusChanges", label: "Report Status Changes" },
  { key: "passwordChanges", label: "Security & Login Alerts" },
  { key: "newPrograms", label: "New Programs & Targets" },
  { key: "retestInvites", label: "Retest Invites" },
  { key: "discussionReplies", label: "Community Activity & Comments" },
  { key: "followerActivity", label: "Follow Activity & Achievements" },
];

interface AccountSettingsPanelProps {
  initialNotifications: NotificationPreferences;
  initialTwoFactorEnabled: boolean;
}

export default function AccountSettingsPanel({
  initialNotifications,
  initialTwoFactorEnabled,
}: AccountSettingsPanelProps) {
  const { data: notificationSettings } = useGetNotificationSettingsQuery();
  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    initialTwoFactorEnabled
  );

  const handleManagePassword = () => {
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    if (!issuer) {
      toast.error("Password management is unavailable right now.");
      return;
    }
    window.open(
      `${issuer.replace(/\/+$/, "")}/account`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleToggleNotification = async (
    key: NotificationCategoryKey,
    value: boolean
  ) => {
    try {
      await updateNotificationSettings({
        categories: {
          [key]: {
            inApp: value,
            email: value,
            push: value,
          },
        },
      }).unwrap();
      toast.success("Notification preference updated.");
    } catch {
      toast.error("Failed to update notification preference.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      {/* Security */}
      <section className="flex flex-col justify-between space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800/80 dark:text-slate-100">
            <Lock className="size-5 text-slate-500 dark:text-slate-400" />
            <span>Security</span>
          </div>

          <div className="space-y-3 border-b border-slate-100 pb-4 dark:border-slate-800/80">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Change your account password
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleManagePassword}
              className="h-10 cursor-pointer rounded-full bg-slate-100 px-6 text-sm font-semibold text-slate-800 shadow-2xs transition-all hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <KeyRound size={15} />
              Change password
              <ExternalLink size={13} className="opacity-60" />
            </Button>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Opens your secure Keycloak account page in a new tab — DevSolve
              never stores your password.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Enable secure login (2FA)
              </span>
              <HelpCircle size={15} className="cursor-help text-slate-400" />
            </div>
            <Toggle
              checked={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
              label="Enable secure login"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm font-medium leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          DevSolve offers fast and secure login through our novel authentication
          technology and two-factor authentication.
        </div>
      </section>

      <div className="space-y-6">
        {/* Notifications Overview */}
        <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 dark:text-slate-100">
              <Bell className="size-5 text-slate-500 dark:text-slate-400" />
              <span>Notifications</span>
            </div>
            <Link
              href="/dashboard/notifications/settings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Detailed Settings
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="space-y-4 pt-1">
            {NOTIFICATION_ITEMS.map((item) => {
              const isEnabled =
                notificationSettings?.categories[item.key]?.email ?? true;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-1"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <Toggle
                    checked={isEnabled}
                    onChange={(val) => handleToggleNotification(item.key, val)}
                    label={item.label}
                  />
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <Link
              href="/dashboard/notifications/settings"
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Manage channel options (In-App, Email, Push & Frequency)</span>
              <ChevronRight className="size-4 text-slate-400" />
            </Link>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

