import type {
  InviteRoleOption,
  PendingInvite,
} from "@/components/teams/invite-member/types";

export const INVITE_ROLE_OPTIONS: InviteRoleOption[] = [
  {
    role: "Manager",
    title: "Manager",
    description: "Own member access, manage reports, and control workspace settings.",
    access: ["Manage members", "Approve role updates", "Review high-priority reports"],
  },
  {
    role: "Member",
    title: "Member",
    description: "Work inside active programs, collaborate on reports, and submit updates.",
    access: ["Handle assigned work", "Comment on investigations", "Upload findings"],
  },
  {
    role: "Viewer",
    title: "Viewer",
    description: "Read-only access for stakeholders who only need visibility.",
    access: ["View dashboard", "Monitor report progress", "No edit permissions"],
  },
];

export const PENDING_INVITES: PendingInvite[] = [
  {
    id: 1,
    name: "Aisha Kamara",
    email: "aisha@cloudvault.io",
    role: "Member",
    sentAt: "Today, 10:30 AM",
  },
  {
    id: 2,
    name: "Daniel Chen",
    email: "daniel@cloudvault.io",
    role: "Viewer",
    sentAt: "Yesterday, 4:10 PM",
  },
];
