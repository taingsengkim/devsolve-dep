import Breadcrumb from "@/components/profile/settings/Breadcrumb";
import EditProfileForm from "@/components/profile/settings/EditProfileForm";
import { mockEditProfileFormData, mockAccountStatus } from "@/lib/types/profile/mock-data";

export default function EditProfileSettingsPage() {
  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Profile", href: `/dashboard/profile/${mockEditProfileFormData.username}` },
          { label: "Edit profile" },
        ]}
      />
      <EditProfileForm initialData={mockEditProfileFormData} accountStatus={mockAccountStatus} />
    </div>
  );
}
