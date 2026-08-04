import { baseApi } from "./baseApi";

export interface RegisterUserRequest {
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

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (body) => {
        const [firstName, ...rest] = body.fullName.trim().split(/\s+/).filter(Boolean);
        return {
          url: `/auth/register`,
          method: "POST",
          body: {
            username: body.username,
            email: body.email,
            password: body.password,
            confirmPassword: body.password,
            firstName: firstName || body.fullName,
            lastName: rest.join(" ") || undefined,
            accountType: body.role === "company" ? "COMPANY" : "USER",
          },
        };
      },
      transformResponse: (raw: RegisterApiResponse): RegisterUserResponse => ({
        success: true,
        message: "User account registered successfully!",
        user: {
          id: raw.userId,
          username: raw.username,
          email: raw.email,
          fullName: [raw.firstName, raw.lastName].filter(Boolean).join(" ") || raw.username,
        },
      }),
      invalidatesTags: ["User"],
    }),
    registerCompany: builder.mutation<RegisterCompanyResponse, RegisterCompanyRequest>({
      queryFn: async (body) => {
        // Mock successful company registration
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
