"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Scenario,
  ScenarioResult,
  TOOL_COLORS,
  TOOL_LABELS,
} from "@/lib/types";
import { ThemeBadge } from "@/components/ui/ThemeBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_TOOLTIP_STYLES, CHART_CURSOR_STYLE } from "@/lib/chart-config";

interface ScenarioDetailProps {
  scenario: Scenario;
  results: ScenarioResult[];
}

export default function ScenarioDetail({
  scenario,
  results,
}: ScenarioDetailProps) {
  const theme = scenario.theme || "DILEMMA";

  const stats = useMemo(() => {
    // Count actions
    const actionCounts: Record<string, number> = {};
    results.forEach((r) => {
      const tool = r.decision?.action || "error";
      actionCounts[tool] = (actionCounts[tool] || 0) + 1;
    });

    // Chart data
    const chartData = Object.entries(actionCounts)
      .filter(([tool]) => tool in TOOL_COLORS)
      .map(([tool, count]) => ({
        name: TOOL_LABELS[tool] || tool,
        count,
        fill: TOOL_COLORS[tool],
        tool,
      }))
      .sort((a, b) => b.count - a.count);

    // Individual model decisions
    const modelDecisions = results
      .map((r) => {
        const tool = r.decision?.action || "error";
        return {
          model: r.model,
          tool,
          toolLabel: TOOL_LABELS[tool] || tool || "Error",
          color: TOOL_COLORS[tool] || "#666",
        };
      })
      .sort((a, b) => a.model.localeCompare(b.model));

    return {
      totalModels: results.length,
      chartData,
      modelDecisions,
    };
  }, [results]);

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/scenarios"
          className="inline-flex items-center gap-2 mb-6 text-gray-500 hover:text-gold transition-colors"
        >
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-mono tracking-wider">
            ALL SCENARIOS
          </span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Theme badge */}
          <ThemeBadge theme={theme} className="mb-4" />

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-foreground mb-4">
            {scenario.name}
          </h1>

          <p className="font-body text-base md:text-lg text-crimson italic">
            {scenario.description}
          </p>
        </header>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Context */}
          <div
            className="accordion-gradient-border relative p-6 bg-card rounded-lg overflow-hidden"
            style={{ "--border-accent-color": "var(--gold)" } as React.CSSProperties}
          >
            <SectionHeader as="h2" variant="gold">CONTEXT</SectionHeader>
            <p className="font-body text-foreground text-lg leading-relaxed">
              {scenario.context}
            </p>
          </div>

          {/* Message */}
          <div
            className="accordion-gradient-border relative p-6 bg-card rounded-lg overflow-hidden"
            style={{ "--border-accent-color": "var(--crimson)" } as React.CSSProperties}
          >
            <SectionHeader as="h2" variant="crimson">MESSAGE</SectionHeader>
            <p className="font-body text-foreground text-lg leading-relaxed font-medium">
              {scenario.prompt}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-foreground tracking-wide">
              MODEL DECISIONS
            </h2>
            <span className="text-sm font-mono text-gray-500">
              {stats.totalModels} models tested
            </span>
          </div>

          {/* Chart */}
          {stats.chartData.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <SectionHeader variant="muted">DECISION BREAKDOWN</SectionHeader>
              <div className="h-[220px] sm:h-[250px] md:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.chartData}
                    layout="vertical"
                    margin={{ left: 5, right: 25 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: "var(--gray-500)", fontSize: 11 }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={{ stroke: "var(--border)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={70}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      axisLine={{ stroke: "var(--border)" }}
                      tickLine={false}
                    />
                    <Tooltip
                      {...CHART_TOOLTIP_STYLES}
                      cursor={CHART_CURSOR_STYLE}
                      formatter={(value: number) => [
                        `${value} model${value !== 1 ? "s" : ""}`,
                        "Chose this action",
                      ]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Individual Model Decisions */}
          {stats.modelDecisions.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-6">
              <SectionHeader variant="muted">EACH MODEL&apos;S DECISION</SectionHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.modelDecisions.map((decision) => (
                  <Link
                    key={decision.model}
                    href={`/models/${encodeURIComponent(decision.model)}`}
                    className="flex items-center justify-between gap-3 px-4 py-3
                      bg-surface-dark rounded-lg border border-surface
                      hover:border-gold/50 hover:bg-surface transition-colors group"
                  >
                    <span
                      className="text-sm font-mono text-foreground/80 group-hover:text-gold truncate transition-colors"
                      title={decision.model}
                    >
                      {decision.model}
                    </span>
                    <span
                      className="text-xs font-mono px-2 py-1 rounded shrink-0"
                      style={{
                        backgroundColor: `${decision.color}20`,
                        color: decision.color,
                        border: `1px solid ${decision.color}40`,
                      }}
                    >
                      {decision.toolLabel}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
