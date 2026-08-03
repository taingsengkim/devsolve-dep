import { useState } from "react";
import { useGetAdminOverviewQuery } from "@/lib/redux/services/adminApi";

export interface PieSegment {
  name: string;
  value: number;
  color: string;
  barBg: string;
}

export function useAdminOverview() {
  const { data: adminData, isLoading, isFetching, refetch } =
    useGetAdminOverviewQuery();
  const [timeRange] = useState("7 months");

  const pieData: PieSegment[] = adminData
    ? [
        {
          name: "Confirmed",
          value: adminData.reportStatusBreakdown.confirmed,
          color: "#10b981",
          barBg: "bg-emerald-500",
        },
        {
          name: "Pending",
          value: adminData.reportStatusBreakdown.pending,
          color: "#f59e0b",
          barBg: "bg-amber-500",
        },
        {
          name: "Rejected",
          value: adminData.reportStatusBreakdown.rejected,
          color: "#ef4444",
          barBg: "bg-rose-500",
        },
        {
          name: "In Review",
          value: adminData.reportStatusBreakdown.inReview,
          color: "#3b82f6",
          barBg: "bg-blue-500",
        },
      ]
    : [];

  return { adminData, isLoading, isFetching, refetch, pieData, timeRange };
}
