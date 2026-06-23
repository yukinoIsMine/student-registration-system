export const dynamic = "force-dynamic";

import Link from "next/link";
import { FileText, Upload, UserCheck } from "lucide-react";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guards";
import type { Application } from "@/types/database";

const applicantNav = [
  { href: "/applicant/dashboard", label: "Dashboard" },
  { href: "/applicant/application", label: "Application" },
  { href: "/applicant/documents", label: "Documents" },
  { href: "/applicant/status", label: "Status" },
];

export default async function ApplicantDashboardPage() {
  const { supabase, profile } = await requireRole(["applicant"]);
  const { data: application } = await supabase
    .from("applications")
    .select("*, programs(name, degree_level)")
    .eq("applicant_id", profile!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Application>();

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applicant dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.full_name ?? profile?.email}</p>
        </div>
        <DashboardNav items={applicantNav} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle>Application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {application ? <StatusBadge status={application.status} /> : <p>No application yet.</p>}
            <Button asChild variant="outline" className="w-full">
              <Link href="/applicant/application">Open application</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/applicant/documents">Upload files</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <UserCheck className="h-6 w-6 text-primary" aria-hidden="true" />
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/applicant/status">Track status</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
