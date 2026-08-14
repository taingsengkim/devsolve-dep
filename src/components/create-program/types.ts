import type { LucideIcon } from "lucide-react";
import type { AssetType, SeverityLevel } from "@/lib/types/programs/types";

export type ProgramType = "RESPONSE" | "BOUNTY";
export type ProgramVisibility = "PUBLIC" | "PRIVATE" | "INVITE_ONLY";
export type ProgramStatus = "DRAFT" | "SCHEDULED" | "OPEN";

export interface ScopeTarget {
  id: string;
  backendId?: string;
  backendAssetType?: AssetType;
  type: string;
  target: string;
  description: string;
  maxSeverity?: SeverityLevel;
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
