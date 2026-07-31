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
import { Input } from "@/components/ui/input";
import { Building2, CheckCircle2, XCircle, Globe, ShieldCheck, FileCheck, Mail, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";

interface OrganizationKycModalProps {
  selectedCompany: CompanyVerificationItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "APPROVED" | "REJECTED", notes?: string) => Promise<void>;
}

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
      <DialogContent className="max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>KYC / KYB Verification Audit</span>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pt-1">
            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {selectedCompany.companyName}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Review corporate tax identifiers and legal business documents before approving VDP rights.
          </DialogDescription>
        </DialogHeader>

        {/* REGISTRATION METADATA GRID */}
        <div className="space-y-4 my-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Globe className="w-3.5 h-3.5" /> Domain:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.domain}
              </span>
            </div>

            <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Hash className="w-3.5 h-3.5" /> Tax Identifier:
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.taxId}
              </span>
            </div>

            <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Mail className="w-3.5 h-3.5" /> Contact Email:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.email}
              </span>
            </div>

            <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5" /> Category:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.businessType}
              </span>
            </div>

            <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <FileCheck className="w-3.5 h-3.5" /> Verification Docs:
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {selectedCompany.documentsCount} Documents Attached
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Registration Date:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCompany.registrationDate}
              </span>
            </div>
          </div>

          {/* ADMIN VERIFICATION NOTES */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Admin Audit Notes & Justification
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Certificate of incorporation verified against official registry..."
              className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-xs h-10"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => handleAction("REJECTED")}
            className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-xs"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Reject Request
          </Button>

          <Button
            disabled={isSubmitting}
            onClick={() => handleAction("APPROVED")}
            className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto text-xs shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Approve & Verify KYC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
