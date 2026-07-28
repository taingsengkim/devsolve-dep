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
      queryFn: async (body) => {
        // Mock successful user registration
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
          data: {
            success: true,
            message: "User account registered successfully!",
            user: {
              id: `usr_${Date.now()}`,
              username: body.username,
              email: body.email,
              fullName: body.fullName,
            },
          },
        };
      },
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
