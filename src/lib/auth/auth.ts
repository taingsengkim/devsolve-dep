import { betterAuth } from "better-auth";
import {genericOAuth, keycloak} from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
          issuer: process.env.KEYCLOAK_ISSUER!, // e.g., "https://my-domain/realms/MyRealm"
          scopes: ["openid", "email", "profile"], // optional
          pkce: true,
        }),
      ],
    }),
  ],
});
