"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { Shield, AlertTriangle, Send, Loader2, Info } from "lucide-react";

import { useGetProgramsQuery } from "@/lib/redux/services/programsApi";
import { useSubmitReportMutation } from "@/lib/redux/services/reportsApi";
import { SubmitReportHeader } from "@/components/reports/SubmitReportHeader";
import { SeveritySelector, SeverityValue } from "@/components/reports/SeveritySelector";
import { PocTemplateToolbar } from "@/components/reports/PocTemplateToolbar";
import { FileUploadDropzone, AttachedFile } from "@/components/reports/FileUploadDropzone";
import { ReportSuccessModal } from "@/components/reports/ReportSuccessModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VULNERABILITY_CATEGORIES = [
  "SQL Injection (SQLi)",
  "Remote Code Execution (RCE)",
  "Cross-Site Scripting (XSS - Stored)",
  "Cross-Site Scripting (XSS - Reflected)",
  "Server-Side Request Forgery (SSRF)",
  "Insecure Direct Object Reference (IDOR)",
  "Authentication Bypass / Broken Auth",
  "Privilege Escalation",
  "CSRF / Cross-Site Request Forgery",
  "Business Logic Flaw",
  "Information Disclosure / Sensitive Data Leak",
  "Broken Access Control",
  "Cryptographic Flaw",
  "Other Security Issue",
];

const submitReportSchema = z.object({
  programId: z.string().min(1, "Please select a target program."),
  targetAsset: z.string().min(2, "Target asset/URL is required."),
  category: z.string().min(1, "Please select a vulnerability category."),
  severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
  title: z
    .string()
    .min(10, "Title must be at least 10 characters long.")
    .max(150, "Title cannot exceed 150 characters."),
  summaryPoC: z.string().min(30, "Please provide a detailed Proof of Concept (at least 30 characters)."),
  impact: z.string().optional(),
  remediation: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must confirm adherence to ethical guidelines and terms.",
  }),
});

type SubmitReportFormValues = z.infer<typeof submitReportSchema>;

function SubmitReportContent() {
  const searchParams = useSearchParams();
  const preselectedProgramId = searchParams.get("programId") || "";

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    reportId: string;
    programName: string;
    title: string;
  }>({
    isOpen: false,
    reportId: "",
    programName: "",
    title: "",
  });

  const { data: programsData, isLoading: isProgramsLoading } = useGetProgramsQuery();
  const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation();

  const programs = programsData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SubmitReportFormValues>({
    resolver: zodResolver(submitReportSchema),
    defaultValues: {
      programId: preselectedProgramId,
      targetAsset: "",
      category: "SQL Injection (SQLi)",
      severity: "HIGH",
      title: "",
      summaryPoC: "",
      impact: "",
      remediation: "",
      agreeTerms: true,
    },
  });

  const selectedProgramId = watch("programId");

  // Sync preselected program ID if loaded async
  useEffect(() => {
    if (preselectedProgramId && programs.length > 0) {
      const found = programs.find((p) => p.id === preselectedProgramId);
      if (found) {
        setValue("programId", found.id);
      }
    } else if (!selectedProgramId && programs.length > 0) {
      setValue("programId", programs[0].id);
    }
  }, [preselectedProgramId, programs, setValue, selectedProgramId]);

  const handleInsertTemplate = (templateText: string) => {
    const currentPoC = watch("summaryPoC");
    if (currentPoC && currentPoC.trim() !== "") {
      setValue("summaryPoC", `${currentPoC}\n\n${templateText}`);
    } else {
      setValue("summaryPoC", templateText);
    }
  };

  const handleAddFiles = (newFiles: AttachedFile[]) => {
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const onSubmit = async (values: SubmitReportFormValues) => {
    const selectedProg = programs.find((p) => p.id === values.programId);
    const programName = selectedProg ? selectedProg.companyName : "Target Program";

    try {
      const res = await submitReport({
        programId: values.programId,
        programName,
        targetAsset: values.targetAsset,
        category: values.category,
        severity: values.severity,
        title: values.title,
        summaryPoC: values.summaryPoC,
        impact: values.impact,
        remediation: values.remediation,
        attachments: attachedFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })),
        agreeTerms: values.agreeTerms,
      }).unwrap();

      if (res.success) {
        setSuccessModalData({
          isOpen: true,
          reportId: res.reportId,
          programName,
          title: values.title,
        });
      }
    } catch (err) {
      console.error("Failed to submit report:", err);
    }
  };

  const handleResetForm = () => {
    reset();
    setAttachedFiles([]);
    setSuccessModalData({ isOpen: false, reportId: "", programName: "", title: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full max-w-5xl mx-auto pb-16"
    >
      {/* Header */}
      <SubmitReportHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: TARGET PROGRAM & SCOPE */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              1. Target Program & In-Scope Asset
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Target Program Selection */}
            <div className="space-y-2">
              <Label htmlFor="programId" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Target Program <span className="text-red-500">*</span>
              </Label>
              <select
                id="programId"
                {...register("programId")}
                disabled={isProgramsLoading}
                className="w-full h-10 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:opacity-50"
              >
                {isProgramsLoading ? (
                  <option value="">Loading programs...</option>
                ) : (
                  programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.companyName} — {p.title}
                    </option>
                  ))
                )}
              </select>
              {errors.programId && (
                <p className="text-xs text-red-500 font-medium">{errors.programId.message}</p>
              )}
            </div>

            {/* Target Asset / Endpoint */}
            <div className="space-y-2">
              <Label htmlFor="targetAsset" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Target Asset / Endpoint <span className="text-red-500">*</span>
              </Label>
              <Input
                id="targetAsset"
                placeholder="e.g. https://api.payments.com/v1/charge or *.acme.com"
                {...register("targetAsset")}
                className="bg-white text-base sm:text-sm border-slate-300"
              />
              {errors.targetAsset && (
                <p className="text-xs text-red-500 font-medium">{errors.targetAsset.message}</p>
              )}
            </div>
          </div>

          {/* Vulnerability Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Vulnerability Category (OWASP / CWE) <span className="text-red-500">*</span>
            </Label>
            <select
              id="category"
              {...register("category")}
              className="w-full h-10 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              {VULNERABILITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* SECTION 2: SEVERITY SELECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              2. Vulnerability Severity Rating
            </h2>
          </div>

          <Controller
            name="severity"
            control={control}
            render={({ field }) => (
              <SeveritySelector
                value={field.value as SeverityValue}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* SECTION 3: REPORT DETAILS & POC */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              3. Report Summary & Proof of Concept (PoC)
            </h2>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Report Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Blind SQL Injection in payment gateway /charge endpoint"
              {...register("title")}
              className="bg-white text-base sm:text-sm border-slate-300 font-medium"
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* PoC Description with Template Toolbar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="summaryPoC" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Detailed Steps to Reproduce & PoC <span className="text-red-500">*</span>
              </Label>
              <span className="text-xs text-slate-400 font-medium">Markdown Supported</span>
            </div>

            <PocTemplateToolbar onInsertTemplate={handleInsertTemplate} />

            <textarea
              id="summaryPoC"
              rows={12}
              placeholder="Describe exact steps, HTTP requests, payloads, and reproduction steps..."
              {...register("summaryPoC")}
              className="w-full p-3.5 rounded-b-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed resize-y"
            />
            {errors.summaryPoC && (
              <p className="text-xs text-red-500 font-medium">{errors.summaryPoC.message}</p>
            )}
          </div>

          {/* Optional Impact & Remediation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="impact" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Security & Business Impact <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <textarea
                id="impact"
                rows={3}
                placeholder="Explain potential damage, unauthorized access scope, or financial impact..."
                {...register("impact")}
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remediation" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Suggested Remediation <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <textarea
                id="remediation"
                rows={3}
                placeholder="Provide code fixes, configuration updates, or mitigation steps..."
                {...register("remediation")}
                className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: FILE ATTACHMENTS & COMPLIANCE */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6">
          <FileUploadDropzone
            files={attachedFiles}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
          />

          {/* Disclosure Agreement Checkbox */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                {...register("agreeTerms")}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal">
                I declare that this security report is submitted in good faith following the target program policy, without destructive testing, unauthorized data retention, or public disclosure prior to resolution.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500 font-medium pl-7">{errors.agreeTerms.message}</p>
            )}
          </div>
        </div>

        {/* FORM ACTIONS */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetForm}
            className="border-slate-300 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium px-5 h-11 rounded-xl cursor-pointer"
          >
            Clear Form
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 h-11 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Report...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Report for Triage</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Success Modal Dialog */}
      <ReportSuccessModal
        isOpen={successModalData.isOpen}
        reportId={successModalData.reportId}
        programName={successModalData.programName}
        title={successModalData.title}
        onReset={handleResetForm}
      />
    </motion.div>
  );
}

export default function SubmitReportPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 animate-pulse">
          Loading submit report form...
        </div>
      }
    >
      <SubmitReportContent />
    </Suspense>
  );
}
