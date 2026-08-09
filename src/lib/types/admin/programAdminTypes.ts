import { PaginatedResponse } from "./types";

export type ProgramSubmissionState = "PENDING_REVIEW" | "APPROVED" | "REJECTED";
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
  page?: number;
  size?: number;
  sort?: string[];
}
