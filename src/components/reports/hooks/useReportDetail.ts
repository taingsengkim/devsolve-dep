import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetReportByIdQuery,
  useAddReportCommentMutation,
  RetestItem,
  MOCK_RETEST_HISTORY,
} from "@/lib/redux/services/reportsApi";

export type ReportTab = "summary" | "retest";

export function useReportDetail() {
  const params = useParams();
  const router = useRouter();
  const reportId = (params?.id as string) || "1";

  const {
    data: initialReport,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReportByIdQuery(reportId);
  const [addComment, { isLoading: isSubmitting }] = useAddReportCommentMutation();

  // Mode state: allow toggling between Accepted/Triaging view and Rejected view
  const [isForceRejected, setIsForceRejected] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTab>("summary");
  const [commentText, setCommentText] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Retest history local state to allow interactive switching between states
  const [retestHistory, setRetestHistory] = useState<RetestItem[]>([]);

  const handleBack = () => {
    router.back();
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment({ reportId, text: commentText }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleInitiateRetest = () => {
    setRetestHistory(MOCK_RETEST_HISTORY);
  };

  const handleResetRetest = () => {
    setRetestHistory([]);
  };

  /* Copies this report's proof of concept. It used to copy one hardcoded XSS
     string, so every report handed over the same payload regardless of what
     was actually reported. */
  const handleCopyPayload = () => {
    const payload = initialReport?.proofOfConcept;
    if (!payload) return;

    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  /* Read from the report itself. `reportId === "5"` used to force the rejected
     view for one hardcoded id, a leftover from the mock data. */
  const isRejected =
    isForceRejected !== null ? isForceRejected : initialReport?.status === "REJECTED";

  /* The real report, whatever its state. A rejected one used to be swapped for
     `MOCK_REJECTED_REPORT_DETAIL` wholesale, so every rejected report in the
     system displayed the same invented finding and rejection reason. */
  const report = initialReport;

  return {
    reportId,
    report,
    isLoading,
    isError,
    error,
    refetch,
    isRejected,
    setIsForceRejected,
    activeTab,
    setActiveTab,
    commentText,
    setCommentText,
    isSubmitting,
    copiedPayload,
    retestHistory,
    handleBack,
    handleSendComment,
    handleInitiateRetest,
    handleResetRetest,
    handleCopyPayload,
  };
}
