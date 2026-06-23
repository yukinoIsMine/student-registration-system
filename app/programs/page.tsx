export const dynamic = "force-dynamic";

import { BookOpen } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Program } from "@/types/database";

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: programs } = await supabase
    .from("programs")
    .select("*, departments(name, code)")
    .eq("is_active", true)
    .order("name")
    .returns<Program[]>();

  return (
    <div className="page-shell space-y-6">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold">Available Programs</h1>
        <p className="text-muted-foreground">
          Active programs are loaded from Supabase and managed by admins.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(programs ?? []).map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
              <CardTitle>{program.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{program.degree_level ?? "Degree"} program</p>
              <p>{program.duration_years ?? "-"} years</p>
              <p>{program.departments?.name ?? "General department"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {!programs?.length ? (
        <p className="rounded-lg border p-4 text-sm text-muted-foreground">
          No active programs are available yet. Run the seed SQL after creating the schema.
        </p>
      ) : null}
    </div>
  );
}
