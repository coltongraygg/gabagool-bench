"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sortButtonVariants = cva(
  "px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm rounded font-display tracking-wide transition-colors min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        violence: "",
        diplomacy: "",
        name: "",
      },
      active: {
        true: "",
        false: "bg-card text-muted-foreground hover:text-white border border-border",
      },
    },
    compoundVariants: [
      {
        variant: "violence",
        active: true,
        className: "bg-crimson text-white",
      },
      {
        variant: "diplomacy",
        active: true,
        className: "bg-gold text-black",
      },
      {
        variant: "name",
        active: true,
        className: "bg-border text-white",
      },
    ],
    defaultVariants: {
      variant: "name",
      active: false,
    },
  }
);

interface SortButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sortButtonVariants> {}

export function SortButton({
  className,
  variant,
  active,
  children,
  ...props
}: SortButtonProps) {
  return (
    <button
      className={cn(sortButtonVariants({ variant, active }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
