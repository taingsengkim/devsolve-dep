"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User2, Globe, Lock, Bell } from "lucide-react";
import { EditProfileFormData, AccountStatus } from "@/lib/types/profile/types";
import { useEditProfileForm } from "@/hooks/profile/useEditProfileForm";
import SettingsTab from "./SettingsTab";
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
    <div className="space-y-6 w-full">
      <SettingsTab activeId={activeSection} onSelect={setActiveSection} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeSection === "personal-info" && (
            <SettingsSectionCard icon={<User2 size={18} className="text-slate-500" />} title="Personal Information">
              <PhotoUpload avatarInitials={form.avatarInitials} avatarUrl="/justin.png" />
              <PersonalInfoSection
                data={{ fullName: form.fullName, username: form.username, email: form.email }}
                onChange={updateField}
              />
            </SettingsSectionCard>
          )}

          {activeSection === "bio-social" && (
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
          )}

          {activeSection === "password" && (
            <SettingsSectionCard icon={<Lock size={18} className="text-slate-500" />} title="Change Password">
              <PasswordSection
                value={passwords}
                onChange={(field, value) => setPasswords((prev) => ({ ...prev, [field]: value }))}
              />
            </SettingsSectionCard>
          )}

          {activeSection === "preferences" && (
            <SettingsSectionCard icon={<Bell size={18} className="text-slate-500" />} title="Preferences & Security">
              <div className="space-y-8">
                <TwoFactorSection
                  enabled={form.twoFactorEnabled}
                  onToggle={(enabled) => setForm((prev) => ({ ...prev, twoFactorEnabled: enabled }))}
                />
                <NotificationPreferencesSection preferences={form.notifications} onChange={updateNotification} />
              </div>
            </SettingsSectionCard>
          )}

          <FormActions onCancel={handleCancel} onPreview={handlePreview} onSave={handleSave} isSaving={isSaving} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}