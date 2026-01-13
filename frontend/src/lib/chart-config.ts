import type { CSSProperties } from "react";

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

export const CHART_CURSOR_STYLE = {
  fill: "rgba(212, 175, 55, 0.04)",
  strokeWidth: 0,
};
