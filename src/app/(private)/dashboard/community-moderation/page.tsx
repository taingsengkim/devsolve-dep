"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MessageSquareCode,
  Search,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetModerationItemsQuery,
  useUpdateModerationItemMutation,
  ModerationItem,
} from "@/lib/redux/services/adminApi";

export default function CommunityModerationPage() {
  const { data: items, isLoading } = useGetModerationItemsQuery();
  const [updateItem] = useUpdateModerationItemMutation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = (items || []).filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = async (id: string, status: "RESOLVED" | "DISMISSED") => {
    await updateItem({ id, status });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Community & Content Moderation Queue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review reported discussions, forum topics, solution showcases, and member comments for policy adherence.
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-800">Flagged Community Content ({filteredItems.length})</h2>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, author, or reason..."
            className="pl-9 h-10 bg-white border-slate-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800">Moderation Queue Clear</CardTitle>
          <p className="text-sm text-slate-500">There are no flagged content items pending review.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 rounded-full px-2.5 py-0.5 text-xs font-bold">
                      {item.contentType}
                    </Badge>
                    <Badge variant="outline" className="text-rose-700 border-rose-200 bg-rose-50 rounded-full px-2.5 text-xs font-semibold">
                      Reason: {item.reason}
                    </Badge>
                    <span className="text-xs text-slate-400">• {item.reportedAt}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    {item.details}
                  </p>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Author: <strong className="text-slate-700">{item.authorName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <Button
                    variant="outline"
                    onClick={() => handleAction(item.id, "DISMISSED")}
                    className="h-9 px-3.5 rounded-xl border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    Dismiss Flag
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleAction(item.id, "RESOLVED")}
                    className="h-9 px-3.5 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    Take Down & Warn
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
