import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProgramsQuery } from "@/lib/redux/services/programsApi";
import { useSubmitReportMutation } from "@/lib/redux/services/reportsApi";
import {
  submitReportSchema,
  SubmitReportFormValues,
} from "@/lib/validations/report";
import { AttachedFile } from "@/components/reports/FileUploadDropzone";

export interface ReportSuccessModalData {
  isOpen: boolean;
  reportId: string;
  programName: string;
  title: string;
}

export function useSubmitReportForm() {
  const searchParams = useSearchParams();
  const preselectedProgramId = searchParams.get("programId") || "";

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successModalData, setSuccessModalData] = useState<ReportSuccessModalData>({
    isOpen: false,
    reportId: "",
    programName: "",
    title: "",
  });

  const { data: programsData, isLoading: isProgramsLoading } = useGetProgramsQuery();
  const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation();

  const programs = programsData?.data || [];

  const form = useForm<SubmitReportFormValues>({
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

  const { setValue, watch, reset } = form;
  const selectedProgramId = watch("programId");

  // Synchronize preselected program ID when programs arrive asynchronously
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

  const handleResetForm = () => {
    reset();
    setAttachedFiles([]);
    setSubmitError(null);
    setSuccessModalData({ isOpen: false, reportId: "", programName: "", title: "" });
  };

  const onSubmit = async (values: SubmitReportFormValues) => {
    setSubmitError(null);
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
    } catch (err: unknown) {
      console.error("Failed to submit report:", err);
      setSubmitError("Failed to submit vulnerability report. Please verify inputs and try again.");
    }
  };

  return {
    ...form,
    programs,
    isProgramsLoading,
    isSubmitting,
    attachedFiles,
    submitError,
    successModalData,
    handleAddFiles,
    handleRemoveFile,
    handleInsertTemplate,
    handleResetForm,
    onSubmit,
  };
}
