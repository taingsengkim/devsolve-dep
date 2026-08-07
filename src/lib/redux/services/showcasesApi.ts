import { baseApi } from "./baseApi";

/* ── Request / response shapes, mirroring the backend schemas ──────────── */

/** `CreateShowCasesRequest`. Only `title` and `overview` are required. */
export interface CreateShowcaseRequest {
  categoryId?: string;
  title: string;
  overview: string;
  coverImageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
}

/** `CreateShowcaseStepRequest`. `stepNumber` is 1-based and set by position. */
export interface CreateShowcaseStepRequest {
  stepNumber: number;
  title: string;
  description: string;
  codeSnippet?: string;
  imageUrl?: string;
  diagramUrl?: string;
}

/** `ShowcaseStepResponse`. */
export interface ShowcaseStepResponse {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  codeSnippet?: string;
  imageUrl?: string;
  diagramUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** `ShowCasesResponse`. */
export interface ShowcaseResponse {
  id: string;
  authorId: string;
  authorName: string;
  categoryId?: string;
  categoryName?: string;
  title: string;
  overview: string;
  coverImageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  videoUrl?: string;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED";
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  steps?: ShowcaseStepResponse[];
}

/**
 * Where a selected image is sent so the form can hold a URL rather than a File.
 *
 * NOTE: this endpoint does not exist in the OpenAPI spec yet — the only
 * multipart route the backend publishes is `POST /problems/{id}/attachments`,
 * which is scoped to a problem and returns a download handle rather than a
 * public URL. Until a general upload lands, calls here fail and the image
 * fields fall back to pasting a URL. Point `UPLOAD_URL` at the real route and
 * the upload path works with no other change.
 */
const UPLOAD_URL = "/uploads/images";

export interface UploadedImage {
  url: string;
}

export const showcasesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** POST /api/v1/showcases — creates the showcase shell, without steps. */
    createShowcase: builder.mutation<ShowcaseResponse, CreateShowcaseRequest>({
      query: (body) => ({
        url: "/showcases",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Showcase"],
    }),

    /**
     * POST /api/v1/showcase-steps/{showcaseId} — one call per step. The API
     * takes no bulk variant, so the form posts these in order after the
     * showcase itself exists.
     */
    createShowcaseStep: builder.mutation<
      ShowcaseStepResponse,
      { showcaseId: string; body: CreateShowcaseStepRequest }
    >({
      query: ({ showcaseId, body }) => ({
        url: `/showcase-steps/${showcaseId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Showcase"],
    }),

    /** Uploads one image and resolves to its hosted URL. See `UPLOAD_URL`. */
    uploadShowcaseImage: builder.mutation<UploadedImage, File>({
      query: (file) => {
        const body = new FormData();
        body.append("file", file);

        // No explicit Content-Type: the browser has to set the multipart
        // boundary itself, and naming the header here would strip it.
        return { url: UPLOAD_URL, method: "POST", body };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateShowcaseMutation,
  useCreateShowcaseStepMutation,
  useUploadShowcaseImageMutation,
} = showcasesApi;
