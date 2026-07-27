import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins";

export const auth = betterAuth({
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
        },
      ],
    }),
  ],
});
