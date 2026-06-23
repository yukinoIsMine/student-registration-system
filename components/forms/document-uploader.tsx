"use client";

import { FileUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { requiredDocumentTypes } from "@/lib/validations/application";
import type { Application, ApplicationDocument } from "@/types/database";

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
const maxSize = 10 * 1024 * 1024;

export function DocumentUploader({
  application,
  documents,
}: {
  application: Application;
  documents: ApplicationDocument[];
}) {
  const [items, setItems] = useState(documents);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();
  const isLocked = application.status !== "draft";

  async function uploadDocument(formData: FormData) {
    const documentType = String(formData.get("document_type") ?? "");
    const file = formData.get("file");

    if (!(file instanceof File) || !documentType) {
      setMessage("Choose a document type and file.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only PDF, JPG, and PNG files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      setMessage("File size must be 10 MB or less.");
      return;
    }

    setIsUploading(true);
    setMessage("");
    const extension = file.name.split(".").pop() ?? "file";
    const filePath = `${application.applicant_id}/${application.id}/${documentType}-${Date.now()}.${extension}`;
    const upload = await supabase.storage.from("application-documents").upload(filePath, file);

    if (upload.error) {
      setIsUploading(false);
      setMessage(upload.error.message);
      return;
    }

    const { data, error } = await supabase
      .from("application_documents")
      .insert({
        application_id: application.id,
        applicant_id: application.applicant_id,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      })
      .select("*")
      .single<ApplicationDocument>();

    setIsUploading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setItems((current) => [data, ...current]);
    setMessage("Document uploaded.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Upload document</CardTitle>
        </CardHeader>
        <CardContent>
          {message ? (
            <p className="mb-4 rounded-md border bg-muted p-3 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}
          {isLocked ? (
            <p className="rounded-md border p-3 text-sm text-muted-foreground">
              Documents cannot be changed after submission.
            </p>
          ) : (
            <form action={uploadDocument} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document_type">Document type</Label>
                <select
                  id="document_type"
                  name="document_type"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  required
                >
                  {requiredDocumentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <Button type="submit" disabled={isUploading}>
                <FileUp className="h-4 w-4" aria-hidden="true" /> Upload
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Uploaded documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((document) => (
              <div key={document.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{document.file_name}</p>
                <p className="capitalize text-muted-foreground">
                  {document.document_type.replaceAll("_", " ")}
                </p>
              </div>
            ))}
            {!items.length ? (
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
