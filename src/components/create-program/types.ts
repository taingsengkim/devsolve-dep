import type { LucideIcon } from "lucide-react";

export type ProgramType = "RESPONSE" | "BOUNTY";
export type ProgramVisibility = "PUBLIC" | "PRIVATE";
export type ProgramStatus = "DRAFT" | "SCHEDULED" | "OPEN";

export interface ScopeTarget {
  id: string;
  type: string;
  target: string;
  description: string;
}

export interface StepItem {
  id: number;
  label: string;
  icon: LucideIcon;
}

export interface StepTip {
  title: string;
  text: string;
}
