export const dynamic = "force-dynamic";

import { createDepartmentAction, createProgramAction } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/guards";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Department, Program } from "@/types/database";

const adminNav = [
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/admission-periods", label: "Admission periods" },
  { href: "/reviewer/dashboard", label: "Review" },
];

export default async function AdminProgramsPage() {
  const { supabase } = await requireRole(["admin"]);
  const [{ data: departments }, { data: programs }] = await Promise.all([
    supabase.from("departments").select("*").order("name").returns<Department[]>(),
    supabase.from("programs").select("*, departments(name, code)").order("name").returns<Program[]>(),
  ]);

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Programs</h1>
          <p className="text-muted-foreground">Manage departments and active applicant programs.</p>
        </div>
        <DashboardNav items={adminNav} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add department</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDepartmentAction} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_name">Department name</Label>
                <Input id="department_name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department_code">Code</Label>
                <Input id="department_code" name="code" />
              </div>
              <Button type="submit">Create department</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add program</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createProgramAction} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="department_id">Department</Label>
                <select
                  id="department_id"
                  name="department_id"
                  className="h-10 w-full rounded-xl border border-sky-200/80 bg-white/55 px-3 text-sm outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-all focus-visible:border-sky-300 focus-visible:bg-white/75 focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <option value="">No department</option>
                  {(departments ?? []).map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program_name">Program name</Label>
                <Input id="program_name" name="name" required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="degree_level">Degree level</Label>
                  <Input id="degree_level" name="degree_level" placeholder="Bachelor" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_years">Duration years</Label>
                  <Input id="duration_years" name="duration_years" type="number" min={1} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="is_active" type="checkbox" defaultChecked />
                Active for applicants
              </label>
              <Button type="submit">Create program</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(programs ?? []).map((program) => (
            <TableRow key={program.id}>
              <TableCell>{program.name}</TableCell>
              <TableCell>{program.departments?.name ?? "None"}</TableCell>
              <TableCell>{program.degree_level ?? "-"}</TableCell>
              <TableCell>{program.duration_years ?? "-"}</TableCell>
              <TableCell>{program.is_active ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
