import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="page-shell space-y-6">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-bold">University Information</h1>
        <p className="text-muted-foreground">
          The university prepares students for technical, business, and applied science
          careers through practical teaching, modern programs, and transparent admission.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Academic focus", "Bachelor and diploma programs aligned with workforce needs."],
          ["Student support", "Applicant guidance, document checking, and clear status updates."],
          ["Digital admission", "Secure online registration backed by Supabase Auth and RLS."],
        ].map(([title, description]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
