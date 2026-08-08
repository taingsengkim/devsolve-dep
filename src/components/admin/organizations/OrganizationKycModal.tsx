"use client";

import React, { useState, useEffect } from "react";
import { CompanyVerificationItem } from "@/lib/redux/services/adminApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CheckCircle2, XCircle, Globe, FileCheck, Mail, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";

interface OrganizationKycModalProps {
  selectedCompany: CompanyVerificationItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "APPROVED" | "REJECTED", notes?: string) => Promise<void>;
}

const formatTitleCase = (str?: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const OrganizationKycModal: React.FC<OrganizationKycModalProps> = ({
  selectedCompany,
  onClose,
  onUpdateStatus,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCompany) {
      setNotes(selectedCompany.notes || "");
    } else {
      setNotes("");
    }
  }, [selectedCompany]);

  if (!selectedCompany) return null;

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    try {
      setIsSubmitting(true);
      await onUpdateStatus(selectedCompany.id, status, notes);
      toast.success(
        status === "APPROVED"
          ? `Organization "${selectedCompany.companyName}" verified!`
          : `KYC request for "${selectedCompany.companyName}" rejected.`
      );
      onClose();
    } catch (err) {
      toast.error("Failed to update verification status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!selectedCompany} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-xl sm:max-w-xl rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pt-1">
            {selectedCompany.companyName}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-700 dark:text-slate-300 font-normal">
            Review corporate tax identifiers and legal business documents before approving VDP rights.
          </DialogDescription>
        </DialogHeader>

        {/* REGISTRATION METADATA GRID */}
        <div className="space-y-4 my-2">
          <div className="text-sm">
            <div className="flex items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-1/3 shrink-0 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4 text-slate-400" /> Domain:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.domain}
              </span>
            </div>

            <div className="flex items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-1/3 shrink-0 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Hash className="w-4 h-4 text-slate-400" /> Tax Identifier:
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.taxId}
              </span>
            </div>

            <div className="flex items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-1/3 shrink-0 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-slate-400" /> Contact Email:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.email}
              </span>
            </div>

            <div className="flex items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-1/3 shrink-0 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" /> Category:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatTitleCase(selectedCompany.businessType)}
              </span>
            </div>

            <div className="flex items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-1/3 shrink-0 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <FileCheck className="w-4 h-4 text-slate-400" /> Verification Docs:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {selectedCompany.documentsCount} Documents Attached
              </span>
            </div>

            <div className="flex items-center py-2.5 border-b border-slate-100 dark:border-slate-800">
              <span className="w-1/3 shrink-0 text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" /> Registration Date:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.registrationDate}
              </span>
            </div>
          </div>

          {/* ADMIN VERIFICATION NOTES */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
              Admin Audit Notes & Justification
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Certificate of incorporation verified against official registry..."
              className="mt-2 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm min-h-[76px] p-2.5 focus-visible:ring-1 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 shadow-none resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-2">
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => handleAction("REJECTED")}
            className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-sm"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Reject Request
          </Button>

          <Button
            disabled={isSubmitting}
            onClick={() => handleAction("APPROVED")}
            className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto text-sm shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Approve & Verify KYC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
