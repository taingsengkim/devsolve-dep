/**
 * Utility functions for reading auth session tokens from cookies.
 */

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getAuthToken(): string | null {
  // Better Auth stores session / bearer tokens in cookies named 'better-auth.session_token' or 'better-auth.token'
  return (
    getCookie("better-auth.session_token") ||
    getCookie("better-auth.token") ||
    getCookie("access_token")
  );
}
