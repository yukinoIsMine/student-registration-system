import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Student Registration System",
  description: "Online university admission and enrollment MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/70 bg-white/45 backdrop-blur-xl">
          <div className="container flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>Student Registration System MVP</p>
            <div className="flex gap-4">
              <Link href="/admission" className="transition hover:text-primary">
                Admission
              </Link>
              <Link href="/contact" className="transition hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
