export const dynamic = "force-dynamic";

import Link from "next/link";

import { SignedDocumentLink } from "@/components/dashboard/signed-document-link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ReviewDecisionForm } from "@/components/forms/review-decision-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guards";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationDocument } from "@/types/database";

export default async function ReviewerApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireRole(["reviewer", "admin"]);
  const { data: application } = await supabase
    .from("applications")
    .select("*, programs(name, degree_level), profiles!applications_applicant_id_fkey(full_name, email)")
    .eq("id", id)
    .maybeSingle<Application>();
  const { data: documents } = await supabase
    .from("application_documents")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false })
    .returns<ApplicationDocument[]>();

  if (!application) {
    return (
      <div className="page-shell">
        <p className="mb-4 text-muted-foreground">Application not found.</p>
        <Button asChild variant="outline">
          <Link href="/reviewer/applications">Back to applications</Link>
        </Button>
      </div>
    );
  }

  const canReview = application.status === "submitted" || application.status === "under_review";

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{application.application_no ?? "Application"}</h1>
          <p className="text-muted-foreground">{application.full_name}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/reviewer/applications">Back</Link>
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Applicant details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm md:grid-cols-2">
            <p>Status: <StatusBadge status={application.status} /></p>
            <p>Program: {application.programs?.name ?? "Not selected"}</p>
            <p>DOB: {formatDate(application.date_of_birth)}</p>
            <p>Gender: {application.gender ?? "Not set"}</p>
            <p>ID: {application.nrc_or_passport ?? "Not set"}</p>
            <p>Phone: {application.phone ?? "Not set"}</p>
            <p>Previous school: {application.previous_school ?? "Not set"}</p>
            <p>Guardian: {application.guardian_name ?? "Not set"}</p>
            <p className="md:col-span-2">Address: {application.address ?? "Not set"}</p>
            {application.review_note ? (
              <p className="md:col-span-2">Review note: {application.review_note}</p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(documents ?? []).map((document) => (
              <div key={document.id} className="glass-tile flex items-center justify-between gap-3 rounded-2xl p-3 text-sm">
                <div>
                  <p className="font-medium">{document.file_name}</p>
                  <p className="capitalize text-muted-foreground">{document.document_type.replaceAll("_", " ")}</p>
                </div>
                <SignedDocumentLink filePath={document.file_path} />
              </div>
            ))}
            {!documents?.length ? <p className="text-sm text-muted-foreground">No documents uploaded.</p> : null}
          </CardContent>
        </Card>
      </div>
      {canReview ? <ReviewDecisionForm applicationId={application.id} /> : null}
    </div>
  );
}
