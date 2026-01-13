"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SortButton } from "@/components/ui/SortButton";
import {
  ModelFingerprint,
  TOOL_COLORS,
  TOOL_LABELS,
  TOOL_ICONS,
  getMobNickname,
  computeTonyRankings,
} from "@/lib/types";

interface ModelResultsProps {
  fingerprints: ModelFingerprint[];
}

export default function ModelResults({ fingerprints }: ModelResultsProps) {
  const [sortBy, setSortBy] = useState<"violence" | "diplomacy" | "name">("violence");

  const tonyRankings = useMemo(() => computeTonyRankings(fingerprints), [fingerprints]);

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
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          <span className="bg-gradient-to-b from-crimson to-crimson-dark bg-clip-text text-transparent">
            GABAGOOL
          </span>
          <span className="text-foreground"> BENCH</span>
        </h1>

        {/* Project description */}
        <p className="max-w-2xl mx-auto mb-6 font-body text-base md:text-lg text-muted-foreground leading-relaxed">
          A benchmark testing how 40+ LLMs handle moral dilemmas as{" "}
          <span className="text-gold italic">The Sopranos</span>&apos; Tony Soprano.
          Do they order hits, call sitdowns, or freeze up entirely?
        </p>

        {/* CTA */}
        <p className="font-display text-base md:text-lg text-gray-500 tracking-wide">
          Click any model to read their reasoning.
        </p>
      </header>

      {/* Actions Legend */}
      <div className="py-4 sm:py-6 px-4 sm:px-6 mb-8 sm:mb-12 bg-background border-y border-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-display text-gray-500 tracking-widest">
            DECISIONS
          </span>
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3">
            {Object.entries(TOOL_LABELS).map(([key, label]) => (
              <span
                key={key}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded font-mono text-xs whitespace-nowrap"
                style={{
                  backgroundColor: `${TOOL_COLORS[key]}20`,
                  color: TOOL_COLORS[key],
                  border: `1px solid ${TOOL_COLORS[key]}40`,
                }}
              >
                {TOOL_ICONS[key]} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-baseline gap-4">
            <h2 className="font-display text-2xl text-white tracking-wide">
              THE RESULTS
            </h2>
            <span className="text-sm font-mono text-gray-500">
              {fingerprints.length} models tested · Dec 25, 2025
            </span>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs font-display text-gray-500 tracking-widest">
              SORT
            </span>
            <div className="flex gap-1.5 sm:gap-2">
              <SortButton
                variant="violence"
                active={sortBy === "violence"}
                onClick={() => setSortBy("violence")}
              >
                VIOLENT
              </SortButton>
              <SortButton
                variant="diplomacy"
                active={sortBy === "diplomacy"}
                onClick={() => setSortBy("diplomacy")}
              >
                DIPLOMATIC
              </SortButton>
              <SortButton
                variant="name"
                active={sortBy === "name"}
                onClick={() => setSortBy("name")}
              >
                A-Z
              </SortButton>
            </div>
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedFingerprints.map((fp, index) => {
            const nickname = getMobNickname(fp, tonyRankings.get(fp.model));
            const violencePercent = Math.round(fp.violence_rate * 100);
            const sitdownPercent = Math.round(fp.sitdown_rate * 100);

            return (
              <Link
                key={fp.model}
                href={`/models/${encodeURIComponent(fp.model)}`}
                className="block"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="mob-card cursor-pointer group h-full">
                  <CardContent className="p-4">
                  {/* Model Name & Nickname */}
                  <div className="mb-3">
                    <div className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors truncate">
                      {fp.model}
                    </div>
                    <div className="text-base text-violence font-display tracking-wider font-semibold drop-shadow-[0_0_8px_rgba(220,20,60,0.5)]">
                      {nickname.name}
                    </div>
                  </div>

                  {/* Violence Meter */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-foreground/70">VIOLENCE</span>
                      <span className="text-violence font-semibold">{violencePercent}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-crimson-dark to-crimson transition-all duration-500"
                        style={{ width: `${violencePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Sitdown Meter */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-foreground/70">DIPLOMACY</span>
                      <span className="text-gold font-semibold">{sitdownPercent}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-500"
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
                        className="flex-1 h-6 rounded-sm flex items-center justify-center text-xs font-mono"
                        style={{ backgroundColor: TOOL_COLORS[tool] + "33" }}
                        title={`${TOOL_LABELS[tool]}: ${count}`}
                      >
                        <span style={{ color: TOOL_COLORS[tool] }}>{count}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Footer */}
                  <div className="flex justify-between mt-4 pt-3 border-t border-border text-sm text-muted-foreground font-mono">
                    <span>${fp.avg_cost.toFixed(4)}</span>
                    <span>{(fp.avg_duration_ms / 1000).toFixed(1)}s</span>
                    <span>{fp.total_tokens.toLocaleString()} tok</span>
                  </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
