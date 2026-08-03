export type EngagementType = "RESPONSE" | "MANAGED" | "BOUNTY" | "DISCOVERY";
export type ProgramState = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "ACTIVE";
export type ProgramType = "All" | "Bounty" | "Response";
export type SubmissionState = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
export type ProgramVisibility = "PUBLIC" | "PRIVATE";
export type AssetType = "WILDCARD" | "URL" | "CIDR" | "MOBILE" | "OTHER";
export type SeverityLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// 1. NEW INTERFACES FOR RULES & EXCLUSIONS
export interface RuleSection {
  description: string;
  rules: string[];
}

export interface ProgramAsset {
  id: string;
  assetType: AssetType;
  identifier: string;
  description: string;
  isInScope: boolean;
  maxSeverity: SeverityLevel;
}

export interface ProgramReward {
  id: string;
  severity: SeverityLevel;
  minAmount: number;
  maxAmount: number;
  points: number;
}

export interface Program {
  id: string;
  organizationId: string;
  handle: string;
  name: string;
  description: string;
  organizationName: string;
  engagementType: EngagementType;
  state: ProgramState;
  submissionState: SubmissionState;
  visibility: ProgramVisibility;
  policy: string;
  offersBounties: boolean;
  minimumBounty: number;
  maximumBounty: number;
  inScopeAssets: ProgramAsset[];
  rewards: ProgramReward[];
  createdAt: string;
  updatedAt: string;
}

// 2. UPDATED PROGRAM DETAIL
export interface ProgramDetail {
  id: string;
  organizationId: string;
  handle: string;
  name: string;
  description: string;
  organizationName: string;
  engagementType: EngagementType;
  state: ProgramState;
  submissionState: SubmissionState;
  visibility: ProgramVisibility;
  policy: string;
  offersBounties: boolean;
  proofOfConceptRequirements?: string | null;
  minimumBounty: number;
  maximumBounty: number;

  // Added Rules & Exclusions fields
  rulesOfEngagement?: RuleSection;
  exclusions?: RuleSection;

  assets: ProgramAsset[];
  rewards: ProgramReward[];
  createdAt: string;
  updatedAt: string;
}

// Spring Data Paginated Response
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GetProgramsParams {
  page?: number;
  size?: number;
  search?: string;
  engagementType?: string;
  state?: string;
}