import {
  LayoutDashboard,
  FileText,
  CircleDollarSign,
  Trophy,
  Bell,
  BookOpen,
  MessageSquare,
  Globe,
  Bookmark,
  BarChart3,
  PlusCircle,
  ClipboardList,
  Users,
  Building2,
  ShieldCheck,
  FileCheck,
  UserCheck,
  ShieldAlert,
  FilePen,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  roles?: string[];
  category?: "Overview" | "Researcher" | "Organization" | "Administration";
}

export const NAV_ITEMS: NavItem[] = [
  // Overview items
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["USER", "COMPANY", "ADMIN"], category: "Overview" },
  { name: "Programs", href: "/dashboard/programs", icon: Globe, roles: ["USER", "COMPANY", "ADMIN"], category: "Overview" },
  { name: "Community", href: "/dashboard/discussions", icon: MessageSquare, roles: ["USER", "COMPANY", "ADMIN"], category: "Overview" },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy, roles: ["USER", "COMPANY", "ADMIN"], category: "Overview" },

  // USER Role items
  { name: "Reports", href: "/dashboard/my-reports", icon: FileText, roles: ["USER"], category: "Researcher" },
  { name: "Rewards", href: "/dashboard/rewards", icon: CircleDollarSign, roles: ["USER"], category: "Researcher" },
  { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark, badge: 3, roles: ["USER"], category: "Researcher" },
  { name: "Saved Drafts", href: "/dashboard/saved-draft", icon: FilePen, roles: ["USER"], category: "Researcher" },

  // COMPANY Role items
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["COMPANY"], category: "Organization" },
   { name: "Program Management", href: "/dashboard/org-settings", icon: Building2, roles: ["COMPANY"], category: "Organization" },
  { name: "Create Program", href: "/dashboard/create-program", icon: PlusCircle, roles: ["COMPANY"], category: "Organization" },
  { name: "Saved Drafts", href: "/dashboard/saved-draft", icon: FilePen, roles: ["COMPANY"], category: "Organization" },
  { name: "Report Management", href: "/dashboard/report-management", icon: ClipboardList, roles: ["COMPANY"], category: "Organization" },
  { name: "Team Management", href: "/dashboard/team-management", icon: Users, roles: ["COMPANY"], category: "Organization" },
  { name: "Org Settings", href: "/dashboard/org-settings", icon: Building2, roles: ["COMPANY"], category: "Organization" },
 
  // ADMIN Role items
  { name: "Organization Verification", href: "/dashboard/company-verification", icon: ShieldCheck, roles: ["ADMIN"], category: "Administration" },
  { name: "Report Confirmation", href: "/dashboard/report-confirmation", icon: FileCheck, roles: ["ADMIN"], category: "Administration" },
  { name: "Users", href: "/dashboard/users", icon: UserCheck, roles: ["ADMIN"], category: "Administration" },
  { name: "Content Reports", href: "/dashboard/content-moderation", icon: ShieldAlert, roles: ["ADMIN"], category: "Administration" },
];
