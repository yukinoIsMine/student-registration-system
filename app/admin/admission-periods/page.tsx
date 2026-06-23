export const dynamic = "force-dynamic";

import { createAdmissionPeriodAction } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/guards";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { AdmissionPeriod } from "@/types/database";

const adminNav = [
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/admission-periods", label: "Admission periods" },
  { href: "/reviewer/dashboard", label: "Review" },
];

export default async function AdminAdmissionPeriodsPage() {
  const { supabase } = await requireRole(["admin"]);
  const { data: periods } = await supabase
    .from("admission_periods")
    .select("*")
    .order("start_date", { ascending: false })
    .returns<AdmissionPeriod[]>();

  return (
    <div className="page-shell space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admission periods</h1>
          <p className="text-muted-foreground">Create the active period applicants use for submissions.</p>
        </div>
        <DashboardNav items={adminNav} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add admission period</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAdmissionPeriodAction} className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="period_name">Name</Label>
              <Input id="period_name" name="name" placeholder="2026-2027 Admission" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start date</Label>
              <Input id="start_date" name="start_date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End date</Label>
              <Input id="end_date" name="end_date" type="date" required />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-4">
              <input name="is_active" type="checkbox" defaultChecked />
              Active admission period
            </label>
            <Button type="submit" className="md:col-span-4">
              Create period
            </Button>
          </form>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(periods ?? []).map((period) => (
            <TableRow key={period.id}>
              <TableCell>{period.name}</TableCell>
              <TableCell>{formatDate(period.start_date)}</TableCell>
              <TableCell>{formatDate(period.end_date)}</TableCell>
              <TableCell>{period.is_active ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
