"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Flag, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateFlagMutation } from "@/lib/redux/services/flagsApi";
import type { FlagReason } from "@/lib/validations/engagement";
import { parseApiError } from "@/lib/api/errors";

/**
 * Reporting one comment to the moderators.
 *
 * A reason is required because the backend enum has no default; the note is
 * optional and is what a moderator actually reads when the reason alone does
 * not explain the report.
 */

const REASONS: { value: FlagReason; label: string; hint: string }[] = [
  { value: "SPAM", label: "Spam", hint: "Advertising or repeated posting" },
  {
    value: "OFFENSIVE",
    label: "Offensive",
    hint: "Abuse, harassment or hate",
  },
  { value: "OFF_TOPIC", label: "Off topic", hint: "Nothing to do with the post" },
  { value: "DUPLICATE", label: "Duplicate", hint: "Already said elsewhere" },
  { value: "OTHER", label: "Something else", hint: "Explain below" },
];

export function ReportCommentDialog({
  commentId,
  authorName,
  open,
  onOpenChange,
}: {
  commentId: string;
  authorName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState<FlagReason | null>(null);
  const [description, setDescription] = useState("");
  const [createFlag, { isLoading }] = useCreateFlagMutation();

  const close = () => {
    onOpenChange(false);
    setReason(null);
    setDescription("");
  };

  const submit = async () => {
    if (!reason) return;

    try {
      await createFlag({
        flaggableType: "COMMENT",
        flaggableId: commentId,
        reason,
        description: description.trim() || undefined,
      }).unwrap();

      toast.success("Report sent.", {
        description: "A moderator will take a look at this comment.",
      });
      close();
    } catch (error) {
      toast.error(parseApiError(error, "Your report could not be sent.").message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="size-4.5 text-rose-600 dark:text-rose-400" />
            Report this comment
          </DialogTitle>
          <DialogDescription>
            {authorName
              ? `Tell the moderators what is wrong with ${authorName}'s comment. They see the comment and your note; ${authorName} does not.`
              : "Tell the moderators what is wrong. They see the comment and your note; its author does not."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label
              htmlFor="report-reason"
              className="block text-base font-semibold text-foreground"
            >
              Reason
            </label>
            <Select
              value={reason ?? undefined}
              onValueChange={(value: string | null) => {
                if (value) setReason(value as FlagReason);
              }}
            >
              <SelectTrigger
                id="report-reason"
                className="h-11 w-full rounded-xl border-border bg-background text-base"
              >
                <SelectValue placeholder="Pick a reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reason && (
              <p className="text-sm text-muted-foreground">
                {REASONS.find((option) => option.value === reason)?.hint}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="report-note"
              className="block text-base font-semibold text-foreground"
            >
              Anything to add?{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <Textarea
              id="report-note"
              rows={3}
              value={description}
              maxLength={2000}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What should a moderator know?"
              className="rounded-xl border-border bg-background text-base text-foreground"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            disabled={isLoading}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void submit()}
            disabled={!reason || isLoading}
            className="cursor-pointer rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          >
            {isLoading ? (
              <Loader2
                data-icon="inline-start"
                className="animate-spin motion-reduce:animate-none"
              />
            ) : (
              <Flag data-icon="inline-start" />
            )}
            Send report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
