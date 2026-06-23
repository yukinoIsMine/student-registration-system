import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="page-shell max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <div className="grid gap-3">
        <p className="flex items-center gap-3 rounded-lg border p-4">
          <Mail className="h-5 w-5 text-primary" aria-hidden="true" /> admissions@example.edu
        </p>
        <p className="flex items-center gap-3 rounded-lg border p-4">
          <Phone className="h-5 w-5 text-primary" aria-hidden="true" /> +95 9 000 000 000
        </p>
        <p className="flex items-center gap-3 rounded-lg border p-4">
          <MapPin className="h-5 w-5 text-primary" aria-hidden="true" /> Main Campus,
          Yangon
        </p>
      </div>
    </div>
  );
}
