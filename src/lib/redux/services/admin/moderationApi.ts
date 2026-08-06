import { baseApi } from "../baseApi";
import {
  ModerationItem,
  ContentReportItem,
  ReportReasonsBreakdownData,
} from "@/lib/types/admin/types";
import {
  mockModerationItemsStore,
  updateMockModerationItemsStore,
  mockContentReportsStore,
  updateMockContentReportsStore,
} from "./adminMockData";

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModerationItems: builder.query<ModerationItem[], void>({
      queryFn: () => {
        return { data: mockModerationItemsStore.map((m) => ({ ...m })) };
      },
      providesTags: ["ModerationItem"],
    }),
    updateModerationItem: builder.mutation<
      ModerationItem,
      { id: string; status: "RESOLVED" | "DISMISSED" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, status }) => {
        updateMockModerationItemsStore((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        const updated = mockModerationItemsStore.find((m) => m.id === id);
        return { data: updated ? { ...updated } : { ...mockModerationItemsStore[0] } };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "ModerationItem", id }, "ModerationItem"],
    }),
    getContentReports: builder.query<
      { items: ContentReportItem[]; breakdown: ReportReasonsBreakdownData },
      void
    >({
      queryFn: () => {
        const pendingItems = mockContentReportsStore.filter((r) => r.status === "PENDING");
        const spam = pendingItems.filter((r) => r.reason === "Spam").length;
        const harmful = pendingItems.filter((r) => r.reason === "Harmful").length;
        const offensive = pendingItems.filter((r) => r.reason === "Offensive").length;
        const offTopic = pendingItems.filter((r) => r.reason === "Off-topic").length;
        const total = pendingItems.length;

        return {
          data: {
            items: mockContentReportsStore.map((r) => ({ ...r })),
            breakdown: { spam, harmful, offensive, offTopic, total },
          },
        };
      },
      providesTags: ["ContentReport"],
    }),
    updateContentReportAction: builder.mutation<
      ContentReportItem,
      { id: string; action: "DISMISS" | "WARN" | "REMOVE" }
    >({
      // TODO: replace queryFn with query() when real API is ready
      queryFn: ({ id, action }) => {
        updateMockContentReportsStore((prev) =>
          prev.map((r) => {
            if (r.id !== id) return r;
            let newStatus = r.status;
            if (action === "DISMISS") newStatus = "DISMISSED";
            if (action === "WARN") newStatus = "WARNED";
            if (action === "REMOVE") newStatus = "REMOVED";
            return { ...r, status: newStatus };
          })
        );
        const updated = mockContentReportsStore.find((r) => r.id === id);
        return { data: updated ? { ...updated } : { ...mockContentReportsStore[0] } };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "ContentReport", id }, "ContentReport"],
    }),
  }),
});

export const {
  useGetModerationItemsQuery,
  useUpdateModerationItemMutation,
  useGetContentReportsQuery,
  useUpdateContentReportActionMutation,
} = moderationApi;
