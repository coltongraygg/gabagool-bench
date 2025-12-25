import { promises as fs } from "fs";
import path from "path";
import ModelResults from "@/components/ModelResults";
import { ModelFingerprint, ScenarioResult, Scenario, SCENARIO_NAMES } from "@/lib/types";

// Force dynamic to always get fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
  const publicDir = path.join(process.cwd(), "public");

  // Read all data from filesystem
  const [fingerprints, rawResults] = await Promise.all([
    fs.readFile(path.join(publicDir, "fingerprints.json"), "utf-8").then(
      (data) => JSON.parse(data) as ModelFingerprint[]
    ),
    fs.readFile(path.join(publicDir, "raw-results.json"), "utf-8").then(
      (data) => JSON.parse(data) as ScenarioResult[]
    ),
  ]);

  // Load all scenarios in parallel
  const scenarioIds = Object.keys(SCENARIO_NAMES);
  const scenarioEntries = await Promise.all(
    scenarioIds.map(async (id) => {
      const data = await fs.readFile(
        path.join(publicDir, "scenarios", `${id}.json`),
        "utf-8"
      );
      return [id, JSON.parse(data) as Scenario] as const;
    })
  );
  const scenarios: Record<string, Scenario> = Object.fromEntries(scenarioEntries);

  return (
    <ModelResults
      fingerprints={fingerprints}
      rawResults={rawResults}
      scenarios={scenarios}
    />
  );
}
