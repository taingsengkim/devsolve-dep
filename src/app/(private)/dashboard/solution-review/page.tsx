import { redirect } from "next/navigation";

/**
 * The solution review queue moved into the moderation screen, where it sits as
 * a tab beside problems and showcases. It lived here as a page nothing linked
 * to, which is why nobody could find it.
 *
 * Kept as a redirect rather than deleted so existing bookmarks still land on
 * the queue.
 */
export default function SolutionReviewPage() {
  redirect("/dashboard/content-moderation?tab=solutions");
}
