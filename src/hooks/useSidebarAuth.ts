import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { extractRealmRolesFromToken } from "@/lib/auth/token-utils";

export interface SidebarUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export function useSidebarAuth() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "User";
  const [tokenRole, setTokenRole] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    authClient.getAccessToken({ providerId: "keycloak" }).then((res: any) => {
      const rawToken =
        typeof res?.data === "string"
          ? res.data
          : res?.data?.accessToken || res?.data?.token || res?.token;

      if (rawToken) {
        const roles = extractRealmRolesFromToken(rawToken);
        if (roles.includes("ADMIN")) setTokenRole("ADMIN");
        else if (roles.includes("COMPANY")) setTokenRole("COMPANY");
        else if (roles.includes("MODERATOR")) setTokenRole("MODERATOR");
        else setTokenRole("USER");
      }
    });
  }, [session]);

  const effectiveUser: SidebarUser | undefined = user
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
        role: (user as any)?.role || tokenRole || "USER",
      }
    : undefined;

  const handleSignOut = async () => {
    await authClient.signOut();

    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (issuer && clientId) {
      const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
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
