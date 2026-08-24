import { redirect } from "next/navigation";

/**
 * /dashboard/content-reports is the canonical public URL for this feature.
 * The implementation lives at /dashboard/content-moderation.
 * We redirect here instead of re-exporting the component to keep routing
 * explicit and avoid two live routes serving identical UI.
 */
export default function ContentReportsRedirectPage() {
  redirect("/dashboard/content-moderation");
}
