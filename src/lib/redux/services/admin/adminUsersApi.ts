import { baseApi } from "../baseApi";
import { AdminUserItem } from "@/lib/types/admin/types";
import {
  mockAdminUsersStore,
  updateMockAdminUsersStore,
} from "./adminMockData";

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUserItem[], void>({
      queryFn: () => {
        return { data: mockAdminUsersStore.map((u) => ({ ...u })) };
      },
      providesTags: ["AdminUser"],
    }),
    updateAdminUserStatus: builder.mutation<
      AdminUserItem,
      { id: string; status?: "ACTIVE" | "SUSPENDED" | "PENDING"; role?: "USER" | "COMPANY" | "ADMIN" | "MODERATOR" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status, role }) => {
        updateMockAdminUsersStore((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  ...(status ? { status } : {}),
                  ...(role ? { role } : {}),
                }
              : u
          )
        );
        const updated = mockAdminUsersStore.find((u) => u.id === id);
        return { data: updated ? { ...updated } : { ...mockAdminUsersStore[0] } };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "AdminUser", id }, "AdminUser"],
    }),
  }),
});

export const { useGetAdminUsersQuery, useUpdateAdminUserStatusMutation } =
  adminUsersApi;
