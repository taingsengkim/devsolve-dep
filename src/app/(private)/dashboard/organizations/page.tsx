"use client";

import { useGetMyOrganizationQuery } from "@/lib/redux/services/organizationsApi";
import { MyOrgCard } from "@/components/organizations/MyOrgCard";
import { OrgVerificationPanel } from "@/components/organizations/OrgVerificationPanel";
import { OrgActionsMenu } from "@/components/organizations/OrgActionsMenu";
import { motion } from "motion/react";
import { Building2, PlusCircle, RefreshCw, ChevronRight, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function MyOrganizationDashboardPage() {
  const { data: organization, isLoading, isError, refetch } = useGetMyOrganizationQuery();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Dashboard</span>
              <ChevronRight className="w-3 h-3" />
              <span>Organization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              My Organization
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your organization profile, verification status, and team preferences.
            </p>
          </div>
        </header>

        {/* Skeleton loading container */}
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </motion.div>
    );
  }

  if (isError || !organization) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1">
                <Home className="w-3 h-3" /> Dashboard
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Organization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              My Organization
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your organization profile, verification status, and team preferences.
            </p>
          </div>
        </header>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center py-12 px-6">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2">
              <Building2 className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              No Organization Found
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You are currently not associated with an active organization. Register your company or organization to launch security programs and invite team members.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/company-register">
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                <PlusCircle className="w-4 h-4" />
                Register an Organization
              </Button>
            </Link>
            <Button variant="outline" onClick={() => refetch()} className="gap-2 border-slate-300 dark:border-slate-700">
              <RefreshCw className="w-4 h-4" />
              Retry Fetch
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1">
              <Home className="w-3 h-3" /> Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900 dark:text-slate-100">Organization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            My Organization
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your organization profile, verification status, and team preferences.
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="space-y-6">
        <MyOrgCard organization={organization} />
        <OrgVerificationPanel />
        <OrgActionsMenu status={organization.status} />
      </div>
    </motion.div>
  );
}
