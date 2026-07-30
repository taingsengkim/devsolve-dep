export type ReviewQueueLane = {
  title: string;
  count: number;
  description: string;
  accent: "amber" | "blue" | "emerald";
};

export type PriorityReviewItem = {
  id: number;
  title: string;
  severity: "Critical" | "High" | "Medium";
  reporter: string;
  submittedAt: string;
  status: string;
};
