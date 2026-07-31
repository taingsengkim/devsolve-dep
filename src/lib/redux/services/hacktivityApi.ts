import { baseApi } from "./baseApi";
import {
  HacktivityActivity,
  HacktivityFeedResponse,
  HacktivityQueryParams,
  HacktivityStat,
} from "@/lib/types/hacktivity/types";
import { HACKTIVITY_FEED_RESPONSE } from "@/lib/types/hacktivity/mock-data";

export * from "@/lib/types/hacktivity/types";
export * from "@/lib/types/hacktivity/mock-data";

export const hacktivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHacktivityFeed: builder.query<HacktivityFeedResponse, HacktivityQueryParams | void>({
      queryFn: (params) => {
        const activities = [...HACKTIVITY_FEED_RESPONSE.activities];
        if (params?.search) {
          const q = params.search.toLowerCase();
          return {
            data: {
              stats: HACKTIVITY_FEED_RESPONSE.stats,
              activities: activities.filter(
                (activity) =>
                  activity.handle.toLowerCase().includes(q) ||
                  activity.action.toLowerCase().includes(q) ||
                  activity.program.toLowerCase().includes(q)
              ),
            },
          };
        }

        return { data: HACKTIVITY_FEED_RESPONSE };
      },
      providesTags: ["Post"],
    }),
  }),
});

export const { useGetHacktivityFeedQuery } = hacktivityApi;
