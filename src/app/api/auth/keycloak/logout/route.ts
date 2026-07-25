import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/auth";

const keycloakServerUrl = process.env.KEYCLOAK_SERVER_URL || "https://auth.quizzy.it.com/";
const keycloakRealm = process.env.KEYCLOAK_REALM || "devsolve";
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "devsolve-web";
const postLogoutRedirectUri = process.env.KEYCLOAK_POST_LOGOUT_REDIRECT_URI;

export const dynamic = "force-dynamic";

const cookieNames = [
  "session_token",
  "session_data",
  "account_data",
  "oauth_state",
  "dont_remember",
];

export async function GET(request: Request) {
  const issuer = `${keycloakServerUrl.replace(/\/$/, "")}/realms/${keycloakRealm}`;
  const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
  const requestHeaders = await headers();

  let idToken: string | undefined;

  try {
    const tokens = await auth.api.getAccessToken({
      body: { providerId: "keycloak" },
      headers: requestHeaders,
    });
    idToken = tokens.idToken;
  } catch {
    // The app session is still cleared below. Keycloak can show its normal
    // logout confirmation when the provider token is no longer available.
  }

  await auth.api.signOut({ headers: requestHeaders });

  logoutUrl.searchParams.set("client_id", keycloakClientId);
  if (idToken) logoutUrl.searchParams.set("id_token_hint", idToken);
  // Keycloak validates post-logout redirects separately from login redirects.
  // Only send one when it has been explicitly registered for this client.
  if (postLogoutRedirectUri) {
    logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  }

  const response = NextResponse.redirect(logoutUrl, { status: 302 });
  const secure = process.env.NODE_ENV === "production";
  const prefix = secure ? "__Secure-better-auth" : "better-auth";

  for (const name of cookieNames) {
    response.cookies.set(`${prefix}.${name}`, "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      sameSite: "lax",
      secure,
    });
  }

  return response;
}
