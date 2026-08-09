import { PaginatedResponse } from "./types";

export type SolutionReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACCEPTED";

export interface SolutionResponse {
  id: string;
  problemId: string;
  authorId?: string;
  description: string;
  videoUrl?: string;
  diagramUrl?: string;
  reviewStatus: SolutionReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PageSolutionResponse = PaginatedResponse<SolutionResponse>;

export interface UpdateSolutionReviewStatusRequest {
  reviewStatus: SolutionReviewStatus;
  rejectionReason?: string;
}

export interface GetAdminSolutionsParams {
  reviewStatus?: SolutionReviewStatus;
  pageNumber?: number;
  pageSize?: number;
}
