"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export function ReviewDecisionForm({ applicationId }: { applicationId: string }) {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function review(decision: "accepted" | "rejected") {
    setIsSaving(true);
    setMessage("");
    const { error } = await supabase.rpc("review_application", {
      application_id_input: applicationId,
      decision_input: decision,
      review_note_input: note,
    });
    setIsSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/reviewer/applications");
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
      <div className="space-y-2">
        <Label htmlFor="review_note">Review note</Label>
        <Textarea id="review_note" value={note} onChange={(event) => setNote(event.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={isSaving} onClick={() => review("accepted")}>
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Accept
        </Button>
        <Button type="button" variant="destructive" disabled={isSaving} onClick={() => review("rejected")}>
          <XCircle className="h-4 w-4" aria-hidden="true" /> Reject
        </Button>
      </div>
    </div>
  );
}
