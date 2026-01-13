import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sectionHeaderVariants = cva(
  "text-xs font-mono tracking-[0.2em] mb-4 uppercase",
  {
    variants: {
      variant: {
        gold: "text-gold",
        crimson: "text-crimson",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
);

interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof sectionHeaderVariants> {
  as?: "h2" | "h3" | "h4";
}

export function SectionHeader({
  className,
  variant,
  as: Component = "h3",
  children,
  ...props
}: SectionHeaderProps) {
  return (
    <Component
      className={cn(sectionHeaderVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
