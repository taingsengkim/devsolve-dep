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
    return "border-border bg-card text-foreground hover:bg-muted";
  }

  if (option === "Critical") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }
  if (option === "High") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
  if (option === "Medium") {
    return "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400";
  }
  if (option === "Low") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }

  return "border-border bg-muted text-muted-foreground";
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
    <Card className="rounded-2xl bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none shadow-xs">
      <CardHeader className="gap-2">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Severity Adjustment Form
        </CardTitle>
        <p className="text-base text-muted-foreground">
          Confirm the final severity, document why it changed, and prepare feedback for the researcher.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <FieldGroup>
          <Field className="rounded-2xl border border-border bg-muted/40 p-5">
            <FieldLabel className="text-foreground font-semibold">Select correct severity</FieldLabel>
            <FieldContent>
              <ToggleGroup
                value={[selectedSeverity]}
                onValueChange={(value) => {
                  const next = value[value.length - 1];
                  if (next) {
                    setSelectedSeverity(next as SeverityOption);
                  }
                }}
                className="flex w-full flex-wrap gap-2 mt-2"
              >
                {SEVERITY_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={option}
                    variant="outline"
                    className={cn(
                      "rounded-xl border px-5 font-semibold cursor-pointer",
                      getSeverityClass(option, selectedSeverity === option)
                    )}
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <FieldDescription className="text-muted-foreground mt-3">
                Current researcher-submitted severity is{" "}
                <span className="font-semibold text-foreground">
                  {detail.severity} ({detail.cvssScore})
                </span>
                . Select the final company assessment.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="adjustment-explanation" className="text-foreground font-semibold">
              Detailed explanation for adjustment
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="adjustment-explanation"
                placeholder="Describe why the severity was adjusted. This note is visible to the internal security team."
                className="min-h-32 border border-border bg-card text-foreground text-base focus-visible:ring-1 focus-visible:ring-ring"
              />
            </FieldContent>
          </Field>
        </FieldGroup>

        <div className="rounded-3xl border border-border bg-muted/40 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Feedback to hacker
            </Badge>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="findings-summary" className="text-foreground font-semibold">Summary of findings</FieldLabel>
              <FieldContent>
                <Textarea
                  id="findings-summary"
                  placeholder="Briefly summarize your validation steps."
                  className="min-h-24 border border-border bg-card text-foreground text-base focus-visible:ring-1 focus-visible:ring-ring"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="decision-reason" className="text-foreground font-semibold">Reason for decision</FieldLabel>
              <FieldContent>
                <Textarea
                  id="decision-reason"
                  placeholder="Explain the severity decision to the researcher clearly."
                  className="min-h-24 border border-border bg-card text-foreground text-base focus-visible:ring-1 focus-visible:ring-ring"
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="improvement-suggestions" className="text-foreground font-semibold">
                Suggestions for improvement
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="improvement-suggestions"
                  placeholder="Help the researcher submit better reports in the future."
                  className="min-h-24 border border-border bg-card text-foreground text-base focus-visible:ring-1 focus-visible:ring-ring"
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>

        <div className="rounded-2xl border border-dashed border-blue-500/30 bg-blue-500/5 p-5">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-card text-blue-600 dark:text-blue-400 ring-1 ring-border">
              <CloudUpload className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-foreground">
                Upload internal notes or screenshots
              </p>
              <p className="text-sm text-muted-foreground">
                Upload screenshots, logs, or PoC videos to support the company decision.
              </p>
            </div>
            <label
              htmlFor={fileInputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
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
            <p className="text-xs text-muted-foreground">PNG, JPG, PDF, or MP4 up to 25MB</p>
          </div>

          {selectedFiles.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFiles.map((fileName) => (
                <Badge
                  key={fileName}
                  variant="outline"
                  className="border-border bg-muted text-muted-foreground"
                >
                  {fileName}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-foreground">
              Final action for Report #{detail.reportId}
            </p>
            <p className="text-sm text-muted-foreground">
              Selected company severity:{" "}
              <span className="font-semibold text-foreground">{selectedSeverity}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 cursor-pointer"
            >
              <ShieldX data-icon="inline-start" />
              Reject
            </Button>
            <Button className="rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 dark:bg-emerald-600 dark:text-white cursor-pointer">
              <CheckCircle2 data-icon="inline-start" />
              Approve Application
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
