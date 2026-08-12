import { baseApi } from "./baseApi";
import {
  GetNotificationsParams,
  Notification,
  NotificationPage,
  UnreadCountResponse,
} from "@/lib/types/notifications/types";

export * from "@/lib/types/notifications/types";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationPage,
      GetNotificationsParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.pageNumber !== undefined)
          queryParams.set("pageNumber", params.pageNumber.toString());
        if (params?.pageSize !== undefined)
          queryParams.set("pageSize", params.pageSize.toString());
        if (params?.unreadOnly !== undefined)
          queryParams.set("unreadOnly", params.unreadOnly.toString());

        const queryString = queryParams.toString();
        return `/notifications${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Notification"],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation<Notification, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
