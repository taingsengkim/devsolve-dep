import { baseApi } from "@/shared/lib/redux/services/baseApi";

export interface RegisterInput {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrorPayload {
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  // Next.js Fast Refresh can evaluate this module more than once in development.
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation<void, RegisterInput>({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;
