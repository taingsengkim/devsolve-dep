/**
 * Telling "there is no such profile" apart from "the lookup failed".
 *
 * The distinction decides what the screen says and whether it offers a retry,
 * so it is read from the status the backend actually returned rather than
 * guessed. RTK Query hands back either a `FetchBaseQueryError`, whose `status`
 * is the HTTP code (or a string like `"FETCH_ERROR"` when the request never
 * arrived), or a `SerializedError` from a thrown exception — which has no
 * status at all, and is therefore never a 404.
 */
export function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === 404
  );
}
