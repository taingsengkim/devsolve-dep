"use client";

import { useState } from "react";
import {
  useGetOrganizationVerificationQuery,
  useSendVerificationEmailMutation,
  useResubmitOrganizationMutation,
} from "@/lib/redux/services/organizationsApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, RefreshCw, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function OrgVerificationPanel() {
  const { data: verification, isLoading, isError, refetch } = useGetOrganizationVerificationQuery();
  const [sendEmail, { isLoading: isSendingEmail }] = useSendVerificationEmailMutation();
  const [resubmit, { isLoading: isResubmitting }] = useResubmitOrganizationMutation();

  const handleSendEmail = async () => {
    try {
      await sendEmail().unwrap();
      toast.success("Verification Email Sent", {
        description: "Please check your inbox to verify your email address.",
      });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to send verification email.";
      toast.error("Email Sending Failed", { description: msg });
    }
  };

  const handleResubmit = async () => {
    try {
      await resubmit().unwrap();
      toast.success("Organization Resubmitted", {
        description: "Your organization application has been resubmitted for verification.",
      });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to resubmit organization.";
      toast.error("Resubmission Failed", { description: msg });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse">
        <CardHeader>
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded mt-2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !verification) {
    return (
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            Organization Verification Status
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
            Verification status details could not be loaded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <CardTitle className="text-lg font-semibold flex items-center justify-between text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Verification Status
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
          Review email and domain verification requirements for your organization.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Email Verification
              </span>
              {verification.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-3.5 h-3.5" /> Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {verification.email ?? "Owner work email"}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Domain Verification
              </span>
              {verification.domainVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-3.5 h-3.5" /> Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {verification.domain ?? "Company domain"}
            </p>
          </div>
        </div>

        {verification.rejectionReason && (
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-900 dark:text-rose-200">Rejection Reason</h4>
            <p className="text-sm">{verification.rejectionReason}</p>
          </div>
        )}

        {verification.nextAction && (
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">Recommended Action</h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-300">{verification.nextAction}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!verification.emailVerified && (
            <Button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
              {isSendingEmail ? "Sending..." : "Resend Verification Email"}
            </Button>
          )}

          {(verification.status === "REJECTED" || verification.status === "PENDING") && (
            <Button
              onClick={handleResubmit}
              disabled={isResubmitting}
              variant="outline"
              className="gap-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
            >
              <RefreshCw className={`w-4 h-4 ${isResubmitting ? "animate-spin" : ""}`} />
              {isResubmitting ? "Resubmitting..." : "Resubmit Application"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
