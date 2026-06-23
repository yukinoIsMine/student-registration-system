import { CheckCircle2 } from "lucide-react";

const steps = [
  "Create an applicant account.",
  "Complete personal, education, program, and guardian details.",
  "Upload photo, ID, certificate, and transcript documents.",
  "Submit the application for university review.",
  "Track status from the applicant dashboard.",
];

export default function AdmissionPage() {
  return (
    <div className="page-shell space-y-6">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold">Admission Information</h1>
        <p className="text-muted-foreground">
          Applications move from draft to submitted, under review, accepted, or rejected.
          Applicants can edit only while the application is still a draft.
        </p>
      </div>
      <ol className="grid gap-3 md:grid-cols-2">
        {steps.map((step) => (
          <li key={step} className="flex gap-3 rounded-lg border p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
