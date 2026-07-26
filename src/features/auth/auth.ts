import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

const keycloakServerUrl = process.env.KEYCLOAK_SERVER_URL || "https://auth.quizzy.it.com/";
const keycloakRealm = process.env.KEYCLOAK_REALM || "devsolve";
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || "devsolve-web";
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || undefined;
const keycloakIssuerUri = process.env.JWT_ISSUER_URI || `${keycloakServerUrl.replace(/\/$/, "")}/realms/${keycloakRealm}`;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "devsolve-secret-key-32-chars-minimum-key",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  advanced: {
    // Better Auth signs this value and sends it as an HTTP-only cookie. Keep
    // provider access tokens server-side; browser code must never read them.
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "keycloak",
          clientId: keycloakClientId,
          clientSecret: keycloakClientSecret,
          discoveryUrl: `${keycloakIssuerUri.replace(/\/$/, "")}/.well-known/openid-configuration`,
          scopes: ["openid", "profile", "email"],
          pkce: true,
          mapProfileToUser: (profile) => ({
            ...(typeof (profile.sub ?? profile.id) === "string" ? { id: profile.sub ?? profile.id } : {}),
            ...(typeof profile.email === "string" ? { email: profile.email } : {}),
            ...(typeof profile.picture === "string" ? { image: profile.picture } : {}),
            ...(typeof profile.preferred_username === "string"
              ? { name: profile.preferred_username }
              : typeof profile.name === "string"
                ? { name: profile.name }
                : {}),
          }),
        },
      ],
    }),
  ],
});
