export const dynamic = "force-dynamic";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/guards";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types/database";

const reviewerNav = [
  { href: "/reviewer/dashboard", label: "Dashboard" },
  { href: "/reviewer/applications", label: "Applications" },
];

export default async function ReviewerApplicationsPage() {
  const { supabase } = await requireRole(["reviewer", "admin"]);
  const { data: applications, error } = await supabase
    .from("applications")
    .select("*, programs(name, degree_level), profiles!applications_applicant_id_fkey(full_name, email)")
    .in("status", ["submitted", "under_review", "accepted", "rejected"])
    .order("submitted_at", { ascending: false })
    .returns<Application[]>();

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">Review submitted applications and decisions.</p>
        </div>
        <DashboardNav items={reviewerNav} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {(applications ?? []).map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.application_no ?? application.id.slice(0, 8)}</TableCell>
              <TableCell>{application.full_name}</TableCell>
              <TableCell>{application.programs?.name ?? "Not selected"}</TableCell>
              <TableCell>
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell>{formatDate(application.submitted_at)}</TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/reviewer/applications/${application.id}`}>Open</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Supabase error: {error.message}
        </p>
      ) : null}
      {!applications?.length ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          No submitted applications yet.
        </p>
      ) : null}
    </div>
  );
}
