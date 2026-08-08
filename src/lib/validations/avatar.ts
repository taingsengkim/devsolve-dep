/**
 * Constraints for `PUT /api/v1/user-profiles/me/avatar`.
 *
 * Applied in the browser so a bad file never leaves the device, and again in
 * the route handler so a direct caller cannot skip them.
 */

/** Avatars render at 112px at their largest — a megabyte is already generous. */
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

/** No SVG: avatars are user-supplied and SVG can carry script. */
export const AVATAR_ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

/** The `accept` attribute for the file input. */
export const AVATAR_ACCEPT_ATTR = AVATAR_ACCEPTED.join(",");

/** Null when the file is acceptable, otherwise the reason it is not. */
export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_ACCEPTED.includes(file.type)) {
    return "Avatars must be a PNG, JPG, or WebP image";
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return `Image must be 2MB or smaller (this one is ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  }
  return null;
}
