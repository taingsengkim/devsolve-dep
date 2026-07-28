export type MemberRole = "Manager" | "Member" | "Viewer";
export type MemberStatus = "Active" | "Pending";

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  joined: string;
};

export type RoleFilter = "All" | MemberRole;
export type StatusFilter = "All" | MemberStatus;

export type TeamCounts = {
  total: number;
  active: number;
  pending: number;
  managers: number;
  members: number;
  viewers: number;
};
