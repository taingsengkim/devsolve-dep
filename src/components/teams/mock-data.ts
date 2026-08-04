import type { RoleFilter, StatusFilter, TeamMember } from "@/components/teams/types";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Elena Vasquez",
    email: "elena@cloudvault.io",
    avatar: "/image1.jpg",
    role: "Manager",
    status: "Active",
    joined: "Jan 12, 2023",
  },
  {
    id: 2,
    name: "Marcus Okonkwo",
    email: "marcus@cloudvault.io",
    avatar: "/image2.jpg",
    role: "Member",
    status: "Active",
    joined: "Feb 3, 2023",
  },
  {
    id: 3,
    name: "Priya Nambiar",
    email: "priya@cloudvault.io",
    avatar: "/image3.jpg",
    role: "Member",
    status: "Active",
    joined: "Mar 19, 2023",
  },
  {
    id: 4,
    name: "Tom Reinholt",
    email: "tom@cloudvault.io",
    avatar: "/image4.jpg",
    role: "Viewer",
    status: "Active",
    joined: "Apr 7, 2023",
  },
  {
    id: 5,
    name: "Aisha Kamara",
    email: "aisha@cloudvault.io",
    avatar: "/image5.jpg",
    role: "Member",
    status: "Pending",
    joined: "May 22, 2023",
  },
  {
    id: 6,
    name: "Daniel Chen",
    email: "daniel@cloudvault.io",
    avatar: "/image6.jpg",
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
