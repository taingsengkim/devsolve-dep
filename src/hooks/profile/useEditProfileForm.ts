"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  EditProfileFormData,
  NotificationChannelPrefs,
  NotificationKey,
  SocialLinksForm,
} from "@/lib/types/profile/types";
import { PasswordFormState } from "@/components/profile/settings/PasswordSection";

interface UseEditProfileFormProps {
  initialData: EditProfileFormData;
  onSave?: (data: EditProfileFormData & { passwords: PasswordFormState }) => Promise<void> | void;
}

export function useEditProfileForm({ initialData, onSave }: UseEditProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<EditProfileFormData>(initialData);
  const [passwords, setPasswords] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: "fullName" | "username" | "email", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocialLink = (key: keyof SocialLinksForm, value: string) => {
    setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
  };

  const updateNotification = (key: NotificationKey, channel: keyof NotificationChannelPrefs, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: { ...prev.notifications[key], [channel]: value },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.({ ...form, passwords });
      toast.success("Profile updated.");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => router.back();
  const handlePreview = () => router.push(`/dashboard/profile/${form.username}`);

  return {
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
    handlePreview,
  };
}
