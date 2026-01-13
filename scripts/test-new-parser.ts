/**
 * Test the new json-parser against previously failed/repaired outputs
 *
 * Usage: bun scripts/test-new-parser.ts
 */

import * as fs from "fs";
import * as path from "path";
import { parseModelOutput, type ParseResult } from "../src/json-parser";

interface StoredResult {
    scenario_id: string;
    model: string;
    decision?: { action: string; reasoning: string };
    rawText?: string;
}

interface ParsedResult {
    stored: StoredResult;
    parsed: ParseResult;
    wasFixed: boolean;
}

function findLatestResults(): string | null {
    const resultsDir = path.join(process.cwd(), "results");
    const dirs = fs.readdirSync(resultsDir)
        .filter(d => fs.statSync(path.join(resultsDir, d)).isDirectory())
        .filter(d => d.match(/^\d{4}-\d{2}-\d{2}T/))
        .sort()
        .reverse();

    return dirs.length > 0 ? path.join(resultsDir, dirs[0]) : null;
}

function main() {
    const targetPath = findLatestResults();
    if (!targetPath) {
        console.error("No results found");
        process.exit(1);
    }

    const rawResultsPath = path.join(targetPath, "raw-results.json");
    const data: StoredResult[] = JSON.parse(fs.readFileSync(rawResultsPath, "utf8"));

    // Parse all results with rawText (these needed repair or failed)
    const results: ParsedResult[] = data
        .filter(r => r.rawText)
        .map(stored => {
            const parsed = parseModelOutput(stored.rawText!);
            return {
                stored,
                parsed,
                wasFixed: !stored.decision && !!parsed.decision,
            };
        });

    // Count by method
    const methodCounts = results.reduce((acc, r) => {
        acc[r.parsed.method] = (acc[r.parsed.method] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const failed = results.filter(r => r.parsed.method === "failed");
    const fixed = results.filter(r => r.wasFixed);

    // Output
    console.log("=".repeat(80));
    console.log("NEW PARSER TEST");
    console.log("Testing against:", targetPath);
    console.log(`Total: ${data.length} | With rawText: ${results.length}`);
    console.log("=".repeat(80));

    console.log("\nPARSE METHOD DISTRIBUTION:");
    console.log(`  direct: ${methodCounts.direct || 0} | stripped: ${methodCounts.stripped || 0} | repaired: ${methodCounts.repaired || 0} | regex: ${methodCounts.regex || 0} | failed: ${methodCounts.failed || 0}`);

    console.log("\nALL REPAIRED OUTPUTS:");
    console.log("-".repeat(80));
    for (const { stored, parsed } of results) {
        if (parsed.decision) {
            console.log(`\n${stored.model} -> ${stored.scenario_id}`);
            console.log(`Method: ${parsed.method} | Action: ${parsed.decision.action}`);
            console.log(`Reasoning (${parsed.decision.reasoning.length} chars):\n${parsed.decision.reasoning}`);
        }
    }

    if (fixed.length > 0) {
        console.log("\nNEWLY FIXED:", fixed.length);
        for (const { stored, parsed } of fixed) {
            console.log(`  ${stored.model} -> ${stored.scenario_id} [${parsed.method}] -> ${parsed.decision?.action}`);
        }
    }

    if (failed.length > 0) {
        console.log("\nSTILL FAILED:", failed.length);
        for (const { stored } of failed) {
            console.log(`  ${stored.model} -> ${stored.scenario_id}`);
            console.log(`    ${stored.rawText?.substring(0, 200)}...`);
        }
    }

    console.log("\n" + "=".repeat(80));
    console.log(`SUMMARY: ${results.length} tested | ${((results.length - failed.length) / results.length * 100).toFixed(1)}% success | ${fixed.length} newly fixed | ${failed.length} failed`);
}

main();
