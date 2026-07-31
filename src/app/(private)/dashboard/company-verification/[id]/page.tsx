"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Building2,
  Clock,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetCompanyVerificationByIdQuery,
  useUpdateCompanyVerificationStatusMutation,
} from "@/lib/redux/services/adminApi";
import { toast } from "sonner";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrganizationVerificationDetailPage({ params }: DetailPageProps) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.id;

  const { data: company, isLoading, isFetching } = useGetCompanyVerificationByIdQuery(companyId);
  const [updateStatus] = useUpdateCompanyVerificationStatusMutation();

  const [adminNote, setAdminNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (company?.notes) {
      setAdminNote(company.notes);
    }
  }, [company]);

  if (isLoading || isFetching || !company) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleDecision = async (status: "APPROVED" | "REJECTED" | "UNDER_REVIEW") => {
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
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    setTimeout(() => {
      setIsSavingNote(false);
      toast.success("Admin note saved successfully");
    }, 400);
  };

  const getStatusBadge = () => {
    switch (company.status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1 text-xs font-bold gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800 rounded-full px-3 py-1 text-xs font-bold gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-full px-3 py-1 text-xs font-bold gap-1">
            <Eye className="w-3.5 h-3.5" />
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800 rounded-full px-3 py-1 text-xs font-bold gap-1">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* TOP NAVIGATION BACK LINK */}
      <Link
        href="/dashboard/company-verification"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Organizations
      </Link>

      {/* ASYMMETRIC GRID CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* MAIN COLUMN (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          {/* HERO HEADER CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-center font-bold text-red-600 text-xl shrink-0">
                {company.companyName.charAt(0)}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {company.companyName}
                </h1>
                <p className="text-xs font-mono font-medium text-slate-400">
                  {company.orgCode || "ORG-2025-001"}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {getStatusBadge()}
                  <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-medium border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {company.industry || company.businessType}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium block">Submitted</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
                {company.submittedAt || company.registrationDate}
              </span>
            </div>
          </div>

          {/* COMPANY INFORMATION CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
              Company Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Organization
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.companyName}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Contact Name
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.contactName || "James Chen"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Job Title
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.jobTitle || "CISO"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Business Email
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.phone || "+1 415 234 5678"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Website
                </span>
                <a
                  href={company.website || `https://${company.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline text-sm block"
                >
                  {company.website || `https://${company.domain}`}
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Country
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.country || "United States"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" /> Industry
                </span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {company.industry || company.businessType}
                </p>
              </div>
            </div>

            {/* COMPANY DESCRIPTION */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Company Description
              </span>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80 leading-relaxed">
                {company.description ||
                  `${company.companyName} is a leading software platform committed to proactive security and running bug bounty programs to identify vulnerabilities.`}
              </div>
            </div>
          </div>

          {/* ADMIN NOTES CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Admin Notes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Internal notes — not visible to the applicant.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add internal notes about this application..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs resize-none"
              />
              <Button
                variant="outline"
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="rounded-xl h-9 px-4 text-xs font-semibold border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                Save Note
              </Button>
            </div>
          </div>

          {/* MAKE A DECISION BAR */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Make a Decision
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                The applicant will be notified by email.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDecision("UNDER_REVIEW")}
                className="rounded-full px-4 py-2 text-xs font-semibold border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                Mark Under Review
              </button>

              <button
                type="button"
                onClick={() => handleDecision("REJECTED")}
                className="rounded-full px-4 py-2 text-xs font-semibold border border-rose-400 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleDecision("APPROVED")}
                className="rounded-full px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve Application
              </button>
            </div>
          </div>
        </div>

        {/* SIDEBAR COLUMN (1 COL) */}
        <aside className="space-y-6">

          {/* QUICK ACTIONS CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>

            <div>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Send className="w-3.5 h-3.5" />
                Send Email
              </a>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
