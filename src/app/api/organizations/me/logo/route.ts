import type { NextRequest } from "next/server";
import {
  bearerTokenFor,
  fileFrom,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";
import { validateOrganizationLogoFile } from "@/lib/validations/organization-logo";

export async function PUT(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const file = await fileFrom(request, validateOrganizationLogoFile);
  if ("error" in file) return file.error;

  try {
    const upstream = await upstreamFetch("/organizations/me/logo", token, {
      method: "PUT",
      body: file.body,
    });
    return relay(upstream, "The organization logo could not be uploaded.");
  } catch {
    return unreachable("organization");
  }
}

export async function DELETE(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  try {
    const upstream = await upstreamFetch("/organizations/me/logo", token, {
      method: "DELETE",
    });
    return relay(upstream, "The organization logo could not be removed.");
  } catch {
    return unreachable("organization");
  }
}
