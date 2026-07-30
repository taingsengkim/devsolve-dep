"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { User2, Globe, Lock, Bell } from "lucide-react";
import { EditProfileFormData, AccountStatus } from "@/lib/types/profile/types";
import { useEditProfileForm } from "@/hooks/profile/useEditProfileForm";
import SettingsNav from "./SettingsNav";
import PhotoUpload from "./PhotoUpload";
import PersonalInfoSection from "./PersonalInfoSection";
import BioSocialSection from "./BioSocialSection";
import PasswordSection, { PasswordFormState } from "./PasswordSection";
import TwoFactorSection from "./TwoFactorSection";
import NotificationPreferencesSection from "./NotificationPreferencesSection";
import SettingsSectionCard from "./SettingsSectionCard";
import FormActions from "./FormActions";

interface EditProfileFormProps {
  initialData: EditProfileFormData;
  accountStatus: AccountStatus;
  onSave?: (data: EditProfileFormData & { passwords: PasswordFormState }) => Promise<void> | void;
}

export default function EditProfileForm({ initialData, accountStatus, onSave }: EditProfileFormProps) {
  const [activeSection, setActiveSection] = useState("personal-info");
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
    handlePreview,
  } = useEditProfileForm({ initialData, onSave });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col md:flex-row gap-8 items-start"
    >
      <div className="md:sticky md:top-24 self-start">
        <SettingsNav activeId={activeSection} onSelect={setActiveSection} />
      </div>

      <div className="flex-1 space-y-6 w-full min-w-0">
        <div id="personal-info">
          <SettingsSectionCard icon={<User2 size={18} className="text-slate-500" />} title="Personal Information">
            <PhotoUpload avatarInitials={form.avatarInitials} avatarUrl="/justin.png" />
            <PersonalInfoSection
              data={{ fullName: form.fullName, username: form.username, email: form.email }}
              onChange={updateField}
            />
          </SettingsSectionCard>
        </div>

        <div id="bio-social">
          <SettingsSectionCard icon={<Globe size={18} className="text-slate-500" />} title="Bio & Social Links">
            <BioSocialSection
              bio={form.bio}
              location={form.location}
              socialLinks={form.socialLinks}
              onBioChange={(v) => setForm((prev) => ({ ...prev, bio: v }))}
              onLocationChange={(v) => setForm((prev) => ({ ...prev, location: v }))}
              onSocialLinkChange={updateSocialLink}
            />
          </SettingsSectionCard>
        </div>

        <div id="password">
          <SettingsSectionCard icon={<Lock size={18} className="text-slate-500" />} title="Change Password">
            <PasswordSection
              value={passwords}
              onChange={(field, value) => setPasswords((prev) => ({ ...prev, [field]: value }))}
            />
          </SettingsSectionCard>
        </div>

        <div id="preferences">
          <SettingsSectionCard icon={<Bell size={18} className="text-slate-500" />} title="Preferences & Security">
            <div className="space-y-8">
              <TwoFactorSection
                enabled={form.twoFactorEnabled}
                onToggle={(enabled) => setForm((prev) => ({ ...prev, twoFactorEnabled: enabled }))}
              />
              <NotificationPreferencesSection preferences={form.notifications} onChange={updateNotification} />
            </div>
          </SettingsSectionCard>
        </div>

        <FormActions onCancel={handleCancel} onPreview={handlePreview} onSave={handleSave} isSaving={isSaving} />
      </div>
    </motion.div>
  );
}