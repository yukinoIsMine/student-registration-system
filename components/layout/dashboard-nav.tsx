import Link from "next/link";

import { cn } from "@/lib/utils";

type DashboardNavProps = {
  items: Array<{ href: string; label: string }>;
  className?: string;
};

export function DashboardNav({ items, className }: DashboardNavProps) {
  return (
    <nav className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-sky-200/80 bg-white/45 px-3 py-2 text-sm text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl transition hover:bg-white/75 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
