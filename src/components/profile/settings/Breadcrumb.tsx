import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm font-medium">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-[#4d4d4d] transition hover:text-[#171717]">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-[#2563EB]" : "text-[#4d4d4d]"}>{item.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className="text-neutral-300" />}
          </span>
        );
      })}
    </nav>
  );
}