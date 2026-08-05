import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetProgramsQuery } from "@/lib/redux/services/program/programsApi";
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

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [externalLinks, setExternalLinks] = useState<string[]>([""]);
  const [reproduceStepsList, setReproduceStepsList] = useState<string[]>([
    "Send a GET request to /api/v1/invoices/1337 with valid user JWT.",
    "Observe successful 200 OK response with billing details.",
    "Change the invoice ID parameter to another user's invoice ID (e.g. 1338).",
    "Send request again and verify response status code.",
  ]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);
  const [successModalData, setSuccessModalData] =
    useState<ReportSuccessModalData>({
      isOpen: false,
      reportId: "",
      programName: "",
      title: "",
    });

  const { data: programsData, isLoading: isProgramsLoading } =
    useGetProgramsQuery();
  const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation();

  const programs = programsData?.content || [];

  const form = useForm<SubmitReportFormValues>({
    resolver: zodResolver(submitReportSchema),
    defaultValues: {
      programId: preselectedProgramId,
      targetAsset: "https://api.nexacloud.com/v1/invoices/1337",
      httpMethod: "GET",
      vulnerableParameter: "",
      environment: "Production",
      title: "",
      category: "Insecure Direct Object Reference (IDOR)",
      severity: "CRITICAL",
      cweIdentifier: "CWE-639",
      cvssScore: "8.1",
      cvssVector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      summaryPoC: "",
      reproduceStepsList: [],
      impact: "",
      remediation: "",
      pocPayload: "",
      expectedResult:
        "Server returns 403 Forbidden for invoice IDs belonging to other users.",
      actualResult:
        "Server returns 200 OK with full billing data of the victim user.",
      externalLinks: [],
      checklistInScope: false,
      checklistNotDuplicate: false,
      checklistReproducible: false,
      checklistNoPii: false,
      checklistAgreeTerms: false,
    },
  });

  const { setValue, watch, reset, trigger } = form;
  const selectedProgramId = watch("programId");
  const selectedSeverity = watch("severity");

  const selectedProgram =
    programs.find((p) => p.id === selectedProgramId) || programs[0] || null;

  // Synchronize preselected program ID when programs arrive asynchronously.
  // Links into this form from a program's page (ProgramDetailHero/Sidebar)
  // still carry that page's mock program id, which will never match a real
  // program from useGetSubmittableProgramsQuery — so a match is required,
  // not just a non-empty id, or the field gets stuck on an invalid id that
  // silently fails at submit time.
  useEffect(() => {
    if (programs.length === 0) return;
    const found = programs.find((p) => p.id === preselectedProgramId);
    if (found) {
      setValue("programId", found.id);
    } else if (!programs.some((p) => p.id === selectedProgramId)) {
      setValue("programId", programs[0].id);
    }
  }, [preselectedProgramId, programs, setValue, selectedProgramId]);

  // Sync default target asset when selected program changes if using placeholder
  useEffect(() => {
    if (
      selectedProgram &&
      selectedProgram.inScopeAssets &&
      selectedProgram.inScopeAssets.length > 0
    ) {
      const currentAsset = watch("targetAsset");
      const defaultDomain = selectedProgram.inScopeAssets[0].identifier.replace(
        "*.",
        "api.",
      );
      if (
        !currentAsset ||
        currentAsset === "https://api.nexacloud.com/v1/invoices/1337"
      ) {
        setValue("targetAsset", `https://${defaultDomain}/v1/endpoint`);
      }
    }
  }, [selectedProgram?.id, setValue, watch]);

  // Handle Step Navigation & Validation
  const validateCurrentStep = async (): Promise<boolean> => {
    let fieldsToValidate: (keyof SubmitReportFormValues)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = [
        "programId",
        "targetAsset",
        "httpMethod",
        "environment",
      ];
    } else if (currentStep === 2) {
      fieldsToValidate = ["title", "category", "severity"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["summaryPoC"];
    } else if (currentStep === 4) {
      // Step 4 is PoC optional/unvalidated
      return true;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      return isValid;
    }
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
    }
  };

  // External Links Dynamic List
  const handleAddExternalLink = () => {
    setExternalLinks((prev) => [...prev, ""]);
  };

  const handleRemoveExternalLink = (index: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateExternalLink = (index: number, val: string) => {
    setExternalLinks((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

  // Steps to Reproduce Dynamic List
  const handleAddReproduceStep = () => {
    setReproduceStepsList((prev) => [...prev, ""]);
  };

  const handleRemoveReproduceStep = (index: number) => {
    setReproduceStepsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateReproduceStep = (index: number, val: string) => {
    setReproduceStepsList((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  };

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

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleResetForm = () => {
    reset();
    setCurrentStep(1);
    setCompletedSteps([]);
    setAttachedFiles([]);
    setExternalLinks([""]);
    setSubmitError(null);
    setSuccessModalData({
      isOpen: false,
      reportId: "",
      programName: "",
      title: "",
    });
  };

  const onSubmit = async (values: SubmitReportFormValues) => {
    setSubmitError(null);
    const selectedProg = programs.find((p) => p.id === values.programId);
    const programName = selectedProg
      ? selectedProg.organizationName
      : "CloudVault Security Program";
    const assetId = selectedProg?.inScopeAssets?.[0]?.id;

    try {
      const res = await submitReport({
        programId: values.programId,
        programName,
        assetId,
        targetAsset: values.targetAsset,
        httpMethod: values.httpMethod,
        vulnerableParameter: values.vulnerableParameter,
        environment: values.environment,
        category: values.category,
        severity: values.severity,
        cweIdentifier: values.cweIdentifier,
        cvssScore: values.cvssScore,
        cvssVector: values.cvssVector,
        title: values.title,
        summaryPoC: values.summaryPoC,
        reproduceStepsList,
        impact: values.impact,
        remediation: values.remediation,
        pocPayload: values.pocPayload,
        expectedResult: values.expectedResult,
        actualResult: values.actualResult,
        attachments: attachedFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
        externalLinks: externalLinks.filter((l) => l.trim() !== ""),
        agreeTerms: values.checklistAgreeTerms,
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
      setSubmitError(
        "Failed to submit vulnerability report. Please verify inputs and try again.",
      );
    }
  };

  return {
    ...form,
    errors: form.formState.errors,
    currentStep,
    completedSteps,
    selectedSeverity,
    selectedProgram,
    programs,
    isProgramsLoading,
    isSubmitting,
    attachedFiles,
    externalLinks,
    reproduceStepsList,
    submitError,
    isDraftSaved,
    successModalData,
    nextStep,
    prevStep,
    goToStep,
    handleAddFiles,
    handleRemoveFile,
    handleAddExternalLink,
    handleRemoveExternalLink,
    handleUpdateExternalLink,
    handleAddReproduceStep,
    handleRemoveReproduceStep,
    handleUpdateReproduceStep,
    handleInsertTemplate,
    handleSaveDraft,
    handleResetForm,
    onSubmit,
  };
}
