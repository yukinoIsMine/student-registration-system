import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileUp, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Apply online",
    description: "Create an applicant account and complete the admission form in guided steps.",
    icon: ClipboardCheck,
  },
  {
    title: "Upload documents",
    description: "Submit required files through a private Supabase Storage bucket.",
    icon: FileUp,
  },
  {
    title: "Track decisions",
    description: "Follow draft, submitted, review, accepted, and rejected states from one dashboard.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--secondary)))]">
        <div className="container grid min-h-[520px] items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              2026-2027 Admission
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal md:text-6xl">
              Student Registration System
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A focused university enrollment portal for applicants, reviewers, and admins.
              Read admission information, submit an application, and manage review decisions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Start application <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/programs">View programs</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg border bg-background/80 p-4 shadow-sm">
            {["Applicant signup", "Enrollment form", "Private documents", "Reviewer decision"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="page-shell grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.description}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
