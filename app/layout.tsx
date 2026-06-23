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
        <main>{children}</main>
        <footer className="border-t">
          <div className="container flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>Student Registration System MVP</p>
            <div className="flex gap-4">
              <Link href="/admission" className="hover:text-foreground">
                Admission
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
