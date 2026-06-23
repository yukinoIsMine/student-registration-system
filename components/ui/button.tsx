import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "soft-glow bg-[linear-gradient(135deg,#0284c7,#38bdf8)] text-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(14,165,233,0.28)]",
        secondary:
          "border border-white/70 bg-white/55 text-secondary-foreground shadow-[0_10px_30px_rgba(14,116,144,0.1)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/75",
        outline:
          "border border-sky-200/80 bg-white/45 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_30px_rgba(14,116,144,0.08)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/70 hover:text-accent-foreground",
        ghost: "text-foreground hover:bg-white/55 hover:text-primary hover:shadow-[0_10px_30px_rgba(14,116,144,0.08)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_16px_36px_rgba(220,38,38,0.18)] hover:-translate-y-0.5 hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
