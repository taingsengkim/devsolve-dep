"use client";

export const dynamic = "force-dynamic";

import React, { useState, use } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  Coins,
  FileText,
  Layers,
  AlertOctagon,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetAdminProgramsQuery,
  useGetProgramDetailQuery,
  useApproveProgramMutation,
  useRejectProgramMutation,
} from "@/lib/redux/services/admin/programAdminApi";
import {
  useGetProgramByIdQuery,
  useGetMyCompanyProgramsQuery,
} from "@/lib/redux/services/program/programsApi";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";
import { ProgramRejectDialog } from "@/components/admin/programs/ProgramRejectDialog";
import { toast } from "sonner";

export default function AdminProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { user } = useSidebarAuth();
  const isAdmin = user?.roles?.includes("ADMIN") ?? false;

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch via proxy /api/programs/${id} for all roles
  const {
    data: publicDetail,
    isLoading: isPublicLoading,
    refetch: refetchPublic,
  } = useGetProgramByIdQuery(id);

  // Admin-only detail query
  const {
    data: adminDetail,
    isLoading: isAdminDetailLoading,
    refetch: refetchAdmin,
  } = useGetProgramDetailQuery(id, { skip: !isAdmin });

  // Admin-only list query fallback
  const { data: adminListData, isLoading: isAdminListLoading } =
    useGetAdminProgramsQuery({ size: 100 }, { skip: !isAdmin });

  // Company-only list query fallback
  const {
    data: companyListData,
    isLoading: isCompanyListLoading,
    refetch: refetchCompany,
  } = useGetMyCompanyProgramsQuery({ size: 100 }, { skip: isAdmin });

  const refetch = () => {
    refetchPublic();
    if (isAdmin) refetchAdmin();
    else refetchCompany();
  };

  const program =
    adminDetail ||
    publicDetail ||
    (isAdmin
      ? adminListData?.content?.find((p: any) => p.id === id || p.handle === id)
      : companyListData?.content?.find(
          (p: any) => p.id === id || p.handle === id
        ));

  const isLoading = isAdmin
    ? isAdminDetailLoading && isAdminListLoading && isPublicLoading
    : isCompanyListLoading && isPublicLoading;
  const isError = !isLoading && !program;

  const [approveProgram] = useApproveProgramMutation();
  const [rejectProgram] = useRejectProgramMutation();

  const handleApprove = async () => {
    try {
      setIsActionLoading(true);
      await approveProgram({ id }).unwrap();
      toast.success(`Program "${program?.name || ""}" approved successfully!`);
      setApproveDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve program.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    await rejectProgram({ id, reason }).unwrap();
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
        <div className="h-96 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="space-y-6 w-full pb-12 text-center py-16">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Program Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Unable to load program details or the program ID is invalid.
        </p>
        <Link href="/dashboard/program-management">
          <Button variant="outline" className="rounded-xl mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Program Management
          </Button>
        </Link>
      </div>
    );
  }

  const isPending = program.submissionState === "PENDING_REVIEW";
  const isApproved = program.submissionState === "APPROVED";
  const isRejected = program.submissionState === "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-24"
    >
      {/* BREADCRUMB & BACK BUTTON */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/program-management">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-9 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Programs
          </Button>
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
          {program.name}
        </span>
      </div>

      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {program.name}
              </h1>
              <div className="text-sm font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span>@{program.handle}</span>
                {program.organizationId && (
                  <>
                    <span>•</span>
                    <span className="text-xs text-slate-400">
                      Org ID: {program.organizationId}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* STATUS BADGES */}
          <div className="flex flex-wrap items-center gap-2">
            {isPending && (
              <Badge className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-1.5 text-xs font-semibold gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Pending Review
              </Badge>
            )}
            {isApproved && (
              <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-1.5 text-xs font-semibold gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Approved
              </Badge>
            )}
            {isRejected && (
              <Badge className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl px-3 py-1.5 text-xs font-semibold gap-1.5">
                <XCircle className="w-4 h-4" />
                Rejected
              </Badge>
            )}

            <Badge
              variant="outline"
              className="rounded-xl px-3 py-1.5 text-xs font-semibold border-slate-200 dark:border-slate-800"
            >
              {program.engagementType === "BOUNTY" ? "Bounty Program" : "VDP Response"}
            </Badge>

            <Badge
              variant="outline"
              className="rounded-xl px-3 py-1.5 text-xs font-semibold border-slate-200 dark:border-slate-800 uppercase"
            >
              {program.visibility || "PUBLIC"}
            </Badge>
          </div>
        </div>

        {/* METADATA SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Lifecycle State</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {program.state || "DRAFT"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Bounties Offered</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {program.offersBounties ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Bounty Range</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {program.offersBounties && program.minimumBounty !== undefined
                ? `$${program.minimumBounty} – $${program.maximumBounty || "N/A"}`
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Created Date</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {program.createdAt
                ? new Date(program.createdAt).toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* REJECTION REASON BANNER (IF REJECTED) */}
      {isRejected && program.rejectionReason && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide">
              Rejection Reason & Feedback
            </h4>
            <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
              {program.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* DETAILED CONTENT TABS */}
      <Tabs defaultValue="overview" className="w-full space-y-4">
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl h-auto flex flex-wrap gap-1 shadow-2xs">
          <TabsTrigger
            value="overview"
            className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" /> Overview & Policy
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5" /> Scope Assets ({program.assets?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Coins className="w-3.5 h-3.5 mr-1.5" /> Reward Tiers ({program.rewards?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="guidelines"
            className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Rules & Exclusions
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Program Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <p className="whitespace-pre-wrap leading-relaxed">
                {program.description || "No description provided."}
              </p>

              {program.policy && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Policy & Requirements
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    {program.policy}
                  </div>
                </div>
              )}

              {program.proofOfConceptRequirements && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Proof of Concept (PoC) Requirements
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap">
                    {program.proofOfConceptRequirements}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSETS TAB */}
        <TabsContent value="assets" className="space-y-4">
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Scope & Target Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {program.assets && program.assets.length > 0 ? (
                <div className="space-y-3">
                  {program.assets.map((asset: any, idx: number) => (
                    <div
                      key={asset.id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700"
                          >
                            {asset.assetType}
                          </Badge>
                          <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                            {asset.identifier}
                          </span>
                        </div>
                        {asset.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {asset.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold gap-1 border ${
                            asset.isInScope
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                          }`}
                        >
                          {asset.isInScope ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> In Scope
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" /> Out of Scope
                            </>
                          )}
                        </Badge>

                        {asset.maxSeverity && (
                          <Badge
                            variant="outline"
                            className="rounded-lg text-xs font-bold border-slate-300 dark:border-slate-700"
                          >
                            Max: {asset.maxSeverity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                  No assets defined for this program.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* REWARDS TAB */}
        <TabsContent value="rewards" className="space-y-4">
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Severity Reward Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              {program.rewards && program.rewards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {program.rewards.map((rew: any, idx: number) => (
                    <div
                      key={rew.id || idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Severity Tier
                        </span>
                        <Badge
                          className={`rounded-lg text-xs font-bold ${
                            rew.severity === "CRITICAL"
                              ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200"
                              : rew.severity === "HIGH"
                              ? "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200"
                              : rew.severity === "MEDIUM"
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200"
                              : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200"
                          }`}
                        >
                          {rew.severity}
                        </Badge>
                      </div>

                      <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                        {rew.minAmount !== undefined && rew.maxAmount !== undefined
                          ? `$${rew.minAmount} – $${rew.maxAmount}`
                          : rew.minAmount !== undefined
                          ? `$${rew.minAmount}+`
                          : "Custom"}
                      </div>

                      {rew.points !== undefined && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {rew.points} reputation points
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                  No reward tiers configured.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GUIDELINES TAB */}
        <TabsContent value="guidelines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RULES OF ENGAGEMENT */}
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
              <CardHeader>
                <CardTitle className="text-md font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Rules of Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {program.rulesOfEngagement?.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {program.rulesOfEngagement.description}
                  </p>
                )}
                {program.rulesOfEngagement?.rules &&
                program.rulesOfEngagement.rules.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {program.rulesOfEngagement.rules.map(
                      (r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">No explicit rules set.</p>
                )}
              </CardContent>
            </Card>

            {/* EXCLUSIONS */}
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
              <CardHeader>
                <CardTitle className="text-md font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Out of Scope & Exclusions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {program.exclusions?.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    {program.exclusions.description}
                  </p>
                )}
                {program.exclusions?.rules &&
                program.exclusions.rules.length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {program.exclusions.rules.map((e: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">
                    No explicit exclusions set.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {program.name}
            </span>
            <span>•</span>
            <span className="text-xs font-mono">@{program.handle}</span>
          </div>

          {isAdmin ? (
            isPending ? (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="destructive"
                  disabled={isActionLoading}
                  onClick={() => setRejectDialogOpen(true)}
                  className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-sm"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject Program
                </Button>

                <Button
                  disabled={isActionLoading}
                  onClick={() => setApproveDialogOpen(true)}
                  className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto text-sm shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Approve & Publish Program
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isApproved && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> This program has been approved.
                  </span>
                )}
                {isRejected && (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> This program has been rejected.
                  </span>
                )}
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isPending && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Under Review by DevSolve Admins
                </span>
              )}
              {isApproved && (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Program Approved & Active
                </span>
              )}
              {isRejected && (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Program Requires Revision
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* APPROVE CONFIRMATION ALERT DIALOG */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <AlertDialogHeader className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Approve Program Submission
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400 font-normal">
              Are you sure you want to approve{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                "{program.name}"
              </span>
              ? Once approved, the organization can manage and activate their bug bounty scope.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-2">
            <AlertDialogCancel className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-sm border-slate-200 dark:border-slate-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto text-sm shadow-2xs"
            >
              Confirm Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* REJECT DIALOG */}
      <ProgramRejectDialog
        open={rejectDialogOpen}
        programName={program.name}
        onClose={() => setRejectDialogOpen(false)}
        onConfirmReject={handleRejectConfirm}
      />
    </motion.div>
  );
}
