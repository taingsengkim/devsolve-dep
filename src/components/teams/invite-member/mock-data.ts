import type { InviteRoleOption } from "@/components/teams/invite-member/types";

export const INVITE_ROLE_OPTIONS: InviteRoleOption[] = [
  {
    role: "MANAGER",
    title: "Manager",
    description: "Can manage members, reports, and organization settings.",
    access: "Manage members, reports, and settings",
    caution: "Should be assigned carefully",
  },
  {
    role: "MEMBER",
    title: "Member",
    description: "Can work with programs and reports and collaborate with the organization team.",
    access: "Collaborate on programs and reports",
    caution: "Recommended default role",
  },
  {
    role: "VIEWER",
    title: "Viewer",
    description: "Read-only access suitable for stakeholders or observers.",
    access: "Read-only access",
  },
];
