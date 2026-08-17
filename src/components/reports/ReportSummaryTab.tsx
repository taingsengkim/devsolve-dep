import React from "react";
import { Download, ExternalLink, FileText, History, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportSidebarPanels } from "@/components/reports/ReportSidebarPanels";
import type { ReportDetail } from "@/lib/types/reports/types";

interface ReportSummaryTabProps {
  report: ReportDetail;
}

/** A titled card. Rendered only when there is something to put in it. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card p-5 sm:p-6 rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 border border-border shadow-xs space-y-3">
      <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Everything the reporter wrote, as they wrote it.
 *
 * This screen used to be a fixed illustration: a description of an IDOR in
 * `/api/v1/profile/[id]`, four reproduction steps, a `payload.json`
 * attachment and a conversation between "hunter_x_ray" and "Alex (SecOps)" —
 * all of it hardcoded, and all of it shown no matter which report was opened.
 * Every field below now comes from the report, and a field the report does
 * not carry is left out rather than filled in.
 */
export function ReportSummaryTab({ report }: ReportSummaryTabProps) {
  const hasEvidence = report.attachments.length > 0;
  const hasReferences = report.referenceLinks.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Main Content */}
      <main className="lg:col-span-2 space-y-6">
        <Section title="Description">
          <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {report.description}
          </p>
        </Section>

        <Section title="Impact">
          <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
            {report.impact}
          </p>
        </Section>

        {report.reproduceSteps.length > 0 && (
          <Section title="Steps to Reproduce">
            {/* The reporter's own numbering is preserved, so the list is not
                renumbered on top of theirs. */}
            <div className="space-y-2 text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {report.reproduceSteps.map((step, index) => (
                <p key={index}>{step}</p>
              ))}
            </div>
          </Section>
        )}

        {report.proofOfConcept && (
          <Section title="Proof of Concept">
            <pre className="overflow-x-auto rounded-xl bg-muted/60 p-4 text-sm text-foreground border border-border">
              <code className="font-mono">{report.proofOfConcept}</code>
            </pre>
          </Section>
        )}

        {report.remediation && (
          <Section title="Suggested Remediation">
            <p className="text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {report.remediation}
            </p>
          </Section>
        )}

        {hasReferences && (
          <Section title="Reference Links">
            <ul className="space-y-2">
              {report.referenceLinks.map((link) => (
                <li key={link}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 text-base font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {link}
                    <ExternalLink className="size-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Evidence & Attachments">
          {hasEvidence ? (
            <div className="space-y-2.5">
              {report.attachments.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-3 p-3.5 bg-muted/40 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Paperclip className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-foreground truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {[file.size, file.type].filter(Boolean).join(" • ")}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                    title="Download attachment"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="flex items-center gap-2 text-base text-muted-foreground">
              <FileText className="size-4 shrink-0" />
              No files were attached to this report.
            </p>
          )}
        </Section>

        <Section title="Activity">
          {report.updates.length > 0 ? (
            <ol className="space-y-3">
              {report.updates.map((update) => (
                <li key={update.id} className="flex items-start gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <div className="min-w-0">
                    <p className="text-base text-foreground">
                      <span className="font-semibold">{update.actor}</span>{" "}
                      {update.actionText}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {update.timestamp}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="flex items-center gap-2 text-base text-muted-foreground">
              <History className="size-4 shrink-0" />
              Nothing has happened on this report yet.
            </p>
          )}
        </Section>
      </main>

      {/* Right Column: Sidebar */}
      <ReportSidebarPanels report={report} />
    </div>
  );
}
