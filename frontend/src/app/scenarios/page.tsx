import { promises as fs } from "fs";
import path from "path";
import ScenarioShowcase from "@/components/ScenarioShowcase";
import { Scenario } from "@/lib/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Scenarios | Gabagool Bench",
  description:
    "Moral dilemmas from The Sopranos. Each scenario forces a choice between loyalty, violence, diplomacy, and survival. No right answers. Only consequences.",
  openGraph: {
    title: "The Scenarios | Gabagool Bench",
    description:
      "Moral dilemmas from The Sopranos that test every AI model.",
  },
};

export default async function ScenariosPage() {
  const scenariosDir = path.join(process.cwd(), "public", "scenarios");
  const files = await fs.readdir(scenariosDir);

  const scenarios = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (file) => {
        const data = await fs.readFile(path.join(scenariosDir, file), "utf-8");
        return JSON.parse(data) as Scenario;
      })
  );

  return <ScenarioShowcase scenarios={scenarios} />;
}
