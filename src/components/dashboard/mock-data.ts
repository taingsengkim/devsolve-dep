import type {
  DashboardProject,
  DashboardStatusFilter,
  DashboardVisibleColumn,
} from "@/components/dashboard/types";

export const DASHBOARD_PROJECTS: DashboardProject[] = [
  {
    id: "ops-101",
    name: "TikTok Trust Surface",
    repository: "github.com/devsolve/tiktok-trust-surface",
    team: "Triage Cell Alpha",
    tech: "Next.js",
    createdAt: "Jul 12, 2026",
    contributors: [
      { name: "Elena Vasquez", fallback: "EV", tone: "bg-blue-100 text-blue-700" },
      { name: "Marcus Okonkwo", fallback: "MO", tone: "bg-emerald-100 text-emerald-700" },
      { name: "Priya Nambiar", fallback: "PN", tone: "bg-amber-100 text-amber-700" },
    ],
    status: { text: "Active", variant: "active" },
  },
  {
    id: "ops-102",
    name: "Meta Account Recovery",
    repository: "github.com/devsolve/meta-account-recovery",
    team: "Response Desk",
    tech: "TypeScript",
    createdAt: "Jul 09, 2026",
    contributors: [
      { name: "Aisha Kamara", fallback: "AK", tone: "bg-violet-100 text-violet-700" },
      { name: "Daniel Chen", fallback: "DC", tone: "bg-slate-200 text-slate-700" },
    ],
    status: { text: "Reviewing", variant: "reviewing" },
  },
  {
    id: "ops-103",
    name: "Discord Creator Safeguards",
    repository: "github.com/devsolve/discord-creator-safeguards",
    team: "Policy Ops",
    tech: "React",
    createdAt: "Jul 05, 2026",
    contributors: [
      { name: "Tom Reinholt", fallback: "TR", tone: "bg-cyan-100 text-cyan-700" },
      { name: "Seng Songhuor", fallback: "SS", tone: "bg-blue-100 text-blue-700" },
      { name: "Nika Daro", fallback: "ND", tone: "bg-rose-100 text-rose-700" },
    ],
    status: { text: "Active", variant: "active" },
  },
  {
    id: "ops-104",
    name: "Stripe Merchant Escalation",
    repository: "github.com/devsolve/stripe-merchant-escalation",
    team: "Fraud Research",
    tech: "Node.js",
    createdAt: "Jul 01, 2026",
    contributors: [
      { name: "Kanya Sok", fallback: "KS", tone: "bg-orange-100 text-orange-700" },
      { name: "Sara Kim", fallback: "SK", tone: "bg-lime-100 text-lime-700" },
    ],
    status: { text: "On Hold", variant: "onHold" },
  },
  {
    id: "ops-105",
    name: "GitHub Secrets Watchtower",
    repository: "github.com/devsolve/github-secrets-watchtower",
    team: "Platform Shield",
    tech: "Go",
    createdAt: "Jun 28, 2026",
    contributors: [
      { name: "Lina Chhoeun", fallback: "LC", tone: "bg-fuchsia-100 text-fuchsia-700" },
      { name: "Dara Meas", fallback: "DM", tone: "bg-sky-100 text-sky-700" },
      { name: "Rithy Nov", fallback: "RN", tone: "bg-emerald-100 text-emerald-700" },
      { name: "Jane Lee", fallback: "JL", tone: "bg-slate-200 text-slate-700" },
    ],
    status: { text: "Reviewing", variant: "reviewing" },
  },
  {
    id: "ops-106",
    name: "Cloudflare Access Audit",
    repository: "github.com/devsolve/cloudflare-access-audit",
    team: "Core Infrastructure",
    tech: "Rust",
    createdAt: "Jun 24, 2026",
    contributors: [
      { name: "Borin Phan", fallback: "BP", tone: "bg-indigo-100 text-indigo-700" },
      { name: "Malis Heng", fallback: "MH", tone: "bg-teal-100 text-teal-700" },
    ],
    status: { text: "Active", variant: "active" },
  },
];

export const DASHBOARD_COLUMNS: {
  key: DashboardVisibleColumn;
  label: string;
}[] = [
  { key: "name", label: "Project" },
  { key: "repository", label: "Repository" },
  { key: "team", label: "Team" },
  { key: "tech", label: "Stack" },
  { key: "createdAt", label: "Created" },
  { key: "contributors", label: "Contributors" },
  { key: "status", label: "Status" },
];

export const DASHBOARD_STATUS_OPTIONS: {
  label: string;
  value: DashboardStatusFilter;
}[] = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Reviewing", value: "reviewing" },
  { label: "On hold", value: "onHold" },
];
