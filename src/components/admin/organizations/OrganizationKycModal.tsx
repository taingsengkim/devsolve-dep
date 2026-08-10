"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
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
import {
  useGetAdminOrganizationByIdQuery,
  type CompanyVerificationItem,
} from "@/lib/redux/services/adminApi";

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
  const selectedCompanyId = selectedCompany?.id ?? "";
  const {
    data: organization,
    isLoading: isOrganizationLoading,
    isError: isOrganizationError,
  } = useGetAdminOrganizationByIdQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

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
    const trimmedNotes = notes.trim();
    if (status === "REJECTED" && !trimmedNotes) {
      toast.error("Add a rejection reason before rejecting this organization.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateStatus(selectedCompany.id, status, trimmedNotes);
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
            Review the organization profile and owner verification signals before
            making a decision.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex flex-col gap-4">
          {isOrganizationLoading ? (
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              {[0, 1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-6 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/60">
              {isOrganizationError && (
                <p className="pb-2 text-sm text-slate-500 dark:text-slate-400">
                  Full profile details are unavailable. Summary information is shown.
                </p>
              )}
              <MetadataRow
                icon={<Globe className="size-4" />}
                label="Website"
                value={organization?.websiteUrl || selectedCompany.domain || "—"}
              />
              <MetadataRow
                icon={<Globe className="size-4" />}
                label="Verified Domain"
                value={organization?.domain || "—"}
              />
              <MetadataRow
                icon={<Mail className="size-4" />}
                label="Owner Email"
                value={organization?.ownerEmail || selectedCompany.email || "—"}
              />
              <MetadataRow
                icon={<ShieldCheck className="size-4" />}
                label="Email Verification"
                value={organization?.emailVerified ? "Verified" : "Not verified"}
              />
              <MetadataRow
                icon={<Building2 className="size-4" />}
                label="Industry"
                value={organization?.industry || selectedCompany.businessType || "—"}
              />
              <MetadataRow
                icon={<Calendar className="size-4" />}
                label="Submitted"
                value={selectedCompany.registrationDate || "—"}
                isLast
              />
            </div>
          )}

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
              maxLength={1000}
              className="min-h-24 rounded-xl border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </Field>
        </div>

        <DialogFooter className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button
            variant="destructive"
            disabled={isSubmitting || isOrganizationLoading}
            onClick={() => handleAction("REJECTED")}
            className="h-10 w-full rounded-xl text-sm font-semibold sm:w-auto"
          >
            <XCircle data-icon="inline-start" />
            Reject Request
          </Button>
          <Button
            disabled={isSubmitting || isOrganizationLoading}
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
