import type {
  PriorityReviewItem,
  ReviewQueueLane,
} from "@/components/report-management/review-queue/types";

export const REVIEW_QUEUE_LANES: ReviewQueueLane[] = [
  {
    title: "Pending Intake",
    count: 20,
    description: "New submissions waiting for first-pass moderation and scope validation.",
    accent: "amber",
  },
  {
    title: "Under Review",
    count: 5,
    description: "Analysts are checking evidence quality, impact, and report completeness.",
    accent: "blue",
  },
  {
    title: "Approval Ready",
    count: 8,
    description: "Reports cleared for final sign-off, payout confirmation, or closure.",
    accent: "emerald",
  },
];

export const PRIORITY_REVIEW_ITEMS: PriorityReviewItem[] = [
  {
    id: 1,
    title: "TikTok Security Bug Bounty",
    severity: "Critical",
    reporter: "Seng Songhuor",
    submittedAt: "Jul 29, 2026",
    queue: "Pending Intake",
    status: "Needs scope validation",
    assets: ["api.tiktok.com", "Android App"],
  },
  {
    id: 6,
    title: "TikTok Mobile App Token Exchange",
    severity: "Critical",
    reporter: "Seng Songhuor",
    submittedAt: "Jul 28, 2026",
    queue: "Under Review",
    status: "Awaiting severity confirmation",
    assets: ["Android App", "auth.tiktok.com"],
  },
  {
    id: 9,
    title: "TikTok Public API Partner Sandbox",
    severity: "High",
    reporter: "Seng Songhuor",
    submittedAt: "Jul 28, 2026",
    queue: "Under Review",
    status: "Evidence review in progress",
    assets: ["sandbox-api.tiktok.com", "Partner Sandbox"],
  },
  {
    id: 3,
    title: "TikTok Creator Commerce APIs",
    severity: "Medium",
    reporter: "Seng Songhuor",
    submittedAt: "Jul 27, 2026",
    queue: "Approval Ready",
    status: "Waiting analyst notes",
    assets: ["commerce-api.tiktok.com", "Partner Portal"],
  },
];
