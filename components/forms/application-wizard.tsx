"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { applicationSchema, requiredDocumentTypes, type ApplicationFormValues } from "@/lib/validations/application";
import type { AdmissionPeriod, Application, ApplicationDocument, Profile, Program } from "@/types/database";

type ApplicationWizardProps = {
  profile: Profile;
  programs: Program[];
  admissionPeriod: AdmissionPeriod | null;
  application: Application | null;
  documents: ApplicationDocument[];
};

const steps = ["Personal", "Contact", "Education", "Program", "Review"];

export function ApplicationWizard({
  profile,
  programs,
  admissionPeriod,
  application,
  documents,
}: ApplicationWizardProps) {
  const [step, setStep] = useState(0);
  const [applicationId, setApplicationId] = useState(application?.id ?? "");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isLocked = application ? application.status !== "draft" : false;
  const supabase = createClient();
  const router = useRouter();

  const uploadedTypes = useMemo(
    () => new Set(documents.map((document) => document.document_type)),
    [documents],
  );

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      full_name: application?.full_name ?? profile.full_name ?? "",
      date_of_birth: application?.date_of_birth ?? "",
      gender: application?.gender ?? "",
      nrc_or_passport: application?.nrc_or_passport ?? "",
      phone: application?.phone ?? "",
      address: application?.address ?? "",
      previous_school: application?.previous_school ?? "",
      guardian_name: application?.guardian_name ?? "",
      guardian_phone: application?.guardian_phone ?? "",
      program_id: application?.program_id ?? "",
    },
  });

  async function saveDraft() {
    if (!admissionPeriod) {
      setMessage("No active admission period is available.");
      return "";
    }

    setIsSaving(true);
    setMessage("");
    const values = form.getValues();
    const payload = {
      applicant_id: profile.id,
      admission_period_id: admissionPeriod.id,
      program_id: values.program_id || null,
      full_name: values.full_name || profile.full_name || "Draft applicant",
      date_of_birth: values.date_of_birth || null,
      gender: values.gender || null,
      nrc_or_passport: values.nrc_or_passport || null,
      phone: values.phone || null,
      address: values.address || null,
      previous_school: values.previous_school || null,
      guardian_name: values.guardian_name || null,
      guardian_phone: values.guardian_phone || null,
      status: "draft",
    };

    const query = applicationId
      ? supabase.from("applications").update(payload).eq("id", applicationId).select("id").single()
      : supabase.from("applications").insert(payload).select("id").single();

    const { data, error } = await query;
    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return "";
    }

    const id = String(data.id);
    setApplicationId(id);
    setMessage("Draft saved.");
    return id;
  }

  async function submitApplication(values: ApplicationFormValues) {
    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Please complete the required fields.");
      return;
    }

    const missing = requiredDocumentTypes.filter((type) => !uploadedTypes.has(type.value));
    if (missing.length) {
      setMessage(`Upload required documents before submitting: ${missing.map((type) => type.label).join(", ")}.`);
      return;
    }

    const savedId = await saveDraft();
    if (!savedId) return;

    setIsSaving(true);
    const { error } = await supabase.rpc("submit_application", {
      application_id_input: savedId,
    });
    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/applicant/status");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment application</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2 md:grid-cols-5">
          {steps.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-md border px-3 py-2 text-sm ${
                step === index ? "border-primary bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {message ? (
          <p className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">{message}</p>
        ) : null}

        {isLocked ? (
          <p className="rounded-md border p-3 text-sm text-muted-foreground">
            This application has already been submitted and can no longer be edited.
          </p>
        ) : null}

        <form onSubmit={form.handleSubmit(submitApplication)} className="space-y-5">
          {step === 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" error={form.formState.errors.full_name?.message}>
                <Input disabled={isLocked} {...form.register("full_name")} />
              </Field>
              <Field label="Date of birth" error={form.formState.errors.date_of_birth?.message}>
                <Input disabled={isLocked} type="date" {...form.register("date_of_birth")} />
              </Field>
              <Field label="Gender" error={form.formState.errors.gender?.message}>
                <select
                  disabled={isLocked}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  {...form.register("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="NRC or passport" error={form.formState.errors.nrc_or_passport?.message}>
                <Input disabled={isLocked} {...form.register("nrc_or_passport")} />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4">
              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <Input disabled={isLocked} {...form.register("phone")} />
              </Field>
              <Field label="Address" error={form.formState.errors.address?.message}>
                <Textarea disabled={isLocked} {...form.register("address")} />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <Field label="Previous school" error={form.formState.errors.previous_school?.message}>
              <Input disabled={isLocked} {...form.register("previous_school")} />
            </Field>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4">
              <Field label="Program" error={form.formState.errors.program_id?.message}>
                <select
                  disabled={isLocked}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  {...form.register("program_id")}
                >
                  <option value="">Select program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Guardian name" error={form.formState.errors.guardian_name?.message}>
                  <Input disabled={isLocked} {...form.register("guardian_name")} />
                </Field>
                <Field label="Guardian phone" error={form.formState.errors.guardian_phone?.message}>
                  <Input disabled={isLocked} {...form.register("guardian_phone")} />
                </Field>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-3 rounded-lg border p-4 text-sm">
              <p>
                Admission period: <strong>{admissionPeriod?.name ?? "Not available"}</strong>
              </p>
              <p>
                Documents:{" "}
                <strong>
                  {requiredDocumentTypes.filter((type) => uploadedTypes.has(type.value)).length}/
                  {requiredDocumentTypes.length} uploaded
                </strong>
              </p>
              <p className="text-muted-foreground">
                Save your draft first, upload documents from the documents page, then return here to submit.
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={step === steps.length - 1}
                onClick={() => setStep((value) => value + 1)}
              >
                Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" disabled={isLocked || isSaving} onClick={saveDraft}>
                <Save className="h-4 w-4" aria-hidden="true" /> Save draft
              </Button>
              <Button type="submit" disabled={isLocked || isSaving}>
                <Send className="h-4 w-4" aria-hidden="true" /> Submit
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
