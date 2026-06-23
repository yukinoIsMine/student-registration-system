export const dynamic = "force-dynamic";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guards";
import { formatDate } from "@/lib/utils";
import type { Application, StudentRecord } from "@/types/database";

const applicantNav = [
  { href: "/applicant/dashboard", label: "Dashboard" },
  { href: "/applicant/application", label: "Application" },
  { href: "/applicant/documents", label: "Documents" },
  { href: "/applicant/status", label: "Status" },
];

export default async function ApplicantStatusPage() {
  const { supabase, profile } = await requireRole(["applicant"]);
  const { data: application } = await supabase
    .from("applications")
    .select("*, programs(name, degree_level)")
    .eq("applicant_id", profile!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Application>();

  const { data: studentRecord } = application
    ? await supabase
        .from("student_records")
        .select("*")
        .eq("application_id", application.id)
        .maybeSingle<StudentRecord>()
    : { data: null };

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application status</h1>
          <p className="text-muted-foreground">Track the latest reviewer decision.</p>
        </div>
        <DashboardNav items={applicantNav} />
      </div>
      {application ? (
        <Card>
          <CardHeader>
            <CardTitle>{application.application_no ?? "Draft application"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2">
            <p>
              Status: <StatusBadge status={application.status} />
            </p>
            <p>Program: {application.programs?.name ?? "Not selected"}</p>
            <p>Submitted: {formatDate(application.submitted_at)}</p>
            <p>Reviewed: {formatDate(application.reviewed_at)}</p>
            {application.review_note ? <p className="md:col-span-2">Note: {application.review_note}</p> : null}
            {studentRecord ? (
              <p className="md:col-span-2">
                Student record: <strong>{studentRecord.student_no}</strong>
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <div className="glass-panel rounded-2xl p-6">
          <p className="mb-4 text-muted-foreground">No application has been started.</p>
          <Button asChild>
            <Link href="/applicant/application">Start application</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
