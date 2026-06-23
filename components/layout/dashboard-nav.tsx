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
          className="rounded-md border px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
