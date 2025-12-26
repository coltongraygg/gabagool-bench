"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  ModelFingerprint,
  ScenarioResult,
  Scenario,
  TOOL_COLORS,
  TOOL_LABELS,
  TOOL_ICONS,
  getMobNickname,
  SCENARIO_NAMES,
} from "@/lib/types";

interface ModelResultsProps {
  fingerprints: ModelFingerprint[];
}

export default function ModelResults({ fingerprints }: ModelResultsProps) {
  const [selectedModel, setSelectedModel] = useState<ModelFingerprint | null>(null);
  const [sortBy, setSortBy] = useState<"violence" | "diplomacy" | "name">("violence");
  const [modelResults, setModelResults] = useState<ScenarioResult[]>([]);
  const [scenarios, setScenarios] = useState<Record<string, Scenario>>({});

  const handleModelClick = async (model: ModelFingerprint) => {
    setSelectedModel(model);

    try {
      const res = await fetch(`/api/results?model=${encodeURIComponent(model.model)}`);
      const data = await res.json();
      setModelResults(data.results || []);
      setScenarios(data.scenarios || {});
    } catch (error) {
      console.error("Failed to load model results:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
    setModelResults([]);
    setScenarios({});
  };

  const sortedFingerprints = useMemo(() => {
    return [...fingerprints].sort((a, b) => {
      if (sortBy === "violence") return b.violence_rate - a.violence_rate;
      if (sortBy === "diplomacy") return b.sitdown_rate - a.sitdown_rate;
      return a.model.localeCompare(b.model);
    });
  }, [fingerprints, sortBy]);

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          <span className="bg-gradient-to-b from-[#DC143C] to-[#8B0000] bg-clip-text text-transparent">
            GABAGOOL
          </span>
          <span className="text-[#e8e8e8]"> BENCH</span>
        </h1>

        {/* Project description */}
        <p className="max-w-2xl mx-auto mb-6 font-[family-name:var(--font-body)] text-base md:text-lg text-[#888] leading-relaxed">
          A benchmark testing how 40+ LLMs handle moral dilemmas as{" "}
          <span className="text-[#D4AF37] italic">The Sopranos</span>&apos; Tony Soprano.
          Do they order hits, call sitdowns, or freeze up entirely?
        </p>

        {/* CTA */}
        <p className="font-[family-name:var(--font-display)] text-base md:text-lg text-[#666] tracking-wide">
          Click any model to read their reasoning.
        </p>
      </header>

      {/* Actions Legend */}
      <div className="py-4 sm:py-6 px-4 sm:px-6 mb-8 sm:mb-12 bg-[#0a0a0a] border-y border-[#1a1a1a]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-[family-name:var(--font-display)] text-[#666] tracking-widest">
            ACTIONS
          </span>
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3">
            {Object.entries(TOOL_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:py-1 rounded bg-[#141414] border border-[#2a2a2a]"
              >
                <span className="text-sm">{TOOL_ICONS[key]}</span>
                <span
                  className="text-[10px] sm:text-xs font-[family-name:var(--font-mono)]"
                  style={{ color: TOOL_COLORS[key] }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-baseline gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-white tracking-wide">
              THE RESULTS
            </h2>
            <span className="text-sm font-[family-name:var(--font-mono)] text-[#666]">
              {fingerprints.length} models tested · Dec 25, 2025
            </span>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-[family-name:var(--font-display)] text-[#666] tracking-widest">
              SORT
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => setSortBy("violence")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded font-[family-name:var(--font-display)] tracking-wide transition-all ${
                  sortBy === "violence"
                    ? "bg-[#DC143C] text-white"
                    : "bg-[#141414] text-[#888] hover:text-white border border-[#2a2a2a]"
                }`}
              >
                VIOLENT
              </button>
              <button
                onClick={() => setSortBy("diplomacy")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded font-[family-name:var(--font-display)] tracking-wide transition-all ${
                  sortBy === "diplomacy"
                    ? "bg-[#D4AF37] text-black"
                    : "bg-[#141414] text-[#888] hover:text-white border border-[#2a2a2a]"
                }`}
              >
                DIPLOMATIC
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded font-[family-name:var(--font-display)] tracking-wide transition-all ${
                  sortBy === "name"
                    ? "bg-[#2a2a2a] text-white"
                    : "bg-[#141414] text-[#888] hover:text-white border border-[#2a2a2a]"
                }`}
              >
                A-Z
              </button>
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedFingerprints.map((fp, index) => {
            const nickname = getMobNickname(fp);
            const violencePercent = Math.round(fp.violence_rate * 100);
            const sitdownPercent = Math.round(fp.sitdown_rate * 100);

            return (
              <Card
                key={fp.model}
                className="mob-card cursor-pointer group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleModelClick(fp)}
              >
                <CardContent className="p-4">
                  {/* Model Name & Nickname */}
                  <div className="mb-3">
                    <div className="font-[family-name:var(--font-display)] text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors truncate">
                      {fp.model}
                    </div>
                    <div className="text-base text-[#FF6B6B] font-[family-name:var(--font-display)] tracking-wider font-semibold drop-shadow-[0_0_8px_rgba(220,20,60,0.5)]">
                      {nickname.name}
                    </div>
                  </div>

                  {/* Violence Meter */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1 font-[family-name:var(--font-mono)]">
                      <span className="text-[#aaa]">VIOLENCE</span>
                      <span className="text-[#FF6B6B] font-semibold">{violencePercent}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B0000] to-[#DC143C] transition-all duration-500"
                        style={{ width: `${violencePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Sitdown Meter */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 font-[family-name:var(--font-mono)]">
                      <span className="text-[#aaa]">DIPLOMACY</span>
                      <span className="text-[#D4AF37] font-semibold">{sitdownPercent}%</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a] rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] transition-all duration-500"
                        style={{ width: `${sitdownPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Tool Distribution Mini */}
                  <div className="flex gap-1">
                    {Object.entries(fp.tool_distribution)
                      .filter(([tool]) => tool in TOOL_COLORS)
                      .map(([tool, count]) => (
                      <div
                        key={tool}
                        className="flex-1 h-6 rounded-sm flex items-center justify-center text-xs font-[family-name:var(--font-mono)]"
                        style={{ backgroundColor: TOOL_COLORS[tool] + "33" }}
                        title={`${TOOL_LABELS[tool]}: ${count}`}
                      >
                        <span style={{ color: TOOL_COLORS[tool] }}>{count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Footer */}
                  <div className="flex justify-between mt-4 pt-3 border-t border-[#2a2a2a] text-sm text-[#888] font-[family-name:var(--font-mono)]">
                    <span>${fp.avg_cost.toFixed(4)}</span>
                    <span>{(fp.avg_duration_ms / 1000).toFixed(1)}s</span>
                    <span>{fp.total_tokens.toLocaleString()} tok</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Model Detail Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl md:max-w-2xl max-h-[90vh] bg-[#0d0d0d] border-[#2a2a2a] p-0 overflow-hidden">
          {selectedModel && (
            <div className="relative h-full">
              <DialogHeader className="p-4 pb-0 pr-10 sm:p-6 sm:pr-12">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
                  <div>
                    <DialogTitle className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-white">
                      {selectedModel.model}
                    </DialogTitle>
                    <div className="text-lg sm:text-xl text-[#FF6B6B] font-[family-name:var(--font-display)] tracking-wider mt-2 font-semibold drop-shadow-[0_0_10px_rgba(220,20,60,0.6)]">
                      {getMobNickname(selectedModel).name}
                    </div>
                    <div className="text-base sm:text-lg text-[#bbb] italic font-[family-name:var(--font-body)] mt-1 sm:mt-2">
                      &ldquo;{getMobNickname(selectedModel).title}&rdquo;
                    </div>
                  </div>
                  <div className="flex gap-4 sm:flex-col sm:gap-0 sm:text-right font-[family-name:var(--font-mono)] text-sm sm:text-base">
                    <div className="text-[#FF6B6B] font-semibold">
                      {Math.round(selectedModel.violence_rate * 100)}% VIOLENCE
                    </div>
                    <div className="text-[#D4AF37] font-semibold">
                      {Math.round(selectedModel.sitdown_rate * 100)}% DIPLOMACY
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="decisions" className="p-4 pt-3 sm:p-6 sm:pt-4 flex flex-col">
                <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a] p-1 h-auto flex-shrink-0">
                  <TabsTrigger
                    value="decisions"
                    className="px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base data-[state=active]:bg-[#DC143C] data-[state=active]:text-white data-[state=inactive]:text-[#888] font-[family-name:var(--font-display)] tracking-wider"
                  >
                    DECISIONS
                  </TabsTrigger>
                  <TabsTrigger
                    value="breakdown"
                    className="px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base data-[state=active]:bg-[#DC143C] data-[state=active]:text-white data-[state=inactive]:text-[#888] font-[family-name:var(--font-display)] tracking-wider"
                  >
                    BREAKDOWN
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base data-[state=active]:bg-[#DC143C] data-[state=active]:text-white data-[state=inactive]:text-[#888] font-[family-name:var(--font-display)] tracking-wider"
                  >
                    STATS
                  </TabsTrigger>
                </TabsList>

                {/* Fixed height content area */}
                <div className="h-[50vh] sm:h-[55vh] mt-3 sm:mt-4 relative">
                  <TabsContent value="decisions" className="mt-0 h-full absolute inset-0 data-[state=inactive]:hidden">
                    <ScrollArea className="h-full">
                      <div className="space-y-4 sm:space-y-6 pr-2 sm:pr-4 pb-20">
                        {modelResults.map((result) => {
                          const scenario = scenarios[result.scenario_id];
                          const tool = result.decision?.action || "error";
                          const { action, ...args } = result.decision || {};

                          return (
                            <div
                              key={result.scenario_id}
                              className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 sm:p-6"
                            >
                              {/* Header */}
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-0 mb-3 sm:mb-4">
                                <div className="flex-1">
                                  <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-white">
                                    {SCENARIO_NAMES[result.scenario_id] || result.scenario_id}
                                  </h3>
                                  {scenario && (
                                    <p className="text-xs sm:text-sm text-[#888] mt-1 font-[family-name:var(--font-body)]">
                                      {scenario.description}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  className="font-[family-name:var(--font-display)] text-xs sm:text-sm px-2 py-1 sm:px-3 whitespace-nowrap self-start"
                                  style={{
                                    backgroundColor: TOOL_COLORS[tool] || "#666",
                                    color: tool === "call_sitdown" || tool === "threaten" ? "black" : "white",
                                  }}
                                >
                                  {TOOL_ICONS[tool]} {TOOL_LABELS[tool] || tool}
                                </Badge>
                              </div>

                              {/* The Decision - formatted nicely */}
                              {Object.keys(args).length > 0 && (
                                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-[#0d0d0d] rounded border-l-4 border-[#DC143C]">
                                  <div className="text-xs text-[#D4AF37] font-[family-name:var(--font-display)] tracking-wider mb-2">
                                    THE DECISION
                                  </div>
                                  <div className="space-y-1 sm:space-y-2">
                                    {Object.entries(args).map(([key, value]) => (
                                      <div key={key} className="text-sm sm:text-base text-[#ccc] font-[family-name:var(--font-body)]">
                                        <span className="text-[#888] capitalize">{key.replace(/_/g, " ")}: </span>
                                        <span className="text-white">{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* The Reasoning */}
                              {result.reasoning && (
                                <div className="p-3 sm:p-4 bg-[#0d0d0d] rounded border-l-4 border-[#D4AF37]">
                                  <div className="text-xs text-[#D4AF37] font-[family-name:var(--font-display)] tracking-wider mb-2 sm:mb-3">
                                    THE REASONING
                                  </div>
                                  <p className="text-sm sm:text-base text-[#bbb] font-[family-name:var(--font-body)] leading-relaxed italic whitespace-pre-wrap">
                                    &ldquo;{result.reasoning}&rdquo;
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="breakdown" className="mt-0 h-full absolute inset-0 data-[state=inactive]:hidden overflow-auto">
                    <div className="flex flex-col gap-4 sm:gap-6 pb-20">
                          {/* Pie Chart */}
                          <div className="bg-[#141414] border border-[#2a2a2a] rounded p-3 sm:p-4">
                            <div className="font-[family-name:var(--font-display)] text-xs sm:text-sm text-[#888] mb-3 sm:mb-4">
                              TOOL DISTRIBUTION
                            </div>
                            <div className="h-[200px] sm:h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={Object.entries(selectedModel.tool_distribution)
                                      .filter(([name]) => name in TOOL_COLORS)
                                      .map(([name, value]) => ({ name, value, fill: TOOL_COLORS[name] }))
                                    }
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    dataKey="value"
                                    label={({ name, value }) => `${TOOL_ICONS[name]} ${value}`}
                                    labelLine={false}
                                    animationBegin={0}
                                    animationDuration={800}
                                  >
                                    {Object.entries(selectedModel.tool_distribution)
                                      .filter(([name]) => name in TOOL_COLORS)
                                      .map(([name], index) => (
                                        <Cell key={`cell-${index}`} fill={TOOL_COLORS[name]} />
                                      ))}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#1a1a1a",
                                      border: "1px solid #2a2a2a",
                                      borderRadius: "4px",
                                      color: "#e8e8e8",
                                    }}
                                    itemStyle={{ color: "#e8e8e8" }}
                                    labelStyle={{ color: "#D4AF37" }}
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
                          <div className="bg-[#141414] border border-[#2a2a2a] rounded p-3 sm:p-4">
                            <div className="font-[family-name:var(--font-display)] text-xs sm:text-sm text-[#888] mb-3 sm:mb-4">
                              RATE BREAKDOWN
                            </div>
                            <div className="h-[200px] sm:h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { name: "Hit", value: selectedModel.violence_rate * 100, fill: TOOL_COLORS.order_hit },
                                    { name: "Sitdown", value: selectedModel.sitdown_rate * 100, fill: TOOL_COLORS.call_sitdown },
                                    { name: "Tax", value: selectedModel.tax_rate * 100, fill: TOOL_COLORS.apply_tax },
                                    { name: "Threaten", value: selectedModel.threaten_rate * 100, fill: TOOL_COLORS.threaten },
                                    { name: "Bribe", value: selectedModel.bribe_rate * 100, fill: TOOL_COLORS.bribe },
                                    { name: "Nothing", value: selectedModel.do_nothing_rate * 100, fill: TOOL_COLORS.do_nothing },
                                  ].sort((a, b) => b.value - a.value)}
                                  layout="vertical"
                                  margin={{ left: 10, right: 20 }}
                                >
                                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#666", fontSize: 10 }} />
                                  <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={60}
                                    tick={{ fill: "#888", fontSize: 11 }}
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
                                    formatter={(value: number) => [`${value.toFixed(1)}%`]}
                                  />
                                  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationBegin={400} animationDuration={800} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="mt-0 h-full absolute inset-0 data-[state=inactive]:hidden overflow-auto flex items-center justify-center p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:gap-4 w-full pb-16">
                          <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="text-[#888] text-xs sm:text-sm font-[family-name:var(--font-mono)] tracking-wide uppercase">
                              Avg Cost/Scenario
                            </div>
                            <div className="text-[#D4AF37] text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-bold">
                              ${selectedModel.avg_cost.toFixed(4)}
                            </div>
                          </div>
                          <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="text-[#888] text-xs sm:text-sm font-[family-name:var(--font-mono)] tracking-wide uppercase">
                              Avg Response Time
                            </div>
                            <div className="text-[#D4AF37] text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-bold">
                              {(selectedModel.avg_duration_ms / 1000).toFixed(1)}s
                            </div>
                          </div>
                          <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="text-[#888] text-xs sm:text-sm font-[family-name:var(--font-mono)] tracking-wide uppercase">
                              Total Tokens
                            </div>
                            <div className="text-[#D4AF37] text-2xl sm:text-3xl font-[family-name:var(--font-display)] font-bold">
                              {selectedModel.total_tokens.toLocaleString()}
                            </div>
                          </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              {/* Dialog-level scroll indicator gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent pointer-events-none z-10" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
