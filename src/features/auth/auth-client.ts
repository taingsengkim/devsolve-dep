import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Only NEXT_PUBLIC_* variables are available in browser bundles.
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [genericOAuthClient()],
});

export const signInWithKeycloak = async (callbackURL = "/") => {
  return await authClient.signIn.oauth2({
    providerId: "keycloak",
    callbackURL,
  });
};
