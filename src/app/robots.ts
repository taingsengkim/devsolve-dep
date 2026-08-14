import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo/site";

/**
 * What crawlers may read. Served at `/robots.txt`.
 *
 * Three kinds of URL are kept out. Anything private (`/dashboard`, `/api`) is
 * gated by the session middleware anyway, so a crawler would only ever see the
 * redirect. Anything transactional — signing in, composing a problem, editing
 * a solution — is a form, not a document. And `/profile/me` is an alias that
 * resolves to whoever is signed in, which for a crawler is nobody.
 *
 * Note that disallow only stops crawling, not indexing: a blocked URL someone
 * links to can still appear as a bare result. The pages that must never be
 * listed also carry `robots: noindex` in their own metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/login",
          "/register/",
          "/account-type",
          "/test-login",
          "/community/create",
          "/community/*/edit",
          "/community/*/solutions/",
          "/profile/me",
          // The old public program page, kept only as a redirect notice.
          "/program",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
