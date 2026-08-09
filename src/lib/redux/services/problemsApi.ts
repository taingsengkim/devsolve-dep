import { baseApi } from "./baseApi";
import type { Page } from "./showcasesApi";
import type {
  CreateProblemRequest,
  ProblemSeverity,
  ProblemStatus,
  ProblemType,
  SdlcPhase,
} from "@/lib/validations/problem";

export type { ProblemSeverity, ProblemStatus, ProblemType };

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
  displayName?: string;
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
  /** The upstream field. `fileName` was the old, wrong name for it. */
  originalFileName?: string;
  downloadUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedBy?: string;
  createdAt?: string;
}

/** `EnvironmentSummary` — where the problem was seen, as opposed to what it uses. */
export interface EnvironmentSummary {
  technology?: string;
  version?: string;
}

/** Mirrors the backend `ProblemResponse` returned after submission. */
export interface ProblemResponse {
  id?: string;
  author?: AuthorSummary;
  category?: CategorySummary;
  title?: string;
  description?: string;
  problemType?: ProblemType;
  sdlcPhase?: SdlcPhase;
  severity?: ProblemSeverity;
  expectedBehavior?: string;
  actualBehavior?: string;
  reproductionSteps?: string[];
  environment?: EnvironmentSummary[];
  attemptsTried?: string;
  errorMessage?: string;
  repositoryUrl?: string;
  status?: ProblemStatus;
  viewCount?: number;
  technologies?: TechnologySummary[];
  tags?: TagSummary[];
  attachments?: AttachmentSummary[];
  contentWarnings?: string[];
  /* Counts and viewer state the detail response carries, so a page that has
     the problem does not have to fetch them a second time. */
  solutionCount?: number;
  commentCount?: number;
  voteScore?: number;
  bookmarkCount?: number;
  acceptedSolutionId?: string;
  isBookmarkedByViewer?: boolean;
  viewerVote?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canAcceptSolution?: boolean;
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

    /**
     * PUT /api/problems/{problemId}/accepted-solution — the asker marking one
     * answer as the one that worked. Only the problem's author may do it, and
     * the backend is what enforces that.
     */
    setAcceptedSolution: builder.mutation<
      ProblemResponse,
      { problemId: string; solutionId: string }
    >({
      query: ({ problemId, solutionId }) => ({
        url: `/problems/${problemId}/accepted-solution`,
        method: "PUT",
        body: { solutionId },
      }),
      invalidatesTags: (_result, _error, { problemId }) => [
        { type: "Problem", id: problemId },
        { type: "Solution", id: problemId },
      ],
    }),

    /** DELETE of the same — un-accepting an answer. */
    removeAcceptedSolution: builder.mutation<ProblemResponse, string>({
      query: (problemId) => ({
        url: `/problems/${problemId}/accepted-solution`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, problemId) => [
        { type: "Problem", id: problemId },
        { type: "Solution", id: problemId },
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
  useSetAcceptedSolutionMutation,
  useRemoveAcceptedSolutionMutation,
} = problemsApi;
