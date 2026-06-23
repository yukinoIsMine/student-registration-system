import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-xl",
  {
    variants: {
      variant: {
        default: "border-sky-300/70 bg-sky-500/90 text-primary-foreground",
        secondary: "border-sky-200/80 bg-white/60 text-secondary-foreground",
        outline: "border-sky-200/80 bg-white/40 text-foreground",
        destructive: "border-red-200 bg-red-50/80 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
