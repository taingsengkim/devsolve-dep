import type { RoleFilter, StatusFilter, TeamMember } from "@/components/teams/types";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Elena Vasquez",
    email: "elena@cloudvault.io",
    role: "Manager",
    status: "Active",
    joined: "Jan 12, 2023",
  },
  {
    id: 2,
    name: "Marcus Okonkwo",
    email: "marcus@cloudvault.io",
    role: "Member",
    status: "Active",
    joined: "Feb 3, 2023",
  },
  {
    id: 3,
    name: "Priya Nambiar",
    email: "priya@cloudvault.io",
    role: "Member",
    status: "Active",
    joined: "Mar 19, 2023",
  },
  {
    id: 4,
    name: "Tom Reinholt",
    email: "tom@cloudvault.io",
    role: "Viewer",
    status: "Active",
    joined: "Apr 7, 2023",
  },
  {
    id: 5,
    name: "Aisha Kamara",
    email: "aisha@cloudvault.io",
    role: "Member",
    status: "Pending",
    joined: "May 22, 2023",
  },
  {
    id: 6,
    name: "Daniel Chen",
    email: "daniel@cloudvault.io",
    role: "Viewer",
    status: "Active",
    joined: "Jul 14, 2023",
  },
];

export const ROLE_FILTERS: RoleFilter[] = [
  "All",
  "Manager",
  "Member",
  "Viewer",
];

export const STATUS_FILTERS: StatusFilter[] = ["All", "Active", "Pending"];
