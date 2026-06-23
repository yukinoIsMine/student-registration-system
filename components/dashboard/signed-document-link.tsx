"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignedDocumentLink({ filePath }: { filePath: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  async function openDocument() {
    setIsLoading(true);
    const { data } = await supabase.storage
      .from("application-documents")
      .createSignedUrl(filePath, 60);
    setIsLoading(false);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={isLoading} onClick={openDocument}>
      <ExternalLink className="h-4 w-4" aria-hidden="true" /> View
    </Button>
  );
}
