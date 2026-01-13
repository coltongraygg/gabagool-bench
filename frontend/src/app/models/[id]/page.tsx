import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { ModelFingerprint, ScenarioResult, Scenario, getMobNickname, computeTonyRankings } from "@/lib/types";
import ModelDetail from "@/components/ModelDetail";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

function decodeModelId(encodedId: string): string {
  return decodeURIComponent(encodedId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const modelName = decodeModelId(id);
  const publicDir = path.join(process.cwd(), "public");

  try {
    const data = await fs.readFile(
      path.join(publicDir, "fingerprints.json"),
      "utf-8"
    );
    const fingerprints = JSON.parse(data) as ModelFingerprint[];
    const fingerprint = fingerprints.find((fp) => fp.model === modelName);

    if (!fingerprint) throw new Error("Not found");

    const tonyRankings = computeTonyRankings(fingerprints);
    const nickname = getMobNickname(fingerprint, tonyRankings.get(modelName));
    const violencePercent = Math.round(fingerprint.violence_rate * 100);

    return {
      title: `${fingerprint.model} - ${nickname.name} | Gabagool Bench`,
      description: `${nickname.title}. ${violencePercent}% violence rate across ${fingerprint.total_scenarios} scenarios.`,
      openGraph: {
        title: `${fingerprint.model} | Gabagool Bench`,
        description: `${nickname.name}: ${nickname.title}`,
      },
    };
  } catch {
    return {
      title: "Model | Gabagool Bench",
    };
  }
}

export async function generateStaticParams() {
  const publicDir = path.join(process.cwd(), "public");
  const data = await fs.readFile(
    path.join(publicDir, "fingerprints.json"),
    "utf-8"
  );
  const fingerprints = JSON.parse(data) as ModelFingerprint[];

  return fingerprints.map((fp) => ({
    id: encodeURIComponent(fp.model),
  }));
}

export default async function ModelPage({ params }: Props) {
  const { id } = await params;
  const modelName = decodeModelId(id);
  const publicDir = path.join(process.cwd(), "public");

  try {
    const [fingerprintsData, resultsData, scenarioFiles] = await Promise.all([
      fs.readFile(path.join(publicDir, "fingerprints.json"), "utf-8"),
      fs.readFile(path.join(publicDir, "raw-results.json"), "utf-8"),
      fs.readdir(path.join(publicDir, "scenarios")),
    ]);

    const fingerprints = JSON.parse(fingerprintsData) as ModelFingerprint[];
    const allResults = JSON.parse(resultsData) as ScenarioResult[];

    const fingerprint = fingerprints.find((fp) => fp.model === modelName);
    if (!fingerprint) notFound();

    const tonyRankings = computeTonyRankings(fingerprints);
    const tonyRanking = tonyRankings.get(modelName);

    const results = allResults.filter((r) => r.model === modelName);

    // Load all scenarios
    const scenarios: Record<string, Scenario> = {};
    for (const file of scenarioFiles) {
      if (!file.endsWith(".json")) continue;
      const data = await fs.readFile(
        path.join(publicDir, "scenarios", file),
        "utf-8"
      );
      const scenario = JSON.parse(data) as Scenario;
      scenarios[scenario.id] = scenario;
    }

    return (
      <ModelDetail
        fingerprint={fingerprint}
        results={results}
        scenarios={scenarios}
        tonyRanking={tonyRanking}
      />
    );
  } catch (error) {
    console.error("Failed to load model:", modelName, error);
    notFound();
  }
}
