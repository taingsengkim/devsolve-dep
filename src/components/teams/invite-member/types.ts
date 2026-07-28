import type { MemberRole } from "@/components/teams/types";

export type InviteRoleOption = {
  role: MemberRole;
  title: string;
  description: string;
  access: string[];
};

export type PendingInvite = {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  sentAt: string;
};
