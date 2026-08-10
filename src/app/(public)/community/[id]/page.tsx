import ProblemDetailPage from "@/components/discussions/ProblemDetailPage";

/**
 * One problem. The id is read from the route by the client component itself,
 * which is also what paints the page background — a wrapper painting its own
 * would have to repeat the light and dark halves of it to stay in step.
 */
export default function PublicDiscussionDetailPage() {
  return <ProblemDetailPage />;
}
