import { promises as fs } from "fs";
import path from "path";
import ScenarioShowcase from "@/components/ScenarioShowcase";
import { Scenario, SCENARIO_NAMES } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Scenarios | Gabagool Bench",
  description:
    "16 moral dilemmas from The Sopranos. Each scenario forces a choice between loyalty, violence, diplomacy, and survival. No right answers. Only consequences.",
  openGraph: {
    title: "The Scenarios | Gabagool Bench",
    description:
      "16 moral dilemmas from The Sopranos that test every AI model.",
  },
};

export default async function ScenariosPage() {
  const publicDir = path.join(process.cwd(), "public");
  const scenarioIds = Object.keys(SCENARIO_NAMES);

  const scenarios = await Promise.all(
    scenarioIds.map(async (id) => {
      try {
        const data = await fs.readFile(
          path.join(publicDir, "scenarios", `${id}.json`),
          "utf-8"
        );
        return JSON.parse(data) as Scenario;
      } catch {
        return null;
      }
    })
  );

  const validScenarios = scenarios.filter(
    (s): s is Scenario => s !== null
  );

  return <ScenarioShowcase scenarios={validScenarios} />;
}
