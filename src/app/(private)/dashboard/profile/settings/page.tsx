"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import EditProfileForm from "@/components/profile/settings/EditProfileForm";
import { Button } from "@/components/ui/button";
import {
  useGetProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
} from "@/lib/redux/services/profileApi";

export default function EditProfileSettingsPage() {
  const { data, isLoading } = useGetProfileSettingsQuery();
  const [updateProfileSettings] = useUpdateProfileSettingsMutation();

  if (isLoading || !data) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-16 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="h-48 bg-slate-200/60 dark:bg-slate-800 rounded-xl md:col-span-1" />
          <div className="h-96 bg-slate-200/60 dark:bg-slate-800 rounded-xl md:col-span-3" />
        </div>
      </div>
    );
  }

  const { formData, accountStatus } = data;

  const handleSave = async (updatedData: typeof formData) => {
    await updateProfileSettings({ formData: updatedData });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your personal profile, account details, security settings, and notification preferences.
          </p>
        </div>

        <Link href={`/dashboard/profile/${formData.username}`}>
          <Button
            variant="outline"
            size="sm"
            className="self-start sm:self-auto cursor-pointer rounded-xl border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all gap-2 px-4 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Profile</span>
          </Button>
        </Link>
      </header>

      {/* Main Settings Form */}
      <EditProfileForm
        initialData={formData}
        accountStatus={accountStatus}
        onSave={handleSave}
      />
    </motion.div>
  );
}

