import { baseApi } from "./baseApi";
import type { Page } from "./showcasesApi";
import type {
  CreateProblemRequest,
  ProblemStatus,
  SdlcPhase,
} from "@/lib/validations/problem";

export type { ProblemStatus };

/** Query parameters `findPublished` accepts. */
export interface ProblemFeedParams {
  categoryId?: string;
  sdlcPhase?: SdlcPhase;
  tag?: string;
  technology?: string;
  /** Zero-based, matching Spring's own paging on this controller. */
  page?: number;
  size?: number;
  /** `property,(asc|desc)` — defaults to `publishedAt,DESC` upstream. */
  sort?: string;
}

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

    /** GET /api/problems/{id} -> GET /api/v1/problems/{id}. */
    getProblemById: builder.query<ProblemResponse, string>({
      query: (id) => `/problems/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Problem", id }],
    }),

    /**
     * DELETE /api/problems/{id} — the author withdrawing their own problem.
     * A soft delete upstream, so the record survives but stops being served.
     */
    deleteProblem: builder.mutation<void, string>({
      query: (id) => ({ url: `/problems/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Problem", id },
        { type: "Problem", id: "LIST" },
        { type: "Problem", id: "MINE" },
        { type: "Discussion", id: "LIST" },
      ],
    }),

    /** GET /api/problems -> the published feed. Approved problems only. */
    getProblems: builder.query<Page<ProblemResponse>, ProblemFeedParams | void>({
      query: (args) => {
        // Undefined entries are dropped so RTK Query's cache keys stay stable.
        const params: Record<string, string> = {};
        for (const [key, value] of Object.entries(args ?? {})) {
          if (value !== undefined && value !== "") params[key] = String(value);
        }
        return { url: "/problems", params };
      },
      providesTags: [{ type: "Problem", id: "LIST" }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateProblemMutation,
  useGetProblemByIdQuery,
  useGetProblemsQuery,
  useDeleteProblemMutation,
} = problemsApi;
