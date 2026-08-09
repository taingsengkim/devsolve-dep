"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileCheck,
  Globe,
  Hash,
  Mail,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CompanyVerificationItem } from "@/lib/redux/services/adminApi";

interface OrganizationKycModalProps {
  selectedCompany: CompanyVerificationItem | null;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: "APPROVED" | "REJECTED",
    notes?: string,
  ) => Promise<void>;
}

interface MetadataRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

function MetadataRow({ icon, label, value, isLast = false }: MetadataRowProps) {
  return (
    <div
      className={`flex flex-col gap-1 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
        isLast ? "" : "border-b border-slate-200/70 dark:border-slate-700/70"
      }`}
    >
      <span className="flex shrink-0 items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </span>
      <span className="break-all font-semibold text-slate-900 sm:text-right dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

export const OrganizationKycModal: React.FC<OrganizationKycModalProps> = ({
  selectedCompany,
  onClose,
  onUpdateStatus,
}) => {
  const [notesDraft, setNotesDraft] = useState({ companyId: "", value: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedCompany) return null;

  const notes =
    notesDraft.companyId === selectedCompany.id
      ? notesDraft.value
      : selectedCompany.notes || "";

  const closeModal = () => {
    setNotesDraft({ companyId: "", value: "" });
    onClose();
  };

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    try {
      setIsSubmitting(true);
      await onUpdateStatus(selectedCompany.id, status, notes);
      toast.success(
        status === "APPROVED"
          ? `Organization "${selectedCompany.companyName}" verified!`
          : `KYC request for "${selectedCompany.companyName}" rejected.`,
      );
      closeModal();
    } catch {
      toast.error("Failed to update verification status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={Boolean(selectedCompany)}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
        <DialogHeader className="gap-1.5">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <ShieldCheck className="size-4" />
            <span>KYC / KYB Verification Audit</span>
          </div>
          <DialogTitle className="flex items-center gap-2 pt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            <Building2 className="size-5 text-slate-500 dark:text-slate-400" />
            {selectedCompany.companyName}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Review corporate tax identifiers and legal business documents before
            approving VDP rights.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex flex-col gap-4">
          <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/60">
            <MetadataRow
              icon={<Globe className="size-4" />}
              label="Domain"
              value={selectedCompany.domain || "—"}
            />
            <MetadataRow
              icon={<Hash className="size-4" />}
              label="Tax Identifier"
              value={<span className="font-mono">{selectedCompany.taxId || "—"}</span>}
            />
            <MetadataRow
              icon={<Mail className="size-4" />}
              label="Contact Email"
              value={selectedCompany.email || "—"}
            />
            <MetadataRow
              icon={<Building2 className="size-4" />}
              label="Category"
              value={selectedCompany.businessType || "—"}
            />
            <MetadataRow
              icon={<FileCheck className="size-4" />}
              label="Verification Docs"
              value={`${selectedCompany.documentsCount} documents attached`}
            />
            <MetadataRow
              icon={<Calendar className="size-4" />}
              label="Registration Date"
              value={selectedCompany.registrationDate || "—"}
              isLast
            />
          </div>

          <Field className="gap-2">
            <FieldLabel
              htmlFor="organization-audit-notes"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Admin Audit Notes & Justification
            </FieldLabel>
            <Textarea
              id="organization-audit-notes"
              value={notes}
              onChange={(event) =>
                setNotesDraft({
                  companyId: selectedCompany.id,
                  value: event.target.value,
                })
              }
              placeholder="e.g. Certificate of incorporation verified against official registry..."
              className="min-h-24 rounded-xl border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </Field>
        </div>

        <DialogFooter className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => handleAction("REJECTED")}
            className="h-10 w-full rounded-xl text-sm font-semibold sm:w-auto"
          >
            <XCircle data-icon="inline-start" />
            Reject Request
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => handleAction("APPROVED")}
            className="h-10 w-full rounded-xl text-sm font-semibold sm:w-auto"
          >
            <CheckCircle2 data-icon="inline-start" />
            Approve & Verify KYC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
