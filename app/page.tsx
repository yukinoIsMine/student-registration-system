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
      <section className="relative overflow-hidden border-b border-white/70">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(186,230,253,0.48)_42%,rgba(255,255,255,0.9))]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-[linear-gradient(0deg,rgba(255,255,255,0.88),rgba(255,255,255,0))]" />
        <div className="container grid min-h-[560px] items-center gap-8 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-sky-200/80 bg-white/55 px-3 py-1 text-sm font-semibold uppercase text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-xl">
              2026-2027 Admission
            </p>
            <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">
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
          <div className="glass-panel grid gap-3 rounded-3xl p-4">
            {["Applicant signup", "Enrollment form", "Private documents", "Reviewer decision"].map(
              (item, index) => (
                <div key={item} className="glass-tile flex items-center gap-3 rounded-2xl p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_10px_28px_rgba(14,165,233,0.22)]">
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
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/55 text-primary shadow-[0_12px_32px_rgba(14,165,233,0.15)] backdrop-blur-xl">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
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
