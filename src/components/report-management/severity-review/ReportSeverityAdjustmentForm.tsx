"use client";

import { useId, useState } from "react";
import { CheckCircle2, CloudUpload, FileText, ShieldX } from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const SEVERITY_OPTIONS = ["Critical", "High", "Medium", "Low", "Info"] as const;

type SeverityOption = (typeof SEVERITY_OPTIONS)[number];

type ReportSeverityAdjustmentFormProps = {
  detail: ReportManagementDetail;
};

function getSeverityClass(option: SeverityOption, selected: boolean) {
  if (!selected) {
    return "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50";
  }

  if (option === "Critical") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  if (option === "High") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }
  if (option === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (option === "Low") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function ReportSeverityAdjustmentForm({
  detail,
}: ReportSeverityAdjustmentFormProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityOption>(
    detail.severity
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const fileInputId = useId();

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Severity Adjustment Form
        </CardTitle>
        <p className="text-base text-slate-500">
          Confirm the final severity, document why it changed, and prepare feedback for the researcher.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <Field className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <FieldLabel>Select correct severity</FieldLabel>
            <FieldContent>
              <ToggleGroup
                value={selectedSeverity}
                onValueChange={(value) => {
                  if (value) {
                    setSelectedSeverity(value as SeverityOption);
                  }
                }}
                className="flex w-full flex-wrap gap-2"
              >
                {SEVERITY_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={option}
                    variant="outline"
                    className={cn(
                      "rounded-xl border px-5 font-semibold",
                      getSeverityClass(option, selectedSeverity === option)
                    )}
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldDescription>
                Current researcher-submitted severity is{" "}
                <span className="font-semibold text-slate-700">
                  {detail.severity} ({detail.cvssScore})
                </span>
                . Select the final company assessment.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="adjustment-explanation">
              Detailed explanation for adjustment
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="adjustment-explanation"
                placeholder="Describe why the severity was adjusted. This note is visible to the internal security team."
                className="min-h-32 border border-slate-200 bg-white text-base"
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="border-blue-200 bg-white text-blue-700">
              Feedback to hacker
            </Badge>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="findings-summary">Summary of findings</FieldLabel>
              <FieldContent>
                <Textarea
                  id="findings-summary"
                  placeholder="Briefly summarize your validation steps."
                  className="min-h-24 border border-slate-200 bg-white text-base"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="decision-reason">Reason for decision</FieldLabel>
              <FieldContent>
                <Textarea
                  id="decision-reason"
                  placeholder="Explain the severity decision to the researcher clearly."
                  className="min-h-24 border border-slate-200 bg-white text-base"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="improvement-suggestions">
                Suggestions for improvement
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="improvement-suggestions"
                  placeholder="Help the researcher submit better reports in the future."
                  className="min-h-24 border border-slate-200 bg-white text-base"
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>

        <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/40 p-5">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200">
              <CloudUpload className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-slate-900">
                Upload internal notes or screenshots
              </p>
              <p className="text-sm text-slate-500">
                Upload screenshots, logs, or PoC videos to support the company decision.
              </p>
            </div>
            <label
              htmlFor={fileInputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <FileText className="size-4" />
              Choose files
            </label>
            <input
              id={fileInputId}
              type="file"
              multiple
              className="sr-only"
              onChange={(event) =>
                setSelectedFiles(
                  Array.from(event.target.files ?? []).map((file) => file.name)
                )
              }
            />
            <p className="text-xs text-slate-400">PNG, JPG, PDF, or MP4 up to 25MB</p>
          </div>

          {selectedFiles.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFiles.map((fileName) => (
                <Badge
                  key={fileName}
                  variant="outline"
                  className="border-slate-200 bg-white text-slate-600"
                >
                  {fileName}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-slate-900">
              Final action for Report #{detail.reportId}
            </p>
            <p className="text-sm text-slate-500">
              Selected company severity:{" "}
              <span className="font-semibold text-slate-700">{selectedSeverity}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <ShieldX data-icon="inline-start" />
              Reject
            </Button>
            <Button className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
              <CheckCircle2 data-icon="inline-start" />
              Approve Application
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
