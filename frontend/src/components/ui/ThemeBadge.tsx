import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const themeBadgeVariants = cva(
  "inline-flex items-center justify-center px-3 py-1.5 border rounded-sm",
  {
    variants: {
      variant: {
        gold: "bg-gold/10 border-gold/30 text-gold",
        crimson: "bg-crimson/10 border-crimson/30 text-crimson",
        muted: "bg-gray-500/10 border-gray-500/30 text-gray-500",
      },
    },
    defaultVariants: {
      variant: "gold",
    },
  }
);

interface ThemeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof themeBadgeVariants> {
  theme: string;
}

export function ThemeBadge({ theme, variant, className, ...props }: ThemeBadgeProps) {
  return (
    <div
      className={cn(themeBadgeVariants({ variant }), className)}
      {...props}
    >
      <span className="text-[10px] font-mono tracking-[0.2em] leading-none">
        {theme}
      </span>
    </div>
  );
}
