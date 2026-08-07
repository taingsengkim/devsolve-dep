import { baseApi } from "../baseApi";
import {
  ModerationItem,
  ContentReportItem,
  ReportReasonsBreakdownData,
  ModerationActionType,
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
      query: () => ({
        url: "/admin/flags?pageSize=100",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const rawFlags: any[] =
          response?.content ||
          response?.items ||
          (Array.isArray(response) ? response : []);

        const items: ContentReportItem[] = rawFlags.map((flag) => {
          const reasonMap: Record<string, "Spam" | "Harmful" | "Offensive" | "Off-topic"> = {
            SPAM: "Spam",
            OFFENSIVE: "Offensive",
            DUPLICATE: "Harmful",
            OFF_TOPIC: "Off-topic",
            OTHER: "Harmful",
          };

          const statusMap: Record<string, "PENDING" | "DISMISSED" | "WARNED" | "REMOVED"> = {
            PENDING: "PENDING",
            DISMISSED: "DISMISSED",
            REVIEWED: "WARNED",
          };

          return {
            id: flag.id,
            type: flag.flaggableType || "PROBLEM",
            title: flag.description || `${flag.flaggableType || "Content"} Flag #${flag.id.slice(0, 8)}`,
            timestamp: flag.createdAt
              ? new Date(flag.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Recent",
            reportCount: 1,
            reason: reasonMap[flag.reason] || "Spam",
            author: flag.reporterName || "Community User",
            status: statusMap[flag.status] || "PENDING",
            snippet: flag.description || undefined,
          };
        });

        const pendingItems = items.filter((r) => r.status === "PENDING");
        const spam = pendingItems.filter((r) => r.reason === "Spam").length;
        const harmful = pendingItems.filter((r) => r.reason === "Harmful").length;
        const offensive = pendingItems.filter((r) => r.reason === "Offensive").length;
        const offTopic = pendingItems.filter((r) => r.reason === "Off-topic").length;
        const total = pendingItems.length;

        return {
          items,
          breakdown: { spam, harmful, offensive, offTopic, total },
        };
      },
      providesTags: ["ContentReport"],
    }),
    updateContentReportAction: builder.mutation<
      unknown,
      { id: string; action: ModerationActionType | "DISMISS" }
    >({
      query: ({ id, action }) => ({
        url: action === "DISMISS" ? `/admin/flags/${id}/dismiss` : `/admin/flags/${id}/resolve`,
        method: "POST",
      }),
      invalidatesTags: ["ContentReport", "ModerationAction"],
    }),
  }),
});

export const {
  useGetModerationItemsQuery,
  useUpdateModerationItemMutation,
  useGetContentReportsQuery,
  useUpdateContentReportActionMutation,
} = moderationApi;
