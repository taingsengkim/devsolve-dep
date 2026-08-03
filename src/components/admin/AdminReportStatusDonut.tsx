"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { PieSegment } from "@/hooks/useAdminOverview";

interface AdminReportStatusDonutProps {
  pieData: PieSegment[];
  total: number;
}

export function AdminReportStatusDonut({
  pieData,
  total,
}: AdminReportStatusDonutProps) {
  return (
    <Card className="lg:col-span-4 rounded-[20px] border border-slate-200/70 bg-white p-6 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Report Status
        </h3>
        <p className="text-sm text-slate-400 mt-0.5">All-time breakdown</p>

        {/* Recharts Donut Graphic */}
        <div className="my-4 relative h-[170px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {total}
            </span>
            <span className="text-xs text-slate-400 font-medium">total</span>
          </div>
        </div>

        {/* Status Breakdown Legend & Progress Bars */}
        <div className="space-y-3">
          {pieData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 w-24 shrink-0">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-600">{item.name}</span>
              </div>

              {/* Progress bar */}
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.barBg}`}
                  style={{ width: `${(item.value / total) * 100}%` }}
                />
              </div>

              <span className="font-bold text-slate-900 w-8 text-right shrink-0">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
