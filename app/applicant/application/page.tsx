export const dynamic = "force-dynamic";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { ApplicationWizard } from "@/components/forms/application-wizard";
import { requireRole } from "@/lib/auth/guards";
import type { AdmissionPeriod, Application, ApplicationDocument, Program } from "@/types/database";

const applicantNav = [
  { href: "/applicant/dashboard", label: "Dashboard" },
  { href: "/applicant/application", label: "Application" },
  { href: "/applicant/documents", label: "Documents" },
  { href: "/applicant/status", label: "Status" },
];

export default async function ApplicantApplicationPage() {
  const { supabase, profile } = await requireRole(["applicant"]);
  const [{ data: programs }, { data: admissionPeriod }, { data: application }] = await Promise.all([
    supabase.from("programs").select("*, departments(name, code)").eq("is_active", true).order("name").returns<Program[]>(),
    supabase
      .from("admission_periods")
      .select("*")
      .eq("is_active", true)
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle<AdmissionPeriod>(),
    supabase
      .from("applications")
      .select("*")
      .eq("applicant_id", profile!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<Application>(),
  ]);

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
          <h1 className="text-3xl font-bold">Enrollment form</h1>
          <p className="text-muted-foreground">Save drafts before uploading documents.</p>
        </div>
        <DashboardNav items={applicantNav} />
      </div>
      <ApplicationWizard
        profile={profile!}
        programs={programs ?? []}
        admissionPeriod={admissionPeriod ?? null}
        application={application ?? null}
        documents={documents ?? []}
      />
    </div>
  );
}
