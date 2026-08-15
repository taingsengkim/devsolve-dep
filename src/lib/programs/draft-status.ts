import type { ProgramSubmissionState } from "@/lib/types/admin/programAdminTypes";

/**
 * Where a program stands, read from the two fields that move independently.
 *
 * `state` is the lifecycle — `DRAFT` until someone publishes it, then `ACTIVE`,
 * `PAUSED` or `CLOSED`. `submissionState` is the review — `NOT_SUBMITTED`,
 * then `PENDING_REVIEW`, then `APPROVED` or `REJECTED`. Neither implies the
 * other, and a program sits at `DRAFT` through all of it: while the reviewers
 * hold it, and again after they approve it, right up until it is published.
 *
 * So `state === "DRAFT"` does not mean "a draft". Reading it that way is what
 * let a program already with the reviewers be listed under Saved drafts,
 * opened in the editor, saved, and announced as a draft — none of which was
 * true of it. Both screens that ask the question now answer it from here, so
 * they cannot drift apart again.
 */

/** The fields this module needs, shared by the summary and detail responses. */
export interface ProgramLike {
  state?: string | null;
  submissionState?: ProgramSubmissionState | null;
}

/**
 * Whether the program exists anywhere outside its own organization.
 *
 * Everything at `DRAFT` does not — not the unsubmitted, not the one under
 * review, and not the approved one still waiting for its owner to publish.
 * `PAUSED` and `CLOSED` do: they were public once, and their pages stay
 * reachable.
 */
export function isPublished(program: ProgramLike | null | undefined): boolean {
  return Boolean(program) && program?.state !== "DRAFT";
}

/** With the reviewers, and read-only until they answer. */
export function isUnderReview(program: ProgramLike | null | undefined): boolean {
  return program?.submissionState === "PENDING_REVIEW";
}

/**
 * Still the author's to finish: never submitted, or handed back to them.
 *
 * An approved program is deliberately excluded. It is waiting to be published
 * rather than drafted, and the control for that lives in program management.
 */
export function isEditableDraft(
  program: ProgramLike | null | undefined,
): boolean {
  if (!program || program.state !== "DRAFT") return false;

  return (
    program.submissionState === "NOT_SUBMITTED" ||
    program.submissionState === "REJECTED" ||
    /* Records written before the backend had `NOT_SUBMITTED` carry no review
       status at all; they are drafts nobody ever submitted. */
    !program.submissionState
  );
}
