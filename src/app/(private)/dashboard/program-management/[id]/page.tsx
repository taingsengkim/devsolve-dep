"use client";

export const dynamic = "force-dynamic";

import React, { Suspense, useState, use } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Coins,
  FileText,
  Layers,
  AlertOctagon,
  Check,
  LoaderCircle,
  X,
  Zap,
  ChevronDown,
  Globe,
  Lock,
  UserCheck,
  PauseCircle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetProgramDetailQuery,
  useApproveProgramMutation,
  useRejectProgramMutation,
} from "@/lib/redux/services/admin/programAdminApi";
import {
  useGetMyCompanyProgramByIdQuery,
  useGetProgramByIdQuery,
  useUpdateProgramStateMutation,
  usePublishProgramMutation,
  useCloseProgramMutation,
  usePauseProgramMutation,
  useResumeProgramMutation,
  useUpdateProgramVisibilityMutation,
} from "@/lib/redux/services/program/programsApi";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";
import { ProgramRejectDialog } from "@/components/admin/programs/ProgramRejectDialog";
import { MarkdownView } from "@/components/ui/markdown-view";
import { toast } from "sonner";

function ProgramDetailPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const { user } = useSidebarAuth();
  const isAdmin = user?.roles?.includes("ADMIN") ?? false;
  const isCompanyUser = user?.roles?.includes("COMPANY") ?? false;
  const isAdminScope = searchParams.get("scope") === "admin" && isAdmin;
  const isCompanyScope = !isAdminScope && isCompanyUser;

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Admin uses /api/admin/programs/${id} which bypasses public visibility filters
  const {
    data: adminDetail,
    isLoading: isAdminDetailLoading,
    refetch: refetchAdmin,
  } = useGetProgramDetailQuery(id, { skip: !isAdminScope });

  // Company / public users query /api/programs/${id} which automatically falls back
  // to backend /admin/programs/${id} for authenticated dashboard users.
  const {
    data: publicDetail,
    isLoading: isPublicLoading,
    refetch: refetchPublic,
  } = useGetProgramByIdQuery(id);

  const refetch = () => {
    if (isAdminScope) refetchAdmin();
    refetchPublic();
  };

  const program = adminDetail ?? publicDetail;

  const isLoading = isAdminScope ? isAdminDetailLoading : (isPublicLoading && !program);
  const isError = !isLoading && !program;

  const [approveProgram] = useApproveProgramMutation();
  const [rejectProgram] = useRejectProgramMutation();
  const [updateProgramState, { isLoading: isActivating }] =
    useUpdateProgramStateMutation();
  const [publishProgram, { isLoading: isPublishing }] =
    usePublishProgramMutation();
  const [closeProgram, { isLoading: isClosing }] =
    useCloseProgramMutation();
  const [pauseProgram, { isLoading: isPausing }] =
    usePauseProgramMutation();
  const [resumeProgram, { isLoading: isResuming }] =
    useResumeProgramMutation();
  const [updateProgramVisibility, { isLoading: isUpdatingVisibility }] =
    useUpdateProgramVisibilityMutation();

  const isStateChanging =
    isPublishing || isClosing || isPausing || isResuming || isActionLoading;

  const handleUpdateVisibility = async (
    visibility: "PUBLIC" | "PRIVATE" | "INVITE_ONLY"
  ) => {
    if (program?.visibility === visibility) return;
    try {
      setIsActionLoading(true);
      await updateProgramVisibility({ id, visibility }).unwrap();
      toast.success(`Program visibility updated to "${visibility}"!`);
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to update program visibility.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsActionLoading(true);
      await approveProgram({ id }).unwrap();
      toast.success(`Program "${program?.name || ""}" approved successfully!`);
      setApproveDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to approve program.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    await rejectProgram({ id, reason }).unwrap();
    refetch();
  };

  const handleActivateProgram = async () => {
    try {
      setIsActionLoading(true);
      await updateProgramState({ id, state: "ACTIVE" }).unwrap();
      toast.success(`Program "${program?.name || ""}" activated!`, {
        description:
          "Your security program is now ACTIVE and visible to researchers.",
      });
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to activate program.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePublishProgram = async () => {
    try {
      setIsActionLoading(true);
      await publishProgram(id).unwrap();
      toast.success(`Program "${program?.name || ""}" published!`, {
        description:
          "Your security program is now ACTIVE and visible to researchers.",
      });
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to publish program.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePauseProgram = async () => {
    try {
      setIsActionLoading(true);
      await pauseProgram(id).unwrap();
      toast.success(`Program "${program?.name || ""}" paused!`, {
        description: "Your security program is now PAUSED.",
      });
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to pause program.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResumeProgram = async () => {
    try {
      setIsActionLoading(true);
      await resumeProgram(id).unwrap();
      toast.success(`Program "${program?.name || ""}" resumed!`, {
        description: "Your security program is now ACTIVE and visible to researchers.",
      });
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to resume program.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCloseProgram = async () => {
    try {
      setIsActionLoading(true);
      await closeProgram(id).unwrap();
      toast.success(`Program "${program?.name || ""}" closed!`, {
        description: "Your security program state is now CLOSED.",
      });
      refetch();
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Failed to close program.");
    } finally {
      setIsActionLoading(false);
    }
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
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-full overflow-hidden">
        <Link href="/dashboard/program-management" className="shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-9 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Programs
          </Button>
        </Link>
        <span className="text-slate-300 dark:text-slate-700 shrink-0">/</span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
          {program.name}
        </span>
      </div>

      {/* HEADER CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 line-clamp-2 break-words leading-tight">
                {program.name}
              </h1>
              <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="truncate max-w-[220px] sm:max-w-xs md:max-w-md">@{program.handle}</span>
                {program.organizationId && (
                  <>
                    <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                      Org ID: {program.organizationId}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* STATUS BADGES */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {program.state !== "CLOSED" && (
              <>
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
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold border-border"
                >
                  {program.engagementType === "BOUNTY" ? "Bounty Program" : "VDP Response"}
                </Badge>

                {/* Visibility Badge / Interactive Dropdown for Company */}
                {!isAdminScope ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isUpdatingVisibility || isActionLoading}
                          className="rounded-xl px-3 py-1.5 h-8 text-xs font-semibold border-border uppercase gap-1.5 cursor-pointer bg-card"
                        >
                          {isUpdatingVisibility ? (
                            <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                          ) : program.visibility === "PRIVATE" ? (
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                          ) : program.visibility === "INVITE_ONLY" ? (
                            <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          <span>{program.visibility || "PUBLIC"}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent
                      align="end"
                      className="w-40 rounded-2xl p-1.5 bg-card border border-border shadow-lg"
                    >
                      <DropdownMenuItem
                        onClick={() => handleUpdateVisibility("PUBLIC")}
                        className="cursor-pointer font-semibold gap-2 rounded-xl text-xs"
                      >
                        <Globe className="w-4 h-4 text-blue-500" />
                        PUBLIC
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateVisibility("PRIVATE")}
                        className="cursor-pointer font-semibold gap-2 rounded-xl text-xs"
                      >
                        <Lock className="w-4 h-4 text-amber-500" />
                        PRIVATE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleUpdateVisibility("INVITE_ONLY")}
                        className="cursor-pointer font-semibold gap-2 rounded-xl text-xs"
                      >
                        <UserCheck className="w-4 h-4 text-purple-500" />
                        INVITE_ONLY
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold border-border uppercase gap-1.5"
                  >
                    {program.visibility === "PRIVATE" ? (
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    ) : program.visibility === "INVITE_ONLY" ? (
                      <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                    )}
                    {program.visibility || "PUBLIC"}
                  </Badge>
                )}
              </>
            )}

            {/* Company Activate / Lifecycle Status Button */}
            {!isAdminScope && (
              <div className="ml-0 sm:ml-2">
                {program.state === "DRAFT" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          disabled={isStateChanging}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm h-9 px-4 gap-2 shadow-xs cursor-pointer"
                        >
                          {isStateChanging ? (
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4 fill-current" />
                          )}
                          <span>DRAFT</span>
                          <ChevronDown className="w-4 h-4 ml-0.5" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                      <DropdownMenuItem
                        onClick={handlePublishProgram}
                        className="cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400 gap-2 rounded-xl text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ACTIVE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handlePauseProgram}
                        className="cursor-pointer font-semibold text-amber-600 dark:text-amber-400 gap-2 rounded-xl text-xs"
                      >
                        <PauseCircle className="w-4 h-4" />
                        PAUSE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleCloseProgram}
                        className="cursor-pointer font-semibold text-rose-600 dark:text-rose-400 gap-2 rounded-xl text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        CLOSE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : program.state === "ACTIVE" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          disabled={isStateChanging}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm h-9 px-4 gap-2 shadow-xs cursor-pointer"
                        >
                          {isStateChanging ? (
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>ACTIVE</span>
                          <ChevronDown className="w-4 h-4 ml-0.5" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                      <DropdownMenuItem
                        onClick={handlePauseProgram}
                        className="cursor-pointer font-semibold text-amber-600 dark:text-amber-400 gap-2 rounded-xl text-xs"
                      >
                        <PauseCircle className="w-4 h-4" />
                        PAUSE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleCloseProgram}
                        className="cursor-pointer font-semibold text-rose-600 dark:text-rose-400 gap-2 rounded-xl text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        CLOSE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : program.state === "PAUSED" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          disabled={isStateChanging}
                          className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm h-9 px-4 gap-2 shadow-xs cursor-pointer"
                        >
                          {isStateChanging ? (
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                          ) : (
                            <PauseCircle className="w-4 h-4" />
                          )}
                          <span>PAUSED</span>
                          <ChevronDown className="w-4 h-4 ml-0.5" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg">
                      <DropdownMenuItem
                        onClick={handleResumeProgram}
                        className="cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400 gap-2 rounded-xl text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        ACTIVE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleCloseProgram}
                        className="cursor-pointer font-semibold text-rose-600 dark:text-rose-400 gap-2 rounded-xl text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        CLOSE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : program.state === "CLOSED" ? (
                  <Button
                    type="button"
                    disabled
                    variant="outline"
                    className="rounded-xl border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-400 font-semibold text-xs sm:text-sm h-9 px-3.5 gap-1.5 opacity-100 cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    Program CLOSED
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled
                    variant="outline"
                    className="rounded-xl border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900 font-semibold text-xs sm:text-sm h-9 px-3.5 gap-1.5 cursor-not-allowed opacity-70"
                  >
                    <Zap className="w-4 h-4" />
                    {isPending
                      ? "Awaiting Platform Approval"
                      : isRejected
                      ? "Program Rejected"
                      : "Activate Program"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* METADATA SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Lifecycle State
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 block">
              {program.state || "DRAFT"}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Bounties Offered
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 block">
              {program.offersBounties ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Bounty Range
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 block">
              {program.offersBounties && program.minimumBounty !== undefined
                ? `$${program.minimumBounty} – $${program.maximumBounty || "N/A"}`
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
              Created Date
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 block">
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
            className="rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-1.5" /> Overview & Policy
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            className="rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Layers className="w-4 h-4 mr-1.5" /> Scope Assets ({program.assets?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Coins className="w-4 h-4 mr-1.5" /> Reward Tiers ({program.rewards?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="guidelines"
            className="rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" /> Rules & Exclusions
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
            <CardHeader>
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Program Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm sm:text-base text-slate-700 dark:text-slate-300">
              {program.description ? (
                <MarkdownView source={program.description} />
              ) : (
                <p className="text-slate-500 italic">No description provided.</p>
              )}

              {program.policy && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Policy & Requirements
                  </h3>
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <MarkdownView source={program.policy} />
                  </div>
                </div>
              )}

              {program.proofOfConceptRequirements && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Proof of Concept (PoC) Requirements
                  </h3>
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    <MarkdownView source={program.proofOfConceptRequirements} />
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
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Scope & Target Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {program.assets && program.assets.length > 0 ? (
                <div className="space-y-3">
                  {program.assets.map((asset, idx) => (
                    <div
                      key={asset.id || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700"
                          >
                            {asset.assetType}
                          </Badge>
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                            {asset.identifier}
                          </span>
                        </div>
                        {asset.description && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
              <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Severity Reward Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              {program.rewards && program.rewards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {program.rewards.map((rew, idx) => (
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

                      <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                        {rew.minAmount !== undefined && rew.maxAmount !== undefined
                          ? `$${rew.minAmount} – $${rew.maxAmount}`
                          : rew.minAmount !== undefined
                          ? `$${rew.minAmount}+`
                          : "Custom"}
                      </div>

                      {rew.points !== undefined && (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Rules of Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {program.rulesOfEngagement?.description && (
                  <MarkdownView source={program.rulesOfEngagement.description} />
                )}
                {program.rulesOfEngagement?.rules &&
                program.rulesOfEngagement.rules.length > 0 ? (
                  <ul className="space-y-2.5 text-sm">
                    {program.rulesOfEngagement.rules.map(
                      (r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">No explicit rules set.</p>
                )}
              </CardContent>
            </Card>

            {/* EXCLUSIONS */}
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xs">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Out of Scope & Exclusions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {program.exclusions?.description && (
                  <MarkdownView source={program.exclusions.description} />
                )}
                {program.exclusions?.rules &&
                program.exclusions.rules.length > 0 ? (
                  <ul className="space-y-2.5 text-sm">
                    {program.exclusions.rules.map((e: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400">
                    No explicit exclusions set.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 min-w-0 flex-1">
            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {program.name}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-mono truncate max-w-[120px] sm:max-w-[180px] hidden sm:inline text-slate-500">
              @{program.handle}
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2">
      {isAdminScope ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Status label when already resolved */}
                  {isApproved && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  )}
                  {isRejected && (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> Rejected
                    </span>
                  )}

                  <Button
                    variant="destructive"
                    disabled={!isPending || isActionLoading}
                    onClick={() => setRejectDialogOpen(true)}
                    className="rounded-xl font-semibold h-9 px-3 sm:px-4 text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4 mr-1 sm:mr-1.5" />
                    <span className="hidden sm:inline">Reject Program</span>
                    <span className="sm:hidden">Reject</span>
                  </Button>

                  <Button
                    disabled={!isPending || isActionLoading}
                    onClick={() => setApproveDialogOpen(true)}
                    className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-3 sm:px-4 text-xs sm:text-sm shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1 sm:mr-1.5" />
                    <span className="hidden sm:inline">Approve &amp; Publish</span>
                    <span className="sm:hidden">Approve</span>
                  </Button>
                </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isPending && (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <span className="truncate max-w-[180px] sm:max-w-none">Under Review by DevSolve Admins</span>
                  </span>
                )}
                {isApproved && (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Program Approved & Active
                  </span>
                )}
                {isRejected && (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 shrink-0" /> Requires Revision
                  </span>
                )}
              </div>
            )}
          </div>
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
                &ldquo;{program.name}&rdquo;
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

function ProgramDetailPageFallback() {
  return (
    <div className="space-y-6 w-full pb-12 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-32 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
      <div className="h-96 w-full rounded-2xl bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProgramDetailPageFallback />}>
      <ProgramDetailPageContent params={params} />
    </Suspense>
  );
}
