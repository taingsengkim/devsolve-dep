"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Building2,
  Tag,
  User,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Activity,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Send,
  Hash,
  FileText,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetCompanyVerificationByIdQuery,
  useUpdateCompanyVerificationStatusMutation,
} from "@/lib/redux/services/adminApi";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/organizations/statusUtils";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

/** Renders a labelled metadata row in the info grid */
function InfoField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{children}</div>
    </div>
  );
}

export default function OrganizationVerificationDetailPage({ params }: DetailPageProps) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.id;

  const { data: company, isLoading, isFetching } =
    useGetCompanyVerificationByIdQuery(companyId);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateCompanyVerificationStatusMutation();

  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (company?.notes) {
      setAdminNote(company.notes);
    }
  }, [company]);

  /* ---- Loading skeleton ---- */
  if (isLoading || isFetching || !company) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        {/* Breadcrumb */}
        <div className="h-4 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        {/* Header */}
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ---- Handlers ---- */
  const handleDecision = async (
    status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"
  ) => {
    try {
      await updateStatus({ id: company.id, status, notes: adminNote });
      const label =
        status === "APPROVED"
          ? "approved"
          : status === "REJECTED"
            ? "rejected"
            : "marked as under review";
      toast.success(`Application ${label}!`, {
        description: `${company.companyName} verification status updated.`,
      });
    } catch {
      toast.error("Failed to update status. Please try again.");
    }
  };

  const handleSaveNote = async () => {
    try {
      await updateStatus({
        id: company.id,
        status: company.status as "APPROVED" | "REJECTED",
        notes: adminNote,
      });
      toast.success("Admin note saved.");
    } catch {
      toast.error("Failed to save note.");
    }
  };

  const displayValue = (val: string | undefined | null, fallback = "—") =>
    val?.trim() || fallback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
        <Link
          href="/dashboard/company-verification"
          className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Organizations
        </Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 font-semibold truncate max-w-[200px]">
          {company.companyName}
        </span>
      </div>

      {/* ── PAGE HEADER ─────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-xl shrink-0">
            {company.companyName.charAt(0)}
          </div>
          <div className="space-y-1">

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {company.companyName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <StatusBadge status={company.status} />
              <Badge
                variant="outline"
                className="rounded-full px-2.5 py-0.5 text-xs font-medium border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 gap-1"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                {company.industry ?? company.businessType}
              </Badge>
              {(company.orgCode) && (
                <span className="text-xs font-mono text-slate-400">
                  {company.orgCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Submission date */}
        <div className="text-left sm:text-right shrink-0">
          <span className="text-xs text-slate-400 font-medium block">Submitted</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
            {company.submittedAt ?? company.registrationDate ?? "—"}
          </span>
        </div>
      </header>

      {/* ── ASYMMETRIC GRID ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ══ MAIN COLUMN (2/3) ══════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* COMPANY INFORMATION CARD */}
          <Card className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
              Company Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <InfoField icon={Building2} label="Organization">
                {displayValue(company.companyName)}
              </InfoField>

              <InfoField icon={User} label="Contact Name">
                {displayValue(company.contactName)}
              </InfoField>

              <InfoField icon={Briefcase} label="Job Title">
                {displayValue(company.jobTitle)}
              </InfoField>

              <InfoField icon={Mail} label="Business Email">
                <a
                  href={`mailto:${company.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {displayValue(company.email)}
                </a>
              </InfoField>

              <InfoField icon={Phone} label="Phone">
                {displayValue(company.phone)}
              </InfoField>

              <InfoField icon={Globe} label="Website">
                {company.website || company.domain ? (
                  <a
                    href={company.website ?? `https://${company.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {company.website ?? `https://${company.domain}`}
                  </a>
                ) : (
                  "—"
                )}
              </InfoField>

              <InfoField icon={MapPin} label="Country">
                {displayValue(company.country)}
              </InfoField>

              <InfoField icon={Activity} label="Industry">
                {displayValue(company.industry ?? company.businessType)}
              </InfoField>
            </div>

            {/* Description */}
            {company.description && (
              <div className="pt-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Company Description
                </span>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80 leading-relaxed">
                  {company.description}
                </div>
              </div>
            )}
          </Card>

          {/* ADMIN NOTES CARD */}
          <Card className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Admin Notes
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Internal — not visible to the applicant.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add internal notes about this application..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none"
              />
              <Button
                variant="outline"
                onClick={handleSaveNote}
                disabled={isUpdating}
                className="rounded-xl h-9 px-4 text-sm font-semibold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 shadow-2xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                Save Note
              </Button>
            </div>
          </Card>

          {/* DECISION BAR */}
          <Card className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Make a Decision
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  The applicant will be notified by email.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => handleDecision("UNDER_REVIEW")}
                  disabled={isUpdating}
                  className="rounded-full px-4 h-9 text-sm font-semibold border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-500 transition-colors gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Mark Under Review
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleDecision("REJECTED")}
                  disabled={isUpdating}
                  className="rounded-full px-4 h-9 text-sm font-semibold border-rose-400 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-500 transition-colors gap-1.5 cursor-pointer shadow-2xs"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </Button>

                <Button
                  onClick={() => handleDecision("APPROVED")}
                  disabled={isUpdating}
                  className="rounded-full px-4 h-9 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Application
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* ══ SIDEBAR COLUMN (1/3) ══════════════════════════════════ */}
        <aside className="space-y-6">

          {/* VERIFICATION METADATA CARD */}
          <Card className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Verification Details
            </h3>

            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                  Domain
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100 text-right truncate">
                  {displayValue(company.domain)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  <Hash className="w-3.5 h-3.5" />
                  Tax ID
                </dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-right">
                  {displayValue(company.taxId)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                  Documents
                </dt>
                <dd className="font-bold text-blue-600 dark:text-blue-400">
                  {company.documentsCount ?? 0} attached
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  Registered
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                  {displayValue(company.registrationDate)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Status
                </dt>
                <dd>
                  <StatusBadge status={company.status} />
                </dd>
              </div>
            </dl>
          </Card>

          {/* QUICK ACTIONS CARD */}
          <Card className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors group"
              >
                <Send className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
                Email Applicant
              </a>

              {(company.website ?? company.domain) && (
                <a
                  href={company.website ?? `https://${company.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors group"
                >
                  <Globe className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                  Visit Website
                </a>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}
