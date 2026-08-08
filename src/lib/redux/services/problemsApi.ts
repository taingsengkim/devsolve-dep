import { baseApi } from "./baseApi";
import type {
  CreateProblemRequest,
  SdlcPhase,
} from "@/lib/validations/problem";

export type ProblemStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "PUBLISHED"
  | "RESOLVED"
  | "CLOSED"
  | "REJECTED";

export interface AuthorSummary {
  id?: string;
  fullName?: string;
  avatarUrl?: string;
  reputation?: number;
}

export interface CategorySummary {
  id?: string;
  name?: string;
  slug?: string;
  scope?: "PROBLEM" | "SHOWCASE";
}

export interface TechnologySummary {
  id?: string;
  name?: string;
  version?: string;
}

export interface TagSummary {
  id?: string;
  name?: string;
  slug?: string;
}

export interface AttachmentSummary {
  id?: string;
  fileName?: string;
  downloadUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt?: string;
}

/** Mirrors the backend `ProblemResponse` returned after submission. */
export interface ProblemResponse {
  id?: string;
  author?: AuthorSummary;
  category?: CategorySummary;
  title?: string;
  description?: string;
  sdlcPhase?: SdlcPhase;
  status?: ProblemStatus;
  viewCount?: number;
  technologies?: TechnologySummary[];
  tags?: TagSummary[];
  attachments?: AttachmentSummary[];
  contentWarnings?: string[];
  publishedAt?: string;
  deletedAt?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const problemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** POST /api/problems -> POST /api/v1/problems. */
    createProblem: builder.mutation<ProblemResponse, CreateProblemRequest>({
      query: (body) => ({ url: "/problems", method: "POST", body }),
      invalidatesTags: [{ type: "Discussion", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const { useCreateProblemMutation } = problemsApi;
