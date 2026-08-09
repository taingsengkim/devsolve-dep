"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import AccountSettingsPanel from "@/components/profile/settings/AccountSettingsPanel";
import { useGetEditProfileFormQuery } from "@/lib/redux/services/profileApi";

export default function AccountSettingsPage() {
  const { data, isLoading } = useGetEditProfileFormQuery();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full space-y-6 pb-12"
    >
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-2 sm:flex-row sm:items-center dark:border-slate-800">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500"
          >
            <Link
              href="/dashboard/profile"
              className="transition-colors hover:text-slate-900 dark:hover:text-slate-200"
            >
              Profile
            </Link>
            <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-700" />
            <span className="text-slate-900 dark:text-slate-200">Settings</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Account Settings
          </h1>
          {/* Points people at the right place for the other half — profile
              content is edited on the profile itself now. */}
          <p className="text-base text-slate-500 dark:text-slate-400">
            Security, notifications, and appearance. To change your name, photo
            or bio,{" "}
            <Link
              href="/dashboard/profile"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              edit your profile
            </Link>
            .
          </p>
        </div>
      </header>

      {isLoading || !data ? (
        <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-6">
            <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ) : (
        <AccountSettingsPanel
          initialNotifications={data.notifications}
          initialTwoFactorEnabled={data.twoFactorEnabled}
        />
      )}
    </motion.div>
  );
}
