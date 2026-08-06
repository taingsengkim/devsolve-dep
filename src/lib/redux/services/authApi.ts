import { baseApi } from "./baseApi";

// ── Request / Response shapes ──────────────────────────────────────────────

/**
 * POST /api/v1/auth/register — request body.
 * Matches the backend RegisterRequest exactly.
 */
export interface RegisterUserRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  accountType?: "USER" | "COMPANY" | "ADMIN";
}

/**
 * POST /api/v1/auth/register — 201 response body.
 */
export interface RegisterUserResponse {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountType: "USER" | "COMPANY" | "ADMIN";
}

// ── Legacy interfaces kept for backward-compat with existing UI forms ──────

/** @deprecated Use RegisterUserRequest directly */
export interface RegisterUserFormData {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  country?: string;
  role?: "user" | "company";
}

export interface RegisterUserResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
  };
}

// Real response shape of POST /api/v1/auth/register (per the live OpenAPI spec).
// Note: `country` isn't accepted by this endpoint — the backend's RegisterRequest
// has no such field, so it's dropped here (settable later via profile edit).
interface RegisterApiResponse {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  accountType?: "USER" | "COMPANY" | "ADMIN";
}

export type IndustryEnum =
  | "TECHNOLOGY"
  | "FINANCE"
  | "HEALTHCARE"
  | "ECOMMERCE"
  | "GOVERNMENT"
  | "EDUCATION"
  | "OTHER";

export type CompanySizeEnum =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";

export interface RegisterCompanyRequest {
  fullName: string;
  jobTitle: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite: string;
  industry: IndustryEnum;
  companySize: CompanySizeEnum;
  country: string;
  joiningReason: string;
}

/** Shape returned by POST /api/v1/organizations/register (OrganizationResponse schema) */
export interface RegisterCompanyApiResponse {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  domain: string;
  websiteUrl: string;
  logoUrl: string | null;
  description: string | null;
  industry: IndustryEnum;
  companySize: string;
  country: string;
  /** API returns ACTIVE (not APPROVED) once approved */
  status: "PENDING" | "ACTIVE" | "REJECTED";
  submissionVersion: number;
  rejectionReason: string | null;
  reviewedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterCompanyResponse {
  success: boolean;
  message?: string;
  organization?: RegisterCompanyApiResponse;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Register a new user account.
     * POST /api/v1/auth/register
     */
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    registerCompany: builder.mutation<RegisterCompanyResponse, RegisterCompanyRequest>({
      query: (body) => ({
        url: "/organizations/register",
        method: "POST",
        body,
      }),
      transformResponse: (raw: RegisterCompanyApiResponse): RegisterCompanyResponse => ({
        success: true,
        message: "Company registration submitted successfully! Your application is under review.",
        organization: raw,
      }),
      invalidatesTags: ["Organization"],
    }),
  }),
  overrideExisting: true,
});

export const { useRegisterUserMutation, useRegisterCompanyMutation } = authApi;
