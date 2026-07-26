import { headers } from "next/headers";

import { auth } from "@/features/auth/auth";

const reportsApiUrl = `${(process.env.BACKEND_API_URL ?? "http://localhost:8999/api/v1").replace(/\/$/, "")}/reports/mine`;

export async function GET() {
  try {
    const { accessToken } = await auth.api.getAccessToken({
      body: { providerId: "keycloak" },
      headers: await headers(),
    });

    const response = await fetch(reportsApiUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return Response.json({ message: "Sign in with Keycloak to view your reports." }, { status: 401 });
  }
}
