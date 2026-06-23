export const dynamic = "force-dynamic";

import Link from "next/link";
import { ClipboardList, Clock, UserCheck } from "lucide-react";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guards";

const reviewerNav = [
  { href: "/reviewer/dashboard", label: "Dashboard" },
  { href: "/reviewer/applications", label: "Applications" },
];

export default async function ReviewerDashboardPage() {
  const { supabase, profile } = await requireRole(["reviewer", "admin"]);
  const { count: submittedCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .in("status", ["submitted", "under_review"]);
  const { count: acceptedCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "accepted");

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviewer dashboard</h1>
          <p className="text-muted-foreground">Signed in as {profile?.full_name ?? profile?.email}</p>
        </div>
        <DashboardNav items={reviewerNav} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle>Pending review</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{submittedCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <UserCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle>Accepted</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{acceptedCount ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/reviewer/applications">Open queue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
