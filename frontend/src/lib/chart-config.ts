import type { CSSProperties } from "react";

// Shared tooltip styles for Recharts components
export const CHART_TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--foreground)",
    padding: "12px",
  } as CSSProperties,
  itemStyle: { color: "var(--foreground)" } as CSSProperties,
  labelStyle: { color: "var(--gold)" } as CSSProperties,
};
