import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm font-medium">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-slate-600 transition hover:text-slate-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-blue-600 font-semibold" : "text-slate-600"}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="size-3.5 text-slate-300" />}
          </span>
        );
      })}
    </nav>
  );
}