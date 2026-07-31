"use client";

import Breadcrumb from "@/components/profile/settings/Breadcrumb";
import EditProfileForm from "@/components/profile/settings/EditProfileForm";
import {
  useGetEditProfileFormQuery,
  useGetAccountStatusQuery,
  useUpdateProfileMutation,
} from "@/lib/redux/services/profileApi";

export default function EditProfileSettingsPage() {
  const { data: initialData, isLoading: isLoadingForm } = useGetEditProfileFormQuery();
  const { data: accountStatus, isLoading: isLoadingStatus } = useGetAccountStatusQuery();
  const [updateProfile] = useUpdateProfileMutation();

  if (isLoadingForm || isLoadingStatus || !initialData || !accountStatus) {
    return <div className="p-6 text-sm text-slate-400">Loading profile settings...</div>;
  }

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Profile", href: `/dashboard/profile/${initialData.username}` },
          { label: "Edit profile" },
        ]}
      />
      <EditProfileForm
        initialData={initialData}
        accountStatus={accountStatus}
        onSave={async (data) => {
          const { passwords, ...profileData } = data;
          void passwords;
          await updateProfile(profileData).unwrap();
        }}
      />
    </div>
  );
}
