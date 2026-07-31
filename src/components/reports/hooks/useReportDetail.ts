import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetReportByIdQuery,
  useAddReportCommentMutation,
  RetestItem,
  MOCK_RETEST_HISTORY,
  MOCK_REJECTED_REPORT_DETAIL,
} from "@/lib/redux/services/reportsApi";

export type ReportTab = "summary" | "retest";

export function useReportDetail() {
  const params = useParams();
  const router = useRouter();
  const reportId = (params?.id as string) || "1";

  const { data: initialReport, isLoading } = useGetReportByIdQuery(reportId);
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

  const handleCopyPayload = () => {
    navigator.clipboard.writeText("/search?q=%3Cscript%3Ealert(document.domain)%3C/script%3E");
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const isRejected =
    isForceRejected !== null
      ? isForceRejected
      : initialReport?.status === "REJECTED" || reportId === "5";

  const report = isRejected ? MOCK_REJECTED_REPORT_DETAIL : initialReport;

  return {
    reportId,
    report,
    isLoading,
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
