import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva(
  "rounded-lg px-4 py-3 min-w-[80px] text-center transition-[background-color,box-shadow]",
  {
    variants: {
      variant: {
        violence: "bg-crimson-hover/10 border border-crimson-hover/30 hover:bg-crimson-hover/15 hover:shadow-[0_0_20px_rgba(255,68,68,0.15)]",
        diplomacy: "bg-gold/10 border border-gold/30 hover:bg-gold/15 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]",
        success: "bg-success/10 border border-success/30 hover:bg-success/15 hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",
        muted: "bg-gray-500/10 border border-gray-500/30 hover:bg-gray-500/15",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
);

const statValueVariants = cva(
  "font-display font-black text-2xl",
  {
    variants: {
      variant: {
        violence: "text-crimson-hover",
        diplomacy: "text-gold",
        success: "text-success",
        muted: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
);

interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  value: React.ReactNode;
  label: string;
  suffix?: React.ReactNode;
}

export function StatCard({
  value,
  label,
  suffix,
  variant,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(statCardVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-baseline justify-center gap-1">
        <span className={statValueVariants({ variant })}>
          {value}
        </span>
        {suffix && (
          <span className="text-gray-400 text-sm font-mono">{suffix}</span>
        )}
      </div>
      <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}
