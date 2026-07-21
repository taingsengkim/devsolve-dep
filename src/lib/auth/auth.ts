import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

const keycloakServerUrl = process.env.KEYCLOAK_SERVER_URL || "https://auth.quizzy.it.com/";
const keycloakRealm = process.env.KEYCLOAK_REALM || "devsolve";
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "devsolve-admin";
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || "";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "devsolve-secret-key-32-chars-minimum-key",
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: keycloakClientId,
          clientSecret: keycloakClientSecret,
          discoveryUrl: `${keycloakServerUrl.replace(/\/$/, "")}/realms/${keycloakRealm}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email"],
          pkce: true,
        },
      ],
    }),
  ],
});
