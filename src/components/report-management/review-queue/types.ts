export type ReviewQueueAccent = "amber" | "blue" | "emerald";

export type ReviewQueueLaneKey =
  | "Pending Intake"
  | "Under Review"
  | "Approval Ready";

export type ReviewQueueLaneFilter = "All" | ReviewQueueLaneKey;

export type ReviewSeverity = "Critical" | "High" | "Medium" | "Low";

export type ReviewQueueLane = {
  title: ReviewQueueLaneKey;
  count: number;
  description: string;
  accent: ReviewQueueAccent;
};

export type PriorityReviewItem = {
  id: number;
  title: string;
  severity: ReviewSeverity;
  reporter: string;
  submittedAt: string;
  queue: ReviewQueueLaneKey;
  status: string;
  assets: string[];
};
