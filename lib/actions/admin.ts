"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";

export async function createDepartmentAction(formData: FormData) {
  const { supabase } = await requireRole(["admin"]);
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();

  if (name) {
    await supabase.from("departments").insert({ name, code: code || null });
  }

  revalidatePath("/admin/programs");
}

export async function createProgramAction(formData: FormData) {
  const { supabase } = await requireRole(["admin"]);
  const departmentId = String(formData.get("department_id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const degreeLevel = String(formData.get("degree_level") ?? "").trim();
  const durationYears = Number(formData.get("duration_years") ?? 0);
  const isActive = formData.get("is_active") === "on";

  if (name) {
    await supabase.from("programs").insert({
      department_id: departmentId || null,
      name,
      degree_level: degreeLevel || null,
      duration_years: Number.isFinite(durationYears) ? durationYears : null,
      is_active: isActive,
    });
  }

  revalidatePath("/admin/programs");
}

export async function createAdmissionPeriodAction(formData: FormData) {
  const { supabase } = await requireRole(["admin"]);
  const name = String(formData.get("name") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "");
  const endDate = String(formData.get("end_date") ?? "");
  const isActive = formData.get("is_active") === "on";

  if (!name || !startDate || !endDate) redirect("/admin/admission-periods");

  await supabase.from("admission_periods").insert({
    name,
    start_date: startDate,
    end_date: endDate,
    is_active: isActive,
  });

  revalidatePath("/admin/admission-periods");
}
