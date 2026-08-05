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

/** Shape returned by POST /api/v1/organizations/register */
export interface RegisterCompanyApiResponse {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  domain: string;
  websiteUrl: string;
  logoUrl: string;
  description: string;
  industry: IndustryEnum;
  companySize: string;
  country: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
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
      query: (body) => ({
        url: "/v1/organizations/register",
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
});

export const { useRegisterUserMutation, useRegisterCompanyMutation } = authApi;
