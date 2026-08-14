import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo/site";

/**
 * Pass-through layout that names the registration pages.
 *
 * Without it both inherit the auth group's `Sign in`, which is the wrong verb
 * on the tab of a page asking someone to create an account. `robots` is
 * inherited from that same group, so only the title is restated here.
 */
export const metadata: Metadata = {
  title: { absolute: `Create an account · ${SITE_NAME}` },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
