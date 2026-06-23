import { Badge } from "@/components/ui/badge";
import { moneylessStatusLabel } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";

const statusVariant: Record<ApplicationStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  submitted: "secondary",
  under_review: "secondary",
  accepted: "default",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge variant={statusVariant[status]}>{moneylessStatusLabel(status)}</Badge>;
}
