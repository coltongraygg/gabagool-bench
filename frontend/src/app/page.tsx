import { promises as fs } from "fs";
import path from "path";
import ModelResults from "@/components/ModelResults";
import { ModelFingerprint } from "@/lib/types";

export default async function Home() {
  const publicDir = path.join(process.cwd(), "public");

  // Load fingerprints at build time
  const fingerprints = await fs.readFile(
    path.join(publicDir, "fingerprints.json"),
    "utf-8"
  ).then((data) => JSON.parse(data) as ModelFingerprint[]);

  return <ModelResults fingerprints={fingerprints} />;
}
