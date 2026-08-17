"use client";

import React, { useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { toPng } from "html-to-image";
import {
  Check,
  Download,
  Loader2,
  Maximize2,
  Network,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DiagramCanvas } from "./DiagramCanvas";
import { toast } from "sonner";

interface DiagramBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveDiagram: (file: File, previewUrl: string) => void;
  stepTitle?: string;
}

export function DiagramBuilderModal({
  open,
  onOpenChange,
  onSaveDiagram,
  stepTitle,
}: DiagramBuilderModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAndAttach = async () => {
    try {
      setIsExporting(true);
      const viewportEl = document.querySelector(
        "#react-flow-diagram-viewport .react-flow__viewport",
      ) as HTMLElement | null;

      const containerEl = document.querySelector(
        "#react-flow-diagram-viewport",
      ) as HTMLElement | null;

      const targetEl = containerEl || viewportEl;

      if (!targetEl) {
        toast.error("Could not capture diagram canvas");
        setIsExporting(false);
        return;
      }

      // Hide controls/minimap temporarily or style properly if capturing container
      const dataUrl = await toPng(targetEl, {
        backgroundColor: "#0b0f17",
        quality: 0.95,
        pixelRatio: 2,
        filter: (node) => {
          // exclude control buttons and minimap from the exported image
          const exclusionClasses = [
            "react-flow__controls",
            "react-flow__minimap",
          ];
          return !exclusionClasses.some((cls) =>
            (node as HTMLElement)?.classList?.contains(cls),
          );
        },
      });

      // Convert dataUrl to Blob -> File
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const filename = `diagram-${Date.now()}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      onSaveDiagram(file, dataUrl);
      toast.success("Diagram attached to step!");
      onOpenChange(false);
    } catch (err) {
      console.error("Diagram export error:", err);
      toast.error("Failed to generate diagram image");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-1/2 left-1/2 z-50 flex h-[90vh] max-h-[90vh] w-[95vw] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-3xl border border-border bg-background p-0 shadow-2xl outline-none sm:max-w-[95vw] lg:max-w-[1400px]"
      >
        {/* ── Modal Header ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/95 px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Network className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                React Flow Diagram Builder
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {stepTitle
                  ? `Designing diagram for step: "${stepTitle}"`
                  : "Design an architecture or flow diagram and attach it directly"}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-xl border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={isExporting}
              onClick={handleExportAndAttach}
              className="h-9 gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              {isExporting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  Attach to Step
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── Canvas Provider & Body ── */}
        <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
          <ReactFlowProvider>
            <DiagramCanvas />
          </ReactFlowProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
