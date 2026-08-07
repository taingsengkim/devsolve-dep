/**
 * Turns whatever an RTK Query mutation rejected with into something worth
 * showing a person.
 *
 * There are four error envelopes in play across this app and the backend:
 *
 *  - the backend's own `{ message, code, status, timestamp, errorDetails }`
 *  - Spring's default `{ timestamp, status, error, path }`, used whenever a
 *    request doesn't reach a controller
 *  - Spring validation's `{ errors: [{ field, defaultMessage }] }`
 *  - our Next route handlers' `{ message, formErrors, fieldErrors }` from Zod
 *
 * Plus RTK Query's own transport failures, which carry no body at all.
 */

export interface ParsedApiError {
  /** Always populated — never an empty string. */
  message: string;
  /** Per-field messages keyed by the field name the server used. */
  fieldErrors: Record<string, string>;
  /** HTTP status, when the request actually got a response. */
  status?: number;
}

const STATUS_FALLBACKS: Record<number, string> = {
  400: "Some of the details weren't accepted. Check the fields below.",
  401: "Your session has expired. Sign in again to continue.",
  403: "You don't have permission to make this change.",
  404: "That record no longer exists.",
  409: "That value is already taken by someone else.",
  413: "That file is too large.",
  415: "That file type isn't supported.",
  422: "Some of the details weren't accepted. Check the fields below.",
  429: "Too many attempts. Wait a moment and try again.",
  500: "The server hit an error. Nothing was saved.",
  502: "The server is unreachable right now.",
  503: "The service is temporarily unavailable.",
  504: "The server took too long to respond.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Pulls `{ field: message }` out of the several shapes the backend uses. */
function extractFieldErrors(body: Record<string, unknown>): Record<string, string> {
  const found: Record<string, string> = {};

  // Our Zod route handlers: { fieldErrors: { phone: ["..."] } }
  if (isRecord(body.fieldErrors)) {
    for (const [field, value] of Object.entries(body.fieldErrors)) {
      const text = Array.isArray(value) ? value[0] : value;
      if (typeof text === "string" && text) found[field] = text;
    }
  }

  // Spring validation: { errors: [{ field, defaultMessage }] }
  const springErrors = body.errors ?? body.errorDetails;
  if (Array.isArray(springErrors)) {
    for (const entry of springErrors) {
      if (!isRecord(entry)) continue;
      const field = entry.field ?? entry.fieldName ?? entry.property;
      const text = entry.defaultMessage ?? entry.message ?? entry.reason;
      if (typeof field === "string" && typeof text === "string" && text) {
        found[field] = text;
      }
    }
  }

  // The same key sometimes arrives as a flat map instead of a list.
  if (isRecord(springErrors) && !Array.isArray(springErrors)) {
    for (const [field, value] of Object.entries(springErrors)) {
      if (typeof value === "string" && value) found[field] = value;
    }
  }

  return found;
}

export function parseApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): ParsedApiError {
  if (!isRecord(error)) {
    return { message: fallback, fieldErrors: {} };
  }

  const status = error.status;

  // Transport-level failures carry no response body.
  if (status === "FETCH_ERROR") {
    return {
      message:
        "Couldn't reach the server. Check your connection and try again.",
      fieldErrors: {},
    };
  }
  if (status === "TIMEOUT_ERROR") {
    return {
      message: "The request timed out. Please try again.",
      fieldErrors: {},
    };
  }
  if (status === "PARSING_ERROR") {
    return {
      message: "The server sent a response we couldn't read.",
      fieldErrors: {},
      status: typeof error.originalStatus === "number" ? error.originalStatus : undefined,
    };
  }

  // A plain SerializedError (a throw inside the query function).
  if (typeof status !== "number") {
    return {
      message: typeof error.message === "string" ? error.message : fallback,
      fieldErrors: {},
    };
  }

  const body = error.data;

  if (typeof body === "string" && body.trim()) {
    return { message: body, fieldErrors: {}, status };
  }

  if (isRecord(body)) {
    const fieldErrors = extractFieldErrors(body);

    // `error` is Spring's default-handler wording ("Not Found"), useful only
    // when nothing better exists.
    const message =
      (typeof body.message === "string" && body.message.trim()
        ? body.message
        : null) ??
      (Array.isArray(body.formErrors) && typeof body.formErrors[0] === "string"
        ? body.formErrors[0]
        : null) ??
      STATUS_FALLBACKS[status] ??
      (typeof body.error === "string" && body.error.trim()
        ? body.error
        : null) ??
      fallback;

    return { message, fieldErrors, status };
  }

  return { message: STATUS_FALLBACKS[status] ?? fallback, fieldErrors: {}, status };
}
