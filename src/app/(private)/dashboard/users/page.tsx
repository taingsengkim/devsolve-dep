"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Search,
  ShieldCheck,
  Building2,
  UserCheck,
  UserX,
  User,
  Shield,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAdminUsersQuery,
  useUpdateAdminUserStatusMutation,
  AdminUserItem,
} from "@/lib/redux/services/adminApi";

export default function AdminUsersPage() {
  const { data: users, isLoading } = useGetAdminUsersQuery();
  const [updateUser] = useUpdateAdminUserStatusMutation();

  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = (users || []).filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleToggleStatus = async (user: AdminUserItem) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    await updateUser({ id: user.id, status: newStatus });
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
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Admin Platform / User Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform User & Identity Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage security researchers, company representatives, platform administrators, and user access permissions.
          </p>
        </div>
      </header>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["ALL", "USER", "COMPANY", "ADMIN", "MODERATOR"].map((role) => (
            <Button
              key={role}
              variant={roleFilter === role ? "default" : "ghost"}
              onClick={() => setRoleFilter(role)}
              className={`rounded-xl text-sm font-semibold h-9 px-3.5 cursor-pointer ${
                roleFilter === role
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {role === "ALL" && "All Roles"}
              {role === "USER" && "Researchers"}
              {role === "COMPANY" && "Companies"}
              {role === "ADMIN" && "Admins"}
              {role === "MODERATOR" && "Moderators"}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 h-10 bg-white border-slate-300 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Users Table / Grid */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-800">No Users Found</CardTitle>
          <p className="text-sm text-slate-500">No users match your query or filter criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredUsers.map((u) => (
            <Card key={u.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs transition">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{u.name}</h3>
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : u.role === "COMPANY"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : u.role === "MODERATOR"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        {u.role}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[11px] font-semibold ${
                          u.status === "ACTIVE"
                            ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                            : "text-rose-700 border-rose-200 bg-rose-50"
                        }`}
                      >
                        {u.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>{u.email}</span>
                      <span>•</span>
                      <span>Joined {u.joinedDate}</span>
                      {u.reportsSubmitted !== undefined && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{u.reportsSubmitted} Reports</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant={u.status === "ACTIVE" ? "outline" : "default"}
                    onClick={() => handleToggleStatus(u)}
                    className={`h-9 px-3.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      u.status === "ACTIVE"
                        ? "border-slate-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    {u.status === "ACTIVE" ? (
                      <>
                        <UserX className="w-3.5 h-3.5 mr-1.5" />
                        Suspend Account
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                        Activate Account
                      </>
                    )}
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
