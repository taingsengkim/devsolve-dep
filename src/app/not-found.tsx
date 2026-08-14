import type { Metadata } from "next";
import { NotFoundGlitch } from "@/components/not-found/not-found-glitch";
import { NO_INDEX } from "@/lib/seo/metadata";

/* Next serves this with a 404 status, which is the signal that counts — the
   header is here so a crawler that reaches it through a redirect or a soft
   404 still sees the same answer. */
export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  robots: NO_INDEX,
};

export default function NotFound() {
  return <NotFoundGlitch />;
}
