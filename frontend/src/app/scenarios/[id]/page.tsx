import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Scenario, ScenarioResult, SCENARIO_NAMES } from "@/lib/types";
import ScenarioDetail from "@/components/ScenarioDetail";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const publicDir = path.join(process.cwd(), "public");

  try {
    const data = await fs.readFile(
      path.join(publicDir, "scenarios", `${id}.json`),
      "utf-8"
    );
    const scenario = JSON.parse(data) as Scenario;

    return {
      title: `${scenario.name} | Gabagool Bench`,
      description: scenario.description,
      openGraph: {
        title: `${scenario.name} | Gabagool Bench`,
        description: scenario.description,
      },
    };
  } catch {
    return {
      title: "Scenario | Gabagool Bench",
    };
  }
}

export async function generateStaticParams() {
  return Object.keys(SCENARIO_NAMES).map((id) => ({ id }));
}

export default async function ScenarioPage({ params }: Props) {
  const { id } = await params;
  const publicDir = path.join(process.cwd(), "public");

  try {
    const [scenarioData, resultsData] = await Promise.all([
      fs.readFile(path.join(publicDir, "scenarios", `${id}.json`), "utf-8"),
      fs.readFile(path.join(publicDir, "raw-results.json"), "utf-8"),
    ]);

    const scenario = JSON.parse(scenarioData) as Scenario;
    const allResults = JSON.parse(resultsData) as ScenarioResult[];
    const results = allResults.filter((r) => r.scenario_id === id);

    return <ScenarioDetail scenario={scenario} results={results} />;
  } catch (error) {
    console.error("Failed to load scenario:", id, error);
    notFound();
  }
}
