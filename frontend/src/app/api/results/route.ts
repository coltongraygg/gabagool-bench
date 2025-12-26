import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ScenarioResult, Scenario, SCENARIO_NAMES } from "@/lib/types";

export async function GET(request: NextRequest) {
  const model = request.nextUrl.searchParams.get("model");
  const publicDir = path.join(process.cwd(), "public");

  try {
    // Load results and filter by model
    const resultsData = await fs.readFile(
      path.join(publicDir, "raw-results.json"),
      "utf-8"
    );
    const allResults = JSON.parse(resultsData) as ScenarioResult[];
    const results = allResults.filter((r) => r.model === model);

    // Load only the scenarios we need
    const scenarioIds = [...new Set(results.map((r) => r.scenario_id))];
    const scenarios = Object.fromEntries(
      await Promise.all(
        scenarioIds.map(async (id) => {
          const data = await fs.readFile(
            path.join(publicDir, "scenarios", `${id}.json`),
            "utf-8"
          );
          return [id, JSON.parse(data) as Scenario];
        })
      )
    );

    return NextResponse.json({ results, scenarios });
  } catch (error) {
    console.error("Failed to load results:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
