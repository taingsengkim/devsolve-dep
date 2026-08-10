import { PaginatedResponse } from "./types";

export type ProblemStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "PUBLISHED"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export type SdlcPhase =
  | "PLANNING"
  | "REQUIREMENTS_ANALYSIS"
  | "DESIGN"
  | "DEVELOPMENT"
  | "TESTING"
  | "DEPLOYMENT"
  | "MAINTENANCE";

export interface AuthorSummary {
  id: string;
  fullName: string;
  avatarUrl?: string;
  reputation?: number;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  scope?: "PROBLEM" | "SHOWCASE";
}

export interface TechnologySummary {
  id?: string;
  name: string;
  version?: string;
}

export interface TagSummary {
  id: string;
  name: string;
  slug: string;
}

export interface AttachmentSummary {
  id: string;
  fileName: string;
  downloadUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt?: string;
}

export interface ProblemResponse {
  id: string;
  author?: AuthorSummary;
  category?: CategorySummary;
  title: string;
  description?: string;
  sdlcPhase?: SdlcPhase;
  status: ProblemStatus;
  viewCount?: number;
  technologies?: TechnologySummary[];
  tags?: TagSummary[];
  attachments?: AttachmentSummary[];
  contentWarnings?: string[];
  publishedAt?: string;
  deletedAt?: string;
  version?: number;
  createdAt: string;
  updatedAt?: string;
}

export type PageProblemResponse = PaginatedResponse<ProblemResponse>;

export interface ProblemModerationRequest {
  status: ProblemStatus;
}

export interface GetAdminProblemsParams {
  status?: ProblemStatus;
  page?: number;
  size?: number;
  sort?: string[];
}
