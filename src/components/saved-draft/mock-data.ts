import type { DraftCategory, SavedDraftItem } from "@/components/saved-draft/types";

export const SAVED_DRAFT_ITEMS: SavedDraftItem[] = [
  {
    id: "problem-1",
    title: "Business Logic Bugs",
    description:
      "Hour-long session on discovering business logic vulnerabilities in commerce workflows and wallet redemption paths.",
    category: "problem",
    tags: ["logic", "fintech", "ecommerce"],
    updatedAt: "2 hours ago",
    initials: "BL",
    logoSrc: "/Google.png",
    logoAlt: "Google logo",
  },
  {
    id: "problem-2",
    title: "Authorization Drift Notes",
    description:
      "Draft write-up covering unsafe role transitions, hidden admin actions, and weak ownership validation.",
    category: "problem",
    tags: ["auth", "web", "admin"],
    updatedAt: "5 hours ago",
    initials: "AD",
    logoSrc: "/microsoft.png",
    logoAlt: "Microsoft logo",
  },
  {
    id: "problem-3",
    title: "Checkout Coupon Abuse",
    description:
      "Reproduction details for stacking discount rules across guest checkout and loyalty conversion endpoints.",
    category: "problem",
    tags: ["payments", "logic", "retail"],
    updatedAt: "Yesterday",
    initials: "CA",
    logoSrc: "/netflix.png",
    logoAlt: "Netflix logo",
  },
  {
    id: "problem-4",
    title: "Tenant Boundary Gaps",
    description:
      "Cross-tenant access notes for organization switching, shared invite flows, and object lookups.",
    category: "problem",
    tags: ["saas", "idor", "api"],
    updatedAt: "Yesterday",
    initials: "TB",
    logoSrc: "/NexaCloude.png",
    logoAlt: "NexaCloude logo",
  },
  {
    id: "problem-5",
    title: "Invoice Reference Leak",
    description:
      "Draft impact narrative for predictable invoice references exposing metadata in billing exports.",
    category: "problem",
    tags: ["billing", "idor", "reporting"],
    updatedAt: "2 days ago",
    initials: "IR",
    logoSrc: "/Tesla.png",
    logoAlt: "Tesla logo",
  },
  {
    id: "problem-6",
    title: "Session Recovery Weakness",
    description:
      "Notes on incomplete session invalidation after password reset and recovery email confirmation.",
    category: "problem",
    tags: ["session", "account", "auth"],
    updatedAt: "3 days ago",
    initials: "SR",
    logoSrc: "/tiktok.png",
    logoAlt: "TikTok logo",
  },
  {
    id: "solution-1",
    title: "Validation Workflow Rewrite",
    description:
      "Saved response draft outlining how to validate business impact, collect evidence, and tighten scope language.",
    category: "solution",
    tags: ["triage", "workflow", "quality"],
    updatedAt: "1 hour ago",
    initials: "VW",
    logoSrc: "/Google.png",
    logoAlt: "Google logo",
  },
  {
    id: "solution-2",
    title: "Patch Suggestion Summary",
    description:
      "Structured recommendations for fixing permission checks in admin endpoints without breaking operator tooling.",
    category: "solution",
    tags: ["fix", "access", "backend"],
    updatedAt: "Today",
    initials: "PS",
    logoSrc: "/microsoft.png",
    logoAlt: "Microsoft logo",
  },
  {
    id: "solution-3",
    title: "Retest Checklist",
    description:
      "Draft checklist for verifying remediation, confirming no regression, and documenting accepted residual risk.",
    category: "solution",
    tags: ["retest", "qa", "review"],
    updatedAt: "2 days ago",
    initials: "RC",
    logoSrc: "/Tesla.png",
    logoAlt: "Tesla logo",
  },
  {
    id: "program-1",
    title: "Business Logic Bounty",
    description:
      "Draft submission prepared for a marketplace program focused on purchase flow abuse and bonus credit misuse.",
    category: "program",
    programDraftKind: "bounty",
    tags: ["bounty", "logic", "marketplace"],
    updatedAt: "Today",
    initials: "BB",
    logoSrc: "/tiktok.png",
    logoAlt: "TikTok logo",
  },
  {
    id: "program-2",
    title: "Moderation Queue Response",
    description:
      "Saved response draft for a staff follow-up requesting deeper proof on report reliability and exploit limits.",
    category: "program",
    programDraftKind: "response",
    tags: ["response", "follow-up", "evidence"],
    updatedAt: "Yesterday",
    initials: "MR",
    logoSrc: "/netflix.png",
    logoAlt: "Netflix logo",
  },
  {
    id: "program-3",
    title: "Partner API Scope Proposal",
    description:
      "Program draft mapping reachable assets, likely trust boundaries, and a first-pass testing plan.",
    category: "program",
    programDraftKind: "bounty",
    tags: ["scope", "api", "planning"],
    updatedAt: "3 days ago",
    initials: "PA",
    logoSrc: "/NexaCloude.png",
    logoAlt: "NexaCloude logo",
  },
];

export const SAVED_DRAFT_TAB_ORDER: DraftCategory[] = [
  "problem",
  "solution",
  "program",
  "report",
];
