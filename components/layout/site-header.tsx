import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";

import { signOutAction } from "@/lib/actions/auth";
import { getSessionProfile } from "@/lib/auth/guards";
import { Button } from "@/components/ui/button";

const publicLinks = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admission", label: "Admission" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const { user, profile } = await getSessionProfile();
  const dashboardHref =
    profile?.role === "admin"
      ? "/admin/programs"
      : profile?.role === "reviewer"
        ? "/reviewer/dashboard"
        : "/applicant/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
          <span>Student Registration</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={dashboardHref}>Dashboard</Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="icon" aria-label="Sign out">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Apply</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
