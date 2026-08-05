import type {
  OrganizationInvitationPermission,
  OrganizationInvitationRole,
} from "@/lib/redux/services/organizationsApi";

export type InviteRoleOption = {
  role: OrganizationInvitationRole;
  title: string;
  eyebrow: string;
  description: string;
  access: string;
  caution?: string;
};

export type InvitePermissionOption = {
  value: OrganizationInvitationPermission;
  title: string;
  description: string;
};
