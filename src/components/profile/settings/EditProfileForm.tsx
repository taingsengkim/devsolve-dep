"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings2, ShieldCheck, User2 } from "lucide-react";
import {
  EditProfileFormData,
  NotificationChannelPrefs,
  NotificationKey,
  AccountStatus,
  SocialLinksForm,
} from "@/lib/types/profile/types";
import PhotoUpload from "./PhotoUpload";
import PersonalInfoSection from "./PersonalInfoSection";
import BioSocialSection from "./BioSocialSection";
import PasswordSection, { PasswordFormState } from "./PasswordSection";
import TwoFactorSection from "./TwoFactorSection";
import NotificationPreferencesSection from "./NotificationPreferencesSection";
import SettingsSectionCard from "./SettingsSectionCard";
import FormActions from "./FormActions";
import ProfilePreviewCard from "./sidebar/ProfilePreviewCard";
import AccountStatusCard from "./sidebar/AccountStatusCard";
import SecurityTipsCard from "./sidebar/SecurityTipsCard";
import QuickLinksCard from "./sidebar/QuickLinksCard";
import KeepItUpBanner from "./sidebar/KeepItUpBanner";
import { card } from "./styles";

interface EditProfileFormProps {
  initialData: EditProfileFormData;
  accountStatus: AccountStatus;
  // TODO: replace with real mutation, e.g. useUpdateProfileMutation() from profileApi
  onSave?: (data: EditProfileFormData & { passwords: PasswordFormState }) => Promise<void> | void;
}

export default function EditProfileForm({ initialData, accountStatus, onSave }: EditProfileFormProps) {
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => router.back();
  const handlePreview = () => router.push(`/dashboard/profile/${form.username}`);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className={`${card} p-6`}>
          <PhotoUpload avatarInitials={form.avatarInitials} />
        </div>

        <SettingsSectionCard icon={<User2 size={18} className="text-[#4d4d4d]" />} title="Personal information">
          <PersonalInfoSection
            data={{ fullName: form.fullName, username: form.username, email: form.email, accountType: form.accountType }}
            onChange={updateField}
          />
        </SettingsSectionCard>

        <SettingsSectionCard icon={<Settings2 size={18} className="text-[#4d4d4d]" />} title="Bio & social links">
          <BioSocialSection
            bio={form.bio}
            location={form.location}
            socialLinks={form.socialLinks}
            onBioChange={(v) => setForm((prev) => ({ ...prev, bio: v }))}
            onLocationChange={(v) => setForm((prev) => ({ ...prev, location: v }))}
            onSocialLinkChange={updateSocialLink}
          />
        </SettingsSectionCard>

        <SettingsSectionCard icon={<ShieldCheck size={18} className="text-[#4d4d4d]" />} title="Security & preferences">
          <div className="space-y-8">
            <PasswordSection
              value={passwords}
              onChange={(field, value) => setPasswords((prev) => ({ ...prev, [field]: value }))}
            />
            <TwoFactorSection
              enabled={form.twoFactorEnabled}
              onToggle={(enabled) => setForm((prev) => ({ ...prev, twoFactorEnabled: enabled }))}
            />
            <NotificationPreferencesSection preferences={form.notifications} onChange={updateNotification} />
          </div>
        </SettingsSectionCard>

        <FormActions onCancel={handleCancel} onPreview={handlePreview} onSave={handleSave} isSaving={isSaving} />
      </div>

      <div className="space-y-6">
        <ProfilePreviewCard data={form} />
        <AccountStatusCard status={accountStatus} />
        <SecurityTipsCard />
        <QuickLinksCard username={form.username} />
        <KeepItUpBanner percentile={12} />
      </div>
    </div>
  );
}