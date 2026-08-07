"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Bell,
  ExternalLink,
  HelpCircle,
  KeyRound,
  Lock,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Toggle from "./Toggle";
import { useThemeToggle } from "@/components/motion/theme-toggle";
import type {
  NotificationKey,
  NotificationPreferences,
} from "@/lib/types/profile/types";

const NOTIFICATION_ITEMS: { key: NotificationKey; label: string }[] = [
  { key: "reportStatusChanges", label: "Report Status Changes" },
  { key: "adminApprovals", label: "Admin Approvals" },
  { key: "newPrograms", label: "New Programs & Targets" },
  { key: "retestInvites", label: "Retest Invites" },
  { key: "communityActivity", label: "Community Activity & Comments" },
  { key: "followActivity", label: "Follow Activity & Achievements" },
];

interface AccountSettingsPanelProps {
  initialNotifications: NotificationPreferences;
  initialTwoFactorEnabled: boolean;
}

/**
 * Settings for the account and the app itself — security, notifications,
 * appearance. Deliberately holds none of the profile's own content: name,
 * photo, bio and links are edited in place on the profile page, so there is
 * exactly one place to change each thing.
 */
export default function AccountSettingsPanel({
  initialNotifications,
  initialTwoFactorEnabled,
}: AccountSettingsPanelProps) {
  const [notifications, setNotifications] =
    useState<NotificationPreferences>(initialNotifications);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    initialTwoFactorEnabled,
  );
  const { isDark, mounted, toggle } = useThemeToggle({
    variant: "rectangle",
    start: "bottom-up",
  });

  const handleManagePassword = () => {
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    if (!issuer) {
      toast.error("Password management is unavailable right now.");
      return;
    }
    window.open(
      `${issuer.replace(/\/+$/, "")}/account`,
      "_blank",
      "noopener,noreferrer",
    );
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
        {/* Notifications */}
        <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800/80 dark:text-slate-100">
            <Bell className="size-5 text-slate-500 dark:text-slate-400" />
            <span>Notifications</span>
          </div>

          <div className="space-y-4 pt-1">
            {NOTIFICATION_ITEMS.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-1"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <Toggle
                  checked={notifications[item.key]?.email ?? true}
                  onChange={(value) =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: { ...prev[item.key], email: value },
                    }))
                  }
                  label={item.label}
                />
              </div>
            ))}
          </div>

          {/* Honest about the state of things: there is no preferences
              endpoint yet, so these do not survive a reload. */}
          <p className="border-t border-slate-100 pt-4 text-sm text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Notification preferences aren&apos;t saved to your account yet.
          </p>
        </section>

        {/* Appearance */}
        <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900 dark:border-slate-800/80 dark:text-slate-100">
            <Monitor className="size-5 text-slate-500 dark:text-slate-400" />
            <span>Appearance</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Theme
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mounted && isDark ? "Dark" : "Light"} mode is active on this
                device.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={toggle}
              className="h-10 rounded-xl border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {mounted && isDark ? <Sun size={15} /> : <Moon size={15} />}
              {mounted && isDark ? "Light mode" : "Dark mode"}
            </Button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
