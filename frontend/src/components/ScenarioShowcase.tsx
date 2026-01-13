"use client";

import Link from "next/link";
import { Scenario } from "@/lib/types";
import { StyledSystemPrompt } from "@/components/ui/StyledSystemPrompt";
import { ThemeBadge } from "@/components/ui/ThemeBadge";

interface ScenarioShowcaseProps {
  scenarios: Scenario[];
}

export default function ScenarioShowcase({
  scenarios,
}: ScenarioShowcaseProps) {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12 text-center">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          <span className="text-[#e8e8e8]">SYSTEM </span>
          <span className="bg-gradient-to-b from-[#DC143C] to-[#8B0000] bg-clip-text text-transparent">
            PROMPT
          </span>
        </h1>

        {/* System Prompt */}
        <p className="max-w-3xl mx-auto font-body text-base md:text-lg text-[#888] leading-relaxed">
          <StyledSystemPrompt />
        </p>
      </header>

      {/* Scenario Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => {
            const theme = scenario.theme || "DILEMMA";

            return (
              <Link
                key={scenario.id}
                href={`/scenarios/${scenario.id}`}
                className="mob-card rounded-lg p-6 group cursor-pointer flex flex-col h-full
                  focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Theme tag */}
                <ThemeBadge theme={theme} className="mb-4 self-start" />

                {/* Title */}
                <h3
                  className="font-display text-2xl font-bold
                  text-[#e8e8e8] mb-3 group-hover:text-[#D4AF37] transition-colors duration-300
                  leading-tight"
                >
                  {scenario.name}
                </h3>

                {/* Description */}
                <p
                  className="font-body text-[#888]
                  leading-relaxed line-clamp-2 flex-grow"
                >
                  {scenario.description}
                </p>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-4 mt-6
                  border-t border-[#2a2a2a] group-hover:border-[#8B0000]/50 transition-colors"
                >
                  <span
                    className="text-[10px] font-mono
                    text-[#555] tracking-widest uppercase"
                  >
                    View Details
                  </span>
                  <div
                    className="size-8 rounded-full bg-surface border border-border
                    flex items-center justify-center
                    group-hover:bg-crimson-dark group-hover:border-crimson transition-colors duration-300"
                  >
                    <svg
                      className="size-4 text-gray-500 group-hover:text-white transition-colors"
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
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </main>
  );
}
