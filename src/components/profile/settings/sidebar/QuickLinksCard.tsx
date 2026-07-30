import Link from "next/link";
import { ExternalLink, Link2 } from "lucide-react";

interface QuickLinksCardProps {
  username: string;
}

export default function QuickLinksCard({ username }: QuickLinksCardProps) {
  const links = [
    { label: "View public profile", href: `/dashboard/profile/${username}` },
    { label: "Change email address", href: "/dashboard/profile/settings#email" },
    { label: "Account settings", href: "/dashboard/settings" },
    { label: "Privacy policy", href: "/privacy" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-5">
      <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Link2 size={13} />
        Quick links
      </p>

      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              <ExternalLink size={13} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}