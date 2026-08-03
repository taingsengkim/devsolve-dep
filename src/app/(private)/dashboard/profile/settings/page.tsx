"use client";

import { useState } from "react";
import { motion } from "motion/react";
import EditProfileForm from "@/components/profile/settings/EditProfileForm";
import Breadcrumb from "@/components/profile/settings/Breadcrumb";
import {
  useGetEditProfileFormQuery,
  useGetAccountStatusQuery,
  useUpdateProfileMutation,
} from "@/lib/redux/services/profileApi";

export default function EditProfileSettingsPage() {
  const { data: initialData, isLoading: isLoadingForm } = useGetEditProfileFormQuery();
  const { data: accountStatus, isLoading: isLoadingStatus } = useGetAccountStatusQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [liveUsername, setLiveUsername] = useState<string | undefined>(undefined);

  if (isLoadingForm || isLoadingStatus || !initialData || !accountStatus) {
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
          <Breadcrumb
            items={[
              { label: "Profile", href: `/dashboard/profile/${liveUsername ?? initialData.username}` },
              { label: "Edit profile" },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Manage your personal profile, account details, security settings, and notification preferences.
          </p>
        </div>
      </header>

      {/* Main Settings Form */}
      <EditProfileForm
        initialData={initialData}
        accountStatus={accountStatus}
        onUsernameChange={setLiveUsername}
        onSave={async (data) => {
          const { passwords, ...profileData } = data;
          void passwords;
          await updateProfile(profileData).unwrap();
        }}
      />
    </motion.div>
  );
}
