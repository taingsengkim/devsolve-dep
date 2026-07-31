import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { extractRealmRolesFromToken } from "@/lib/auth/token-utils";

/** Shape of the object returned by authClient.getAccessToken */
interface AccessTokenResponse {
  data?: string | { accessToken?: string; token?: string } | null;
  token?: string;
}

/** Extension of the better-auth session user that includes the role field injected by Keycloak */
interface SessionUserWithRole {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  roles?: string[];
}

export function useSidebarAuth() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "User";
  const [tokenRoles, setTokenRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!session) return;

    authClient.getAccessToken({ providerId: "keycloak" }).then((res: AccessTokenResponse) => {
      const rawToken =
        typeof res?.data === "string"
          ? res.data
          : res?.data?.accessToken || res?.data?.token || res?.token;

      if (rawToken) {
        const realmRoles = extractRealmRolesFromToken(rawToken);
        const appRoles = realmRoles.filter((r) =>
          ["USER", "COMPANY", "ADMIN", "MODERATOR"].includes(r)
        );
        setTokenRoles(appRoles.length > 0 ? Array.from(new Set(appRoles)) : ["USER"]);
      }
    });
  }, [session]);

  const sessionRoles = (user as SessionUserWithRole)?.role
    ? String((user as SessionUserWithRole).role)
        .split(",")
        .map((r) => r.trim().toUpperCase())
    : [];

  const activeRoles =
    sessionRoles.length > 0
      ? sessionRoles
      : tokenRoles.length > 0
      ? tokenRoles
      : ["USER"];

  const effectiveUser: SidebarUser | undefined = user
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
        role: activeRoles.join(","),
        roles: activeRoles,
      }
    : undefined;

  const handleSignOut = async () => {
    await authClient.signOut();

    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (issuer && clientId) {
      const cleanIssuer = issuer.replace(/\/+$/, "");
      const logoutUrl = new URL(`${cleanIssuer}/protocol/openid-connect/logout`);
      logoutUrl.searchParams.set("client_id", clientId);
      logoutUrl.searchParams.set("post_logout_redirect_uri", window.location.origin);
      window.location.href = logoutUrl.toString();
    } else {
      window.location.href = "/";
    }
  };

  return {
    user: effectiveUser,
    isPending,
    displayName,
    handleSignOut,
  };
}
