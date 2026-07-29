import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";

function parseJwtPayload(token?: string) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: true,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          // Spread the keycloak preset (sets providerId, discoveryUrl, clientId, clientSecret, scopes)
          ...keycloak({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
          }),
          // Must be set at this level — keycloak() preset does NOT forward pkce
          // Required because Keycloak client has "Require PKCE: On" with S256
          pkce: true,

          getUserInfo: async (tokens) => {
            // Keycloak stores realm_access.roles inside the JWT (idToken or accessToken)
            const idTokenPayload = parseJwtPayload(tokens.idToken);
            const accessTokenPayload = parseJwtPayload(tokens.accessToken);

            // Fetch base user profile from Keycloak userinfo endpoint
            const issuer = process.env.KEYCLOAK_ISSUER!;
            let userInfo: any = {};
            try {
              const res = await fetch(`${issuer}/protocol/openid-connect/userinfo`, {
                headers: { Authorization: `Bearer ${tokens.accessToken}` },
              });
              userInfo = await res.json();
            } catch (err) {
              console.error("[Auth] Error fetching Keycloak userinfo:", err);
            }

            // Extract realm_access roles from JWT tokens and UserInfo response
            const realmRoles: string[] = Array.from(
              new Set([
                ...(idTokenPayload?.realm_access?.roles || []),
                ...(accessTokenPayload?.realm_access?.roles || []),
                ...(userInfo?.realm_access?.roles || []),
                ...(userInfo?.roles || []),
              ])
            );

            console.log("\n=======================================================");
            console.log("[Auth Server Debug] Decoded ID Token Payload:", idTokenPayload);
            console.log("[Auth Server Debug] Decoded Access Token Payload:", accessTokenPayload);
            console.log("[Auth Server Debug] Keycloak UserInfo Response:", userInfo);
            console.log("[Auth Server Debug] Extracted Keycloak Realm Roles:", realmRoles);
            console.log("=======================================================\n");

            // Map Keycloak Realm Roles to app roles (supports single or multi-role users)
            const upperRoles = realmRoles.map((r) => String(r).toUpperCase());
            const appRoles = upperRoles.filter((r) =>
              ["USER", "COMPANY", "ADMIN", "MODERATOR"].includes(r)
            );
            const role = appRoles.length > 0 ? Array.from(new Set(appRoles)).join(",") : "USER";

            console.log("[Auth Server Debug] Final Assigned User Roles:", role);

            return {
              id: userInfo.sub || idTokenPayload?.sub || accessTokenPayload?.sub,
              email: userInfo.email || idTokenPayload?.email || accessTokenPayload?.email,
              name: userInfo.name || idTokenPayload?.name || userInfo.preferred_username || "User",
              image: userInfo.picture,
              emailVerified: userInfo.email_verified ?? true,
              role,
            };
          },
        },
      ],
    }),
  ],
});


