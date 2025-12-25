"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Scenario,
  ScenarioResult,
  SCENARIO_THEMES,
  TOOL_COLORS,
  TOOL_LABELS,
} from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ScenarioDetailProps {
  scenario: Scenario;
  results: ScenarioResult[];
}

export default function ScenarioDetail({
  scenario,
  results,
}: ScenarioDetailProps) {
  const theme = SCENARIO_THEMES[scenario.id] || "DILEMMA";

  const stats = useMemo(() => {
    // Count actions
    const actionCounts: Record<string, number> = {};
    results.forEach((r) => {
      const tool = r.tool_calls?.[0]?.tool?.trim() || "error";
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
        const tool = r.tool_calls?.[0]?.tool?.trim() || "error";
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
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/scenarios"
          className="inline-flex items-center gap-2 mb-6 text-[#666] hover:text-[#D4AF37] transition-colors"
        >
          <svg
            className="w-4 h-4"
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
          <span className="text-sm font-[family-name:var(--font-mono)] tracking-wider">
            ALL SCENARIOS
          </span>
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Theme badge */}
          <div
            className="inline-flex items-center justify-center mb-4 px-3 py-1.5
            bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-sm"
          >
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-[#D4AF37] tracking-[0.2em] leading-none">
              {theme}
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-[#e8e8e8] mb-4">
            {scenario.name}
          </h1>

          <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[#DC143C] italic">
            {scenario.description}
          </p>
        </header>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Context */}
          <div
            className="relative pl-6 py-6 pr-6
            border-l-4 border-[#D4AF37] bg-[#141414] rounded-r-lg"
          >
            <h2
              className="text-xs font-[family-name:var(--font-mono)]
              text-[#D4AF37] tracking-[0.2em] mb-4"
            >
              CONTEXT
            </h2>
            <p
              className="font-[family-name:var(--font-body)] text-[#ccc]
              text-lg leading-relaxed"
            >
              {scenario.context}
            </p>
          </div>

          {/* Prompt */}
          <div
            className="relative pl-6 py-6 pr-6
            border-l-4 border-[#DC143C] bg-[#141414] rounded-r-lg"
          >
            <h2
              className="text-xs font-[family-name:var(--font-mono)]
              text-[#DC143C] tracking-[0.2em] mb-4"
            >
              PROMPT
            </h2>
            <p
              className="font-[family-name:var(--font-body)] text-[#e8e8e8]
              text-lg leading-relaxed font-medium"
            >
              {scenario.prompt}
            </p>
          </div>
        </div>

        {/* Results Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-[family-name:var(--font-display)] text-2xl
              text-[#e8e8e8] tracking-wide"
            >
              MODEL DECISIONS
            </h2>
            <span className="text-sm font-[family-name:var(--font-mono)] text-[#666]">
              {stats.totalModels} models tested
            </span>
          </div>

          {/* Chart */}
          {stats.chartData.length > 0 && (
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-6 mb-8">
              <h3
                className="text-xs font-[family-name:var(--font-mono)]
                text-[#888] tracking-[0.2em] mb-4"
              >
                ACTION BREAKDOWN
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.chartData}
                    layout="vertical"
                    margin={{ left: 10, right: 30 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fill: "#666", fontSize: 11 }}
                      axisLine={{ stroke: "#2a2a2a" }}
                      tickLine={{ stroke: "#2a2a2a" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={90}
                      tick={{ fill: "#888", fontSize: 12 }}
                      axisLine={{ stroke: "#2a2a2a" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        borderRadius: "4px",
                        color: "#e8e8e8",
                      }}
                      itemStyle={{ color: "#e8e8e8" }}
                      labelStyle={{ color: "#D4AF37" }}
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
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-6">
              <h3
                className="text-xs font-[family-name:var(--font-mono)]
                text-[#888] tracking-[0.2em] mb-4"
              >
                EACH MODEL&apos;S CHOICE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.modelDecisions.map((decision) => (
                  <div
                    key={decision.model}
                    className="flex items-center justify-between gap-3 px-4 py-3
                      bg-[#0d0d0d] rounded-lg border border-[#1a1a1a]
                      hover:border-[#2a2a2a] transition-colors"
                  >
                    <span
                      className="text-sm font-[family-name:var(--font-mono)] text-[#ccc] truncate"
                      title={decision.model}
                    >
                      {decision.model}
                    </span>
                    <span
                      className="text-xs font-[family-name:var(--font-mono)] px-2 py-1 rounded shrink-0"
                      style={{
                        backgroundColor: `${decision.color}20`,
                        color: decision.color,
                        border: `1px solid ${decision.color}40`,
                      }}
                    >
                      {decision.toolLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
