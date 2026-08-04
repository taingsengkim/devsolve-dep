"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import {
  User2,
  Lock,
  Bell,
  HelpCircle,
  KeyRound,
  LogOut,
  Check,
  Camera,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { EditProfileFormData, AccountStatus, NotificationKey } from "@/lib/types/profile/types";
import { useEditProfileForm } from "@/hooks/profile/useEditProfileForm";
import PasswordSection, { PasswordFormState } from "./PasswordSection";
import AdditionalDetailsSection from "./AdditionalDetailsSection";
import BioSocialSection from "./BioSocialSection";
import Toggle from "./Toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditProfileFormProps {
  initialData: EditProfileFormData;
  accountStatus: AccountStatus;
  onSave?: (data: EditProfileFormData & { passwords: PasswordFormState }) => Promise<void> | void;
  onUsernameChange?: (username: string) => void;
}

const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024; // 2MB — base64 inflates size ~33%, keep this conservative

const NOTIFICATION_ITEMS: { key: NotificationKey; label: string }[] = [
  { key: "reportStatusChanges", label: "Report Status Changes" },
  { key: "adminApprovals", label: "Admin Approvals" },
  { key: "newPrograms", label: "New Programs & Targets" },
  { key: "retestInvites", label: "Retest Invites" },
  { key: "communityActivity", label: "Community Activity & Comments" },
  { key: "followActivity", label: "Follow Activity & Achievements" },
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function EditProfileForm({ initialData, accountStatus, onSave, onUsernameChange }: EditProfileFormProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarPreviewDataUrl, setAvatarPreviewDataUrl] = useState<string | null>(null);
  const {
    form,
    setForm,
    passwords,
    setPasswords,
    isSaving,
    updateField,
    updateSocialLink,
    updateNotification,
    handleSave,
    handleCancel,
  } = useEditProfileForm({ initialData, onSave });

  useEffect(() => {
    onUsernameChange?.(form.username);
  }, [form.username, onUsernameChange]);

  const handleLocalFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setAvatarError("Image is too large — please choose a file under 2MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatarError(null);
      setAvatarPreviewDataUrl(dataUrl);
      toast.info("Showing a preview only — device upload isn't supported by the server yet, so this photo won't be saved. Use the Avatar URL field to save a real photo.");
    } catch {
      setAvatarError("Couldn't read that file — please try a different image.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* 1. Account Settings Top Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        {/* Card Section Header */}
        {/* <div className="flex items-center gap-2.5 pb-6 text-slate-900 dark:text-slate-100 font-bold text-lg border-b border-slate-100 dark:border-slate-800/80 mb-6">
          <User2 className="size-5 text-slate-500 dark:text-slate-400" />
          <span>Account Settings</span>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Avatar & User Headline */}
          <div className="lg:col-span-3 flex flex-col items-center text-center space-y-3">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full ring-4 ring-blue-500/20 border-2 border-blue-600 p-0.5 overflow-hidden relative bg-slate-100 shadow-sm">
                {avatarPreviewDataUrl || form.avatarUrl ? (
                  <Image
                    src={avatarPreviewDataUrl ?? form.avatarUrl ?? ""}
                    alt="Profile Avatar"
                    fill
                    className="object-cover rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    {form.avatarInitials}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 hover:scale-105"
                title="Upload a photo"
              >
                <Camera size={14} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleLocalFilePick}
                />
              </label>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight">
                {form.fullName || "User Name"}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                @{form.username || "username"}
              </p>
              {form.location && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                  {form.location}
                </p>
              )}
            </div>

            {avatarError && (
              <div className="flex items-start gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 p-3 text-left">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
                <p className="text-xs leading-relaxed text-rose-700 dark:text-rose-300">{avatarError}</p>
              </div>
            )}
          </div>

          {/* Middle: Info Grid Fields */}
<div className="lg:col-span-6 space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Full Name
      </label>
      <Input
        value={form.fullName}
        onChange={(e) => updateField("fullName", e.target.value)}
        placeholder="First & Last Name"
        className="h-10.5 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-medium shadow-2xs"
      />
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Username
      </label>
      <Input
        value={form.username}
        onChange={(e) => updateField("username", e.target.value)}
        placeholder="username"
        className="h-10.5 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-medium shadow-2xs"
      />
    </div>

    <div className="space-y-1.5 sm:col-span-2">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Registered Email
      </label>
      <Input
        type="email"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        placeholder="you@example.com"
        className="h-10.5 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-medium shadow-2xs"
      />
    </div>

    <div className="space-y-1.5 sm:col-span-2">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Avatar URL
      </label>
      <div className="relative">
        <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          value={form.avatarUrl ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
          placeholder="https://example.com/your-photo.jpg"
          className="h-10.5 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-9 text-slate-900 dark:text-slate-100 text-sm font-medium shadow-2xs"
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Paste a link to a hosted image, or use the camera icon on your photo to upload one from this device instead.
      </p>
    </div>

    <div className="sm:col-span-2">
      <BioSocialSection
        bio={form.bio}
        location={form.location}
        socialLinks={form.socialLinks}
        onBioChange={(value) => setForm((prev) => ({ ...prev, bio: value }))}
        onLocationChange={(value) => setForm((prev) => ({ ...prev, location: value }))}
        onSocialLinkChange={updateSocialLink}
      />
    </div>

    <div className="space-y-2 sm:col-span-2 pt-1 mt-2 border-t border-slate-100 dark:border-slate-800/80">
      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        Additional Details
      </label>
      <AdditionalDetailsSection
        phone={form.phone}
        dateOfBirth={form.dateOfBirth}
        gender={form.gender}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
      />
    </div>
  </div>
</div>

          {/* Right: Actions */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3 justify-start items-stretch pt-2 lg:pt-0">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm cursor-pointer transition-all gap-2"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="w-full h-11 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-red-500 dark:text-red-400 font-semibold cursor-pointer transition-all gap-2"
            >
              <LogOut size={16} />
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Bottom Cards Grid (Authentication & Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Authentication Settings */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-bold text-lg border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <Lock className="size-5 text-slate-500 dark:text-slate-400" />
              <span>Authentication Settings</span>
            </div>

            {/* Change Password Sub-section */}
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Change your account password
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowPasswordForm((prev) => !prev)}
                className="h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 text-sm cursor-pointer shadow-2xs transition-all"
              >
                <KeyRound size={15} className="mr-2" />
                {showPasswordForm ? "Hide Password Form" : "Change Password"}
              </Button>

              <AnimatePresence>
                {showPasswordForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pt-3"
                  >
                    <PasswordSection
                      value={passwords}
                      onChange={(field, val) => setPasswords((prev) => ({ ...prev, [field]: val }))}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enable Secure Login / 2FA Toggle */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Enable Secure Login (2FA)
                </span>
                <HelpCircle size={15} className="text-slate-400 cursor-help" />
              </div>
              <Toggle
                checked={form.twoFactorEnabled}
                onChange={(enabled) => setForm((prev) => ({ ...prev, twoFactorEnabled: enabled }))}
                label="Enable Secure Login"
              />
            </div>
          </div>

          {/* Info callout box at bottom */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            DevSolve offers fast and secure login through our novel authentication technology and two-factor authentication.
          </div>
        </div>

        {/* Right Card: Notification Settings */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:bg-slate-900 dark:border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100 font-bold text-lg border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <Bell className="size-5 text-slate-500 dark:text-slate-400" />
            <span>Notification Settings</span>
          </div>

          <div className="space-y-4 pt-1">
            {NOTIFICATION_ITEMS.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <Toggle
                  checked={form.notifications[item.key]?.email ?? true}
                  onChange={(val) => updateNotification(item.key, "email", val)}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}   