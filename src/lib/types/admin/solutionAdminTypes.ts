import { PaginatedResponse } from "./types";

/**
 * The moderation view of a solution.
 *
 * Two different things were once conflated here under one `reviewStatus`:
 * a moderator letting an answer be seen at all, and the person who asked the
 * problem picking it as the one that worked. Upstream they are separate —
 * `moderation.status` and `isAccepted` — and only the first is a decision
 * anyone makes on this screen.
 */

/** What `UpdateSolutionReviewStatusRequest.reviewStatus` accepts. */
export type SolutionReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SolutionAuthor {
  id?: string;
  displayName?: string;
  avatarUrl?: string;
  reputation?: number;
}

export interface SolutionModerationDetails {
  revisionId?: string;
  revisionNumber?: number;
  status?: SolutionReviewStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface SolutionVerificationStep {
  instruction?: string;
  expectedResult?: string;
}

export interface SolutionTestedWith {
  technology?: string;
  version?: string;
}

export interface SolutionResource {
  id?: string;
  type?:
    | "DOCUMENTATION"
    | "REPOSITORY"
    | "VIDEO"
    | "DIAGRAM"
    | "DEMO"
    | "ARTICLE";
  label?: string;
  url?: string;
  displayOrder?: number;
}

export interface SolutionAttachment {
  id?: string;
  originalFileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  downloadUrl?: string;
}

export interface SolutionResponse {
  id: string;
  problemId?: string;
  author?: SolutionAuthor;
  summary?: string;
  bodyMarkdown?: string;
  approachType?: "FIX" | "WORKAROUND" | "EXPLANATION" | "ALTERNATIVE";
  verificationSteps?: SolutionVerificationStep[];
  testedWith?: SolutionTestedWith[];
  tradeoffs?: string;
  resources?: SolutionResource[];
  attachments?: SolutionAttachment[];
  /** The asker's choice, not a moderator's. Read-only here. */
  isAccepted?: boolean;
  voteScore?: number;
  commentCount?: number;
  version?: number;
  moderation?: SolutionModerationDetails;
  createdAt: string;
  updatedAt?: string;
}

export type PageSolutionResponse = PaginatedResponse<SolutionResponse>;

export interface UpdateSolutionReviewStatusRequest {
  reviewStatus: SolutionReviewStatus;
  /** Capped at 2000 upstream, and only meaningful on a rejection. */
  rejectionReason?: string;
}

export interface GetAdminSolutionsParams {
  reviewStatus?: SolutionReviewStatus;
  pageNumber?: number;
  pageSize?: number;
}
