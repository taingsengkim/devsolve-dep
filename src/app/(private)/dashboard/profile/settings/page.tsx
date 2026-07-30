"use client";

import Breadcrumb from "@/components/profile/settings/Breadcrumb";
import EditProfileForm from "@/components/profile/settings/EditProfileForm";
import {
  useGetProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
} from "@/lib/redux/services/profileApi";

export default function EditProfileSettingsPage() {
  const { data, isLoading } = useGetProfileSettingsQuery();
  const [updateProfileSettings] = useUpdateProfileSettingsMutation();

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const { formData, accountStatus } = data;

  const handleSave = async (updatedData: typeof formData) => {
    await updateProfileSettings({ formData: updatedData });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-sm font-semibold text-slate-500 tracking-tight mb-1">Settings</h1>
        <Breadcrumb
          items={[
            { label: "Profile", href: `/dashboard/profile/${formData.username}` },
            { label: "Edit profile" },
          ]}
        />
      </div>

      <EditProfileForm
        initialData={formData}
        accountStatus={accountStatus}
        onSave={handleSave}
      />
    </div>
  );
}
