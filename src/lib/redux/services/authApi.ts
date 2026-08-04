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

export interface RegisterCompanyRequest {
  fullName: string;
  jobTitle: string;
  email: string;
  password?: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  country: string;
  reason: string;
}

export interface RegisterCompanyResponse {
  success: boolean;
  message?: string;
  company?: {
    id: string;
    companyName: string;
    email: string;
  };
}

// ── API slice ──────────────────────────────────────────────────────────────

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
      queryFn: async (body) => {
        // Mock successful company registration (backend endpoint TBD)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: {
            success: true,
            message: "Company registration submitted successfully!",
            company: {
              id: `cmp_${Date.now()}`,
              companyName: body.companyName,
              email: body.email,
            },
          },
        };
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useRegisterUserMutation, useRegisterCompanyMutation } = authApi;
