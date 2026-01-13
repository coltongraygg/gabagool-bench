"use client";

import Link from "next/link";
import {
  ModelFingerprint,
  ScenarioResult,
  Scenario,
  TOOL_COLORS,
  TOOL_LABELS,
  TOOL_ICONS,
  getMobNickname,
} from "@/lib/types";
import { StyledSystemPrompt } from "@/components/ui/StyledSystemPrompt";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatCard } from "@/components/ui/StatCard";
import { MarkdownReasoning } from "@/components/ui/MarkdownReasoning";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_TOOLTIP_STYLES } from "@/lib/chart-config";

const TAB_TRIGGER_CLASS = "px-5 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base data-[state=active]:bg-crimson data-[state=active]:text-white data-[state=inactive]:text-muted-foreground font-display tracking-wider rounded-md transition-colors";

interface ModelDetailProps {
  fingerprint: ModelFingerprint;
  results: ScenarioResult[];
  scenarios: Record<string, Scenario>;
  tonyRanking?: { isMostTony: boolean; isLeastTony: boolean };
}

export default function ModelDetail({
  fingerprint,
  results,
  scenarios,
  tonyRanking,
}: ModelDetailProps) {
  const nickname = getMobNickname(fingerprint, tonyRanking);
  const violencePercent = Math.round(fingerprint.violence_rate * 100);
  const sitdownPercent = Math.round(fingerprint.sitdown_rate * 100);

  // Calculate canonical matches
  const canonicalMatches = results.filter((r) => {
    const canonical = scenarios[r.scenario_id]?.canonical?.action;
    return canonical && r.decision?.action === canonical;
  }).length;
  const canonicalTotal = results.filter((r) => scenarios[r.scenario_id]?.canonical?.action).length;

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-gold transition-colors group"
        >
          <svg
            className="size-4 transition-transform group-hover:-translate-x-1"
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
            ALL MODELS
          </span>
        </Link>

        {/* Header - Clean Layout */}
        <header className="mb-10 pb-8 border-b border-border">
          {/* Desktop: Model name + Stats on same row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              {fingerprint.model}
            </h1>

            {/* Stats - hidden on mobile, shown on sm+ */}
            <div className="hidden sm:flex gap-3 items-center flex-wrap">
              <StatCard
                variant="violence"
                value={`${violencePercent}%`}
                label="Violence"
              />
              <StatCard
                variant="diplomacy"
                value={`${sitdownPercent}%`}
                label="Diplomacy"
              />
              <StatCard
                variant={fingerprint.canonical_alignment >= 0.6 ? "success" : "violence"}
                value={canonicalMatches}
                suffix={`/${canonicalTotal}`}
                label="Canon"
              />
            </div>
          </div>

          {/* Nickname row */}
          <div className="flex items-center gap-4 flex-wrap mb-5">
            <div className="text-xl sm:text-2xl text-crimson font-display tracking-wide font-bold">
              {nickname.name}
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300" />
            <div className="text-lg text-muted-foreground italic font-body">
              &ldquo;{nickname.title}&rdquo;
            </div>
          </div>

          {/* Stats - mobile only, shown after nickname */}
          <div className="flex sm:hidden gap-3 items-center flex-wrap mb-5">
            <StatCard
              variant="violence"
              value={`${violencePercent}%`}
              label="Violence"
            />
            <StatCard
              variant="diplomacy"
              value={`${sitdownPercent}%`}
              label="Diplomacy"
            />
            <StatCard
              variant={fingerprint.canonical_alignment >= 0.6 ? "success" : "violence"}
              value={canonicalMatches}
              suffix={`/${canonicalTotal}`}
              label="Canon"
            />
          </div>

          {/* System prompt - full width */}
          <p className="text-lg text-gray-500 font-body leading-[1.8]">
            <StyledSystemPrompt />
          </p>
        </header>


        {/* Tabs Content */}
        <Tabs defaultValue="decisions" className="w-full">
          <TabsList className="bg-surface border border-border p-1 h-auto mb-8 rounded-lg">
            <TabsTrigger value="decisions" className={TAB_TRIGGER_CLASS}>
              DECISIONS
            </TabsTrigger>
            <TabsTrigger value="breakdown" className={TAB_TRIGGER_CLASS}>
              BREAKDOWN
            </TabsTrigger>
          </TabsList>

          {/* DECISIONS Tab */}
          <TabsContent value="decisions" className="mt-0">
            {/* Decisions Accordion */}
            <Accordion type="single" collapsible className="space-y-2">
              {results.map((result, index) => {
                const scenario = scenarios[result.scenario_id];
                const tool = result.decision?.action || "error";

                return (
                  <AccordionItem
                    key={result.scenario_id}
                    value={result.scenario_id}
                    className="accordion-gradient-border bg-card border border-border rounded-lg overflow-hidden hover:border-gray-300 transition-colors group/item"
                    style={{
                      "--border-accent-color": TOOL_COLORS[tool] || "#666",
                    } as React.CSSProperties}
                  >
                    <AccordionTrigger className="px-5 sm:px-6 py-4 hover:no-underline hover:bg-surface transition-colors">
                      <div className="grid grid-cols-[auto_1fr_auto] gap-4 w-full items-start">
                        <span className="text-gray-300 group-hover/item:text-gray-400 font-mono text-xs tabular-nums pt-1">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="text-left min-w-0">
                          <h3 className="font-display text-base sm:text-lg text-white group-hover/item:text-white/90">
                            {scenario?.name || result.scenario_id}
                          </h3>
                          {scenario?.description && (
                            <p className="text-base text-gray-500 font-body mt-1 line-clamp-2">
                              {scenario.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          className="font-mono text-xs px-2 py-1 whitespace-nowrap mr-3 rounded"
                          style={{
                            backgroundColor: `${TOOL_COLORS[tool]}20`,
                            color: TOOL_COLORS[tool],
                            border: `1px solid ${TOOL_COLORS[tool]}40`,
                          }}
                        >
                          {TOOL_ICONS[tool]} {TOOL_LABELS[tool] || tool}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 sm:px-6 pb-6 pt-6">
                      <div className="pl-4 sm:pl-10 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Combined Decision + Reasoning Section */}
                        <div
                          className="relative rounded-lg p-5 overflow-hidden"
                          style={{
                            backgroundColor: `${TOOL_COLORS[tool]}08`,
                            boxShadow: `0 0 20px ${TOOL_COLORS[tool]}10, inset 0 0 30px ${TOOL_COLORS[tool]}05`,
                            border: `1px solid ${TOOL_COLORS[tool]}15`,
                          }}
                        >

                          {/* Dramatic slash decoration */}
                          <div
                            className="absolute top-4 right-4 text-6xl font-display font-black opacity-[0.07] select-none"
                            style={{ color: TOOL_COLORS[tool] }}
                          >
                            //
                          </div>

                          {/* Decision header */}
                          <div className="flex items-center gap-4 mb-5">
                            <div
                              className="flex items-center justify-center w-10 h-10 rounded-lg text-xl"
                              style={{
                                backgroundColor: `${TOOL_COLORS[tool]}20`,
                                border: `1px solid ${TOOL_COLORS[tool]}30`,
                              }}
                            >
                              {TOOL_ICONS[tool]}
                            </div>
                            <div>
                              <div className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase">
                                The Verdict
                              </div>
                              <div
                                className="text-lg font-display font-black tracking-wide"
                                style={{ color: TOOL_COLORS[tool] }}
                              >
                                {TOOL_LABELS[tool] || tool}
                              </div>
                            </div>
                          </div>

                          {/* Reasoning text */}
                          {result.decision?.reasoning && (
                            <MarkdownReasoning
                              content={result.decision.reasoning}
                              className="text-[17px] text-foreground/90 font-body leading-[1.85]"
                            />
                          )}

                          {/* Footer: Canon Match + View Scenario */}
                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                            {/* Canon Match Indicator */}
                            {(() => {
                              const canonicalAction = scenarios[result.scenario_id]?.canonical?.action;
                              const isMatch = canonicalAction && result.decision?.action === canonicalAction;
                              const hasCanonical = !!canonicalAction;

                              return hasCanonical ? (
                                <div className="flex items-center gap-2">
                                  {isMatch ? (
                                    <svg className="size-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="size-4 text-crimson-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                  <span className={`text-sm font-mono ${
                                    isMatch ? 'text-success' : 'text-crimson-hover'
                                  }`}>
                                    {isMatch ? 'Matches Tony' : 'Diverges from Tony'}
                                  </span>
                                </div>
                              ) : <div />;
                            })()}

                            {/* View Scenario Link */}
                            <Link
                              href={`/scenarios/${result.scenario_id}`}
                              className="group/link inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold font-mono transition-colors"
                            >
                              <span>View Scenario</span>
                              <svg
                                className="size-4 transition-transform group-hover/link:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          {/* BREAKDOWN Tab */}
          <TabsContent value="breakdown" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gradient-to-br from-card to-surface-dark border border-border rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="font-display text-sm text-muted-foreground mb-6 uppercase tracking-widest">
                  Decision Distribution
                </div>
                <div className="h-[250px] sm:h-[280px] md:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(fingerprint.tool_distribution)
                          .filter(([name]) => name in TOOL_COLORS)
                          .map(([name, value]) => ({
                            name,
                            value,
                            fill: TOOL_COLORS[name],
                          }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={95}
                        dataKey="value"
                        label={({ name, value }) =>
                          `${TOOL_ICONS[name]} ${value}`
                        }
                        labelLine={false}
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {Object.entries(fingerprint.tool_distribution)
                          .filter(([name]) => name in TOOL_COLORS)
                          .map(([name], index) => (
                            <Cell key={`cell-${index}`} fill={TOOL_COLORS[name]} />
                          ))}
                      </Pie>
                      <Tooltip
                        {...CHART_TOOLTIP_STYLES}
                        formatter={(value: number, name: string) => [
                          `${value} scenarios`,
                          TOOL_LABELS[name] || name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-gradient-to-br from-card to-surface-dark border border-border rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="font-display text-sm text-muted-foreground mb-6 uppercase tracking-widest">
                  Rate Breakdown
                </div>
                <div className="h-[250px] sm:h-[280px] md:h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Hit",
                          value: fingerprint.violence_rate * 100,
                          fill: TOOL_COLORS.order_hit,
                        },
                        {
                          name: "Sitdown",
                          value: fingerprint.sitdown_rate * 100,
                          fill: TOOL_COLORS.call_sitdown,
                        },
                        {
                          name: "Tax",
                          value: fingerprint.tax_rate * 100,
                          fill: TOOL_COLORS.apply_tax,
                        },
                        {
                          name: "Threaten",
                          value: fingerprint.threaten_rate * 100,
                          fill: TOOL_COLORS.threaten,
                        },
                        {
                          name: "Bribe",
                          value: fingerprint.bribe_rate * 100,
                          fill: TOOL_COLORS.bribe,
                        },
                        {
                          name: "Nothing",
                          value: fingerprint.do_nothing_rate * 100,
                          fill: TOOL_COLORS.do_nothing,
                        },
                        {
                          name: "Set Up",
                          value: fingerprint.setup_rate * 100,
                          fill: TOOL_COLORS.set_up,
                        },
                      ].sort((a, b) => b.value - a.value)}
                      layout="vertical"
                      margin={{ left: 15, right: 35 }}
                    >
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: "var(--gray-400)", fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={55}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <Tooltip
                        {...CHART_TOOLTIP_STYLES}
                        formatter={(value: number) => [`${value.toFixed(1)}%`]}
                      />
                      <Bar
                        dataKey="value"
                        radius={[0, 4, 4, 0]}
                        animationBegin={400}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Stats Bar - Metadata */}
            <div className="grid grid-cols-2 justify-items-center sm:flex sm:justify-center sm:items-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-foreground text-lg font-display font-bold tabular-nums">
                  ${fingerprint.avg_cost.toFixed(4)}
                </div>
                <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider">Avg Cost</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-foreground text-lg font-display font-bold tabular-nums">
                  {(fingerprint.avg_duration_ms / 1000).toFixed(1)}s
                </div>
                <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider">Response</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-foreground text-lg font-display font-bold tabular-nums">
                  {fingerprint.total_tokens.toLocaleString()}
                </div>
                <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider">Tokens</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-foreground text-lg font-display font-bold tabular-nums">
                  {fingerprint.total_scenarios}
                </div>
                <div className="text-gray-400 text-[10px] font-mono uppercase tracking-wider">Scenarios</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
