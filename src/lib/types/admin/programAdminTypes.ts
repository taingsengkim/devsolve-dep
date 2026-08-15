import { PaginatedResponse } from "./types";

/**
 * `NOT_SUBMITTED` is what a program carries before it is ever sent for review.
 * It was missing here while the checked-in OpenAPI snapshot still predated it,
 * which made a never-submitted draft look like it had no review status at all.
 */
export type ProgramSubmissionState =
  | "NOT_SUBMITTED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED";
export type ProgramState = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED";
export type ProgramEngagementType = "BOUNTY" | "RESPONSE";
export type ProgramVisibility = "PUBLIC" | "PRIVATE" | "INVITE_ONLY";

export interface ProgramManagementSummaryItem {
  id: string;
  organizationId?: string;
  organizationName?: string;
  handle: string;
  name: string;
  description?: string;
  engagementType: ProgramEngagementType;
  state: ProgramState;
  submissionState: ProgramSubmissionState;
  visibility: ProgramVisibility;
  offersBounties?: boolean;
  minimumBounty?: number;
  maximumBounty?: number;
  rejectionReason?: string | null;
  assets?: Array<{
    id?: string;
    assetType?: string;
    identifier?: string;
    description?: string;
    isInScope?: boolean;
    maxSeverity?: string;
  }>;
  inScopeAssets?: Array<{ identifier?: string; target?: string }>;
  createdAt: string;
  updatedAt?: string;
}

export type PageProgramManagementSummaryResponseDto = PaginatedResponse<ProgramManagementSummaryItem>;

export interface ProgramRejectionRequest {
  reason: string;
}

export interface GetAdminProgramsParams {
  submissionState?: ProgramSubmissionState;
  state?: ProgramState;
  search?: string;
  page?: number;
  size?: number;
  sort?: string | string[];
}
