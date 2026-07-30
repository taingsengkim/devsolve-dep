import React from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitReportActionsProps {
  isSubmitting: boolean;
  submitError?: string | null;
  onReset: () => void;
}

export function SubmitReportActions({
  isSubmitting,
  submitError,
  onReset,
}: SubmitReportActionsProps) {
  return (
    <div className="space-y-4">
      {submitError && (
        <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
          {submitError}
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
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
    </div>
  );
}
