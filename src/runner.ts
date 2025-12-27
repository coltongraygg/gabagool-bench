import { generateObject } from "ai";
import { decisionSchema, type Decision } from "./schema";
import { models } from "./models";
import type { Scenario, TestResult } from "./types";

const CONCURRENCY = 15;
const STAGGER_DELAY_MS = 150;

export async function runScenario(
    scenario: Scenario,
    modelConfig: typeof models[number]
): Promise<TestResult> {
    const start = Date.now();

    const result = await generateObject({
        model: modelConfig.llm,
        system: scenario.system_prompt,
        prompt: `${scenario.context || ""}\n\n${scenario.prompt}`,
        schema: decisionSchema,
    });

    const duration = Date.now() - start;

    // Log warning if truncated
    if (result.finishReason === 'length') {
        console.warn(`⚠️  ${modelConfig.name} truncated on ${scenario.id} (finishReason: length)`);
    }

    let cost = 0;
    const meta = result.providerMetadata?.openrouter as any;
    if (meta?.usage?.cost) cost = meta.usage.cost;

    return {
        scenario_id: scenario.id,
        model: modelConfig.name,
        decision: result.object,
        duration_ms: duration,
        cost,
        tokens: result.usage?.totalTokens || 0,
        timestamp: new Date().toISOString(),
    };
}

export async function runAllScenarios(
    scenarios: Scenario[],
    onProgress?: (completed: number, total: number, result: TestResult) => void
): Promise<TestResult[]> {
    const jobs: Array<{ scenario: Scenario; model: typeof models[number] }> = [];

    for (const scenario of scenarios) {
        for (const model of models) {
            jobs.push({ scenario, model });
        }
    }

    const results: TestResult[] = [];
    let completed = 0;

    async function worker() {
        while (jobs.length > 0) {
            const job = jobs.shift();
            if (!job) break;

            try {
                const result = await runScenario(job.scenario, job.model);
                results.push(result);
                completed++;
                onProgress?.(completed, jobs.length + completed, result);
            } catch (error: any) {
                // Extract detailed error info
                const errorMessage = error?.message || String(error);
                const errorCause = error?.cause;
                const errorData = error?.data || error?.response?.data;
                const errorStatus = error?.status || error?.response?.status;

                console.warn(`❌ ${job.model.name} failed on ${job.scenario.id}: ${errorMessage}`);

                // Log full error details for debugging
                if (errorCause) console.warn(`   Cause: ${JSON.stringify(errorCause)}`);
                if (errorData) console.warn(`   Data: ${JSON.stringify(errorData)}`);
                if (errorStatus) console.warn(`   Status: ${errorStatus}`);
                if (error?.text) console.warn(`   Response text: ${error.text}`);

                // Log the raw error for really stubborn cases
                const errorKeys = Object.keys(error || {}).filter(k => !['message', 'stack'].includes(k));
                if (errorKeys.length > 0) {
                    console.warn(`   Error keys: ${errorKeys.join(', ')}`);
                }

                const errorResult: TestResult = {
                    scenario_id: job.scenario.id,
                    model: job.model.name,
                    duration_ms: 0,
                    cost: 0,
                    tokens: 0,
                    timestamp: new Date().toISOString(),
                    error: errorMessage,
                };
                results.push(errorResult);
                completed++;
                onProgress?.(completed, jobs.length + completed, errorResult);
            }
        }
    }

    // Spawn workers with staggered starts to avoid thundering herd
    const workerCount = Math.min(CONCURRENCY, jobs.length);
    const workers = Array.from({ length: workerCount }, (_, i) =>
        new Promise<void>((resolve) =>
            setTimeout(() => resolve(), i * STAGGER_DELAY_MS)
        ).then(() => worker())
    );

    await Promise.all(workers);
    return results;
}

