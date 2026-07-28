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

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      queryFn: async (body) => {
        // Mock successful user registration or API integration
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
  }),
});

export const { useRegisterUserMutation } = authApi;
