import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-28 w-full rounded-xl border border-sky-200/80 bg-white/55 px-3 py-2 text-sm outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-all placeholder:text-muted-foreground focus-visible:border-sky-300 focus-visible:bg-white/75 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
