/**
 * Find malformed outputs that failed JSON parsing
 * Usage: bun scripts/find-malformed-outputs.ts [results-dir]
 */

import * as fs from "fs";
import * as path from "path";

interface TestResult {
    scenario_id: string;
    model: string;
    decision?: {
        action: string;
        reasoning: string;
    };
    duration_ms: number;
    cost: number;
    tokens: number;
    timestamp: string;
    error?: string;
    rawText?: string;
    repaired?: boolean;
}

function findLatestResults(resultsDir: string): string | null {
    const dirs = fs.readdirSync(resultsDir)
        .filter(d => fs.statSync(path.join(resultsDir, d)).isDirectory())
        .filter(d => d.match(/^\d{4}-\d{2}-\d{2}T/))
        .sort()
        .reverse();

    return dirs.length > 0 ? path.join(resultsDir, dirs[0]) : null;
}

function analyzeResults(resultsPath: string) {
    const rawResultsPath = path.join(resultsPath, "raw-results.json");

    if (!fs.existsSync(rawResultsPath)) {
        console.error("raw-results.json not found at:", rawResultsPath);
        process.exit(1);
    }

    const data: TestResult[] = JSON.parse(fs.readFileSync(rawResultsPath, "utf8"));

    console.log("=".repeat(80));
    console.log("MALFORMED OUTPUT ANALYSIS");
    console.log("Results from:", resultsPath);
    console.log("Total results:", data.length);
    console.log("=".repeat(80));

    // Find repaired outputs (fallback extraction was used)
    const repaired = data.filter(r => r.repaired);
    console.log("\n\n📦 REPAIRED OUTPUTS (fallback extraction used):", repaired.length);
    console.log("-".repeat(80));

    repaired.forEach(r => {
        console.log(`\nModel: ${r.model}`);
        console.log(`Scenario: ${r.scenario_id}`);
        console.log(`Extracted action: ${r.decision?.action || "NONE"}`);
        console.log(`Reasoning preview: ${r.decision?.reasoning?.substring(0, 150) || "NONE"}...`);
        if (r.rawText) {
            console.log(`\nRaw text (first 400 chars):`);
            console.log(r.rawText.substring(0, 400));
        }
        console.log("-".repeat(40));
    });

    // Find completely failed outputs (no decision at all)
    const failed = data.filter(r => !r.decision && !r.error);
    console.log("\n\n❌ FAILED TO PARSE (no decision extracted):", failed.length);
    console.log("-".repeat(80));

    failed.forEach(r => {
        console.log(`\nModel: ${r.model}`);
        console.log(`Scenario: ${r.scenario_id}`);
        if (r.rawText) {
            console.log(`\nRaw text (first 800 chars):`);
            console.log(r.rawText.substring(0, 800));
        } else {
            console.log("No raw text saved (structured output may have failed before fallback)");
        }
        console.log("-".repeat(40));
    });

    // Find API errors
    const errors = data.filter(r => r.error);
    console.log("\n\n⚠️ API ERRORS (timeouts, network issues):", errors.length);
    console.log("-".repeat(80));

    errors.forEach(r => {
        console.log(`${r.model} -> ${r.scenario_id}: ${r.error}`);
    });

    // Summary
    console.log("\n\n" + "=".repeat(80));
    console.log("SUMMARY");
    console.log("=".repeat(80));
    console.log(`Total results: ${data.length}`);
    console.log(`Successful (direct): ${data.length - repaired.length - failed.length - errors.length}`);
    console.log(`Repaired (fallback): ${repaired.length}`);
    console.log(`Failed to parse: ${failed.length}`);
    console.log(`API errors: ${errors.length}`);

    // Group failures by model
    const failuresByModel = new Map<string, number>();
    [...failed, ...errors].forEach(r => {
        failuresByModel.set(r.model, (failuresByModel.get(r.model) || 0) + 1);
    });

    if (failuresByModel.size > 0) {
        console.log("\nFailures by model:");
        Array.from(failuresByModel.entries())
            .sort((a, b) => b[1] - a[1])
            .forEach(([model, count]) => {
                console.log(`  ${model}: ${count}`);
            });
    }
}

// Main
const resultsDir = process.argv[2] || path.join(process.cwd(), "results");
const targetPath = process.argv[2] && fs.statSync(process.argv[2]).isDirectory() && process.argv[2].includes("T")
    ? process.argv[2]
    : findLatestResults(resultsDir);

if (!targetPath) {
    console.error("No results found in:", resultsDir);
    process.exit(1);
}

analyzeResults(targetPath);
