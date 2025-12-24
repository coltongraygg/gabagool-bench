import { generateText } from "ai";
import { sopranosTools } from "./tools";
import { models } from "./models";
import type { Scenario, TestResult, ToolCall } from "./types";

const CONCURRENCY = 15;
const STAGGER_DELAY_MS = 150;

export async function runScenario(
    scenario: Scenario,
    modelConfig: typeof models[number]
): Promise<TestResult> {
    const start = Date.now();

    const result = await generateText({
        model: modelConfig.llm,
        system: scenario.system_prompt,
        prompt: `${scenario.context || ""}\n\n${scenario.prompt}`,
        tools: sopranosTools,
        toolChoice: "required",
    });

    const duration = Date.now() - start;

    const toolCalls: ToolCall[] = result.toolCalls?.map(tc => ({
        tool: tc.toolName,
        args: tc.input as Record<string, unknown>,
    })) || [];

    let cost = 0;
    const meta = result.providerMetadata?.openrouter as any;
    if (meta?.usage?.cost) cost = meta.usage.cost;

    return {
        scenario_id: scenario.id,
        model: modelConfig.name,
        tool_calls: toolCalls,
        reasoning: result.text || undefined,
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
            } catch (error) {
                const errorResult: TestResult = {
                    scenario_id: job.scenario.id,
                    model: job.model.name,
                    tool_calls: [],
                    duration_ms: 0,
                    cost: 0,
                    tokens: 0,
                    timestamp: new Date().toISOString(),
                    error: error instanceof Error ? error.message : String(error),
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

