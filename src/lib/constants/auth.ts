import {
  ShieldCheck,
  Lock,
  Trophy,
  Users,
  PlusCircle,
  Inbox,
  BarChart3,
  UserCheck,
  LucideIcon,
} from "lucide-react";
import type { CountryOption } from "@/lib/redux/services/geoApi";

export const DEFAULT_COUNTRIES: CountryOption[] = [
  { name: "Cambodia", code: "kh" },
  { name: "United States", code: "us" },
  { name: "United Kingdom", code: "gb" },
  { name: "Vietnam", code: "vn" },
  { name: "Thailand", code: "th" },
  { name: "Singapore", code: "sg" },
  { name: "Japan", code: "jp" },
  { name: "Australia", code: "au" },
  { name: "Canada", code: "ca" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "India", code: "in" },
  { name: "Indonesia", code: "id" },
  { name: "Malaysia", code: "my" },
  { name: "Philippines", code: "ph" },
  { name: "South Korea", code: "kr" },
];

export const JOB_TITLES = [
  "CTO / VP Engineering",
  "Security Lead / CISO",
  "Software Engineer",
  "IT Manager",
  "IT Company",
  "Security Researcher",
  "Product Manager",
  "Other",
];

export const INDUSTRIES = [
  "Software & Technology",
  "Financial Services",
  "Healthcare & Biotech",
  "E-Commerce & Retail",
  "Government & Public Sector",
  "Telecommunications",
  "Other",
];

export const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

export const REASONS = [
  "Launch a Bug Bounty Program",
  "Vulnerability Disclosure (VDP)",
  "Penetration Testing",
  "Security Assessment & Compliance",
  "Other",
];

export interface FeatureItem {
  icon: LucideIcon;
  text: string;
}

export const USER_FEATURES: FeatureItem[] = [
  { icon: ShieldCheck, text: "Discover & report bug bounty programs" },
  { icon: Lock, text: "Access private and public vulnerability programs" },
  { icon: Trophy, text: "Build security reputation & earn financial rewards" },
  { icon: Users, text: "Connect with a global security researcher community" },
];

export const COMPANY_FEATURES: FeatureItem[] = [
  { icon: PlusCircle, text: "Create & manage custom bug bounty programs" },
  { icon: Inbox, text: "Receive, triage, and manage vulnerability reports" },
  { icon: BarChart3, text: "Track program performance & security metrics" },
  { icon: UserCheck, text: "Manage security team access & submissions" },
];
