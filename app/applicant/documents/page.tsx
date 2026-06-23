export const dynamic = "force-dynamic";

import Link from "next/link";

import { DocumentUploader } from "@/components/forms/document-uploader";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/guards";
import type { Application, ApplicationDocument } from "@/types/database";

const applicantNav = [
  { href: "/applicant/dashboard", label: "Dashboard" },
  { href: "/applicant/application", label: "Application" },
  { href: "/applicant/documents", label: "Documents" },
  { href: "/applicant/status", label: "Status" },
];

export default async function ApplicantDocumentsPage() {
  const { supabase, profile } = await requireRole(["applicant"]);
  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("applicant_id", profile!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<Application>();

  const { data: documents } = application
    ? await supabase
        .from("application_documents")
        .select("*")
        .eq("application_id", application.id)
        .order("created_at", { ascending: false })
        .returns<ApplicationDocument[]>()
    : { data: [] as ApplicationDocument[] };

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Upload required application files.</p>
        </div>
        <DashboardNav items={applicantNav} />
      </div>
      {application ? (
        <DocumentUploader application={application} documents={documents ?? []} />
      ) : (
        <div className="rounded-lg border p-6">
          <p className="mb-4 text-muted-foreground">Create and save an application draft first.</p>
          <Button asChild>
            <Link href="/applicant/application">Create draft</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
