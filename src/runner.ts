import { generateText, Output } from "ai";
import { decisionSchema, type Decision } from "./schema";
import { parseModelOutput, type ParseMethod } from "./json-parser";

import { models } from "./models";
import type { Scenario, TestResult } from "./types";

// OpenRouter provider metadata shape (not exported by the SDK)
interface OpenRouterMetadata {
    usage?: {
        cost?: number;
        totalTokens?: number;
        promptTokens?: number;
        completionTokens?: number;
    };
}

const CONCURRENCY = 15;
const STAGGER_DELAY_MS = 150;

/** Extracts token count and cost from API result */
function extractUsage(result: { usage?: { totalTokens?: number }; providerMetadata?: unknown }) {
    const tokens = result.usage?.totalTokens || 0;
    const meta = (result.providerMetadata as any)?.openrouter as OpenRouterMetadata | undefined;
    const cost = meta?.usage?.cost || 0;
    return { tokens, cost };
}

export async function runScenario(
    scenario: Scenario,
    modelConfig: typeof models[number]
): Promise<TestResult> {
    const start = Date.now();

    // Build the prompt with context, stakes, and the decision prompt
    const promptParts = [
        scenario.context,
        scenario.stakes ? `Stakes: ${scenario.stakes}` : null,
        scenario.prompt,
    ].filter(Boolean).join("\n\n");

    let cost = 0;
    let tokens = 0;
    let decision: Decision | undefined;
    let parseMethod: ParseMethod | "structured" = "structured";
    let rawText: string | undefined;

    try {
        // Try structured output first
        const result = await generateText({
            model: modelConfig.llm,
            system: scenario.system_prompt,
            prompt: promptParts,
            output: Output.object({
                schema: decisionSchema,
            }),
            maxRetries: 8,
            maxTokens: 4096,
        } as any);

        decision = result.output as unknown as Decision;
        ({ tokens, cost } = extractUsage(result));

        if (result.finishReason === 'length') {
            console.warn(`[WARN] ${modelConfig.name} truncated on ${scenario.id} (finishReason: length)`);
        }
    } catch (err) {
        // Try to recover from parsing errors by extracting raw text, or fallback to plain text API call
        const errMsg = err instanceof Error ? err.message : String(err);
        const errName = err instanceof Error ? err.name : '';

        // Only fallback on parsing/validation errors, not server/network errors
        const isParsingError =
            errName.includes('Parse') ||
            errName.includes('Validation') ||
            errMsg.toLowerCase().includes('parse') ||
            errMsg.toLowerCase().includes('schema') ||
            errMsg.toLowerCase().includes('json');

        if (!isParsingError) {
            console.log(`[ERROR] ${modelConfig.name} -> ${scenario.id}: ${errMsg.slice(0, 100)}`);
            throw err;
        }

        // Check if SDK error contains raw text we can parse (avoid 2nd API call)
        const errAny = err as Record<string, unknown>;
        const rawFromError = errAny.text ?? (errAny.cause as Record<string, unknown>)?.text;

        if (typeof rawFromError === 'string' && rawFromError.length > 0) {
            console.log(`[RECOVER] ${modelConfig.name} -> ${scenario.id}: found raw text in error, parsing...`);
            const parsed = parseModelOutput(rawFromError);
            if (parsed.decision) {
                decision = parsed.decision;
                parseMethod = parsed.method;
                rawText = rawFromError;
                console.log(`[FIX] ${modelConfig.name} -> ${scenario.id}: ${parseMethod}`);
                // cost and tokens stay 0 - we recovered from error, no real API response
            } else {
                console.log(`[RECOVER-FAIL] Could not parse. Method: ${parsed.method}. Raw:\n${rawFromError}`);
            }
        }

        // Only make 2nd API call if we couldn't recover from error
        if (!decision) {
            console.log(`[FALLBACK] ${modelConfig.name} -> ${scenario.id}: ${errName || 'parse error'} - making 2nd API call`);
            const result = await generateText({
                model: modelConfig.llm,
                system: scenario.system_prompt,
                prompt: promptParts,
                maxRetries: 2,
                maxTokens: 4096,
            } as any);

            ({ tokens, cost } = extractUsage(result));
            rawText = result.text;

            if (result.finishReason === 'length') {
                console.warn(`[WARN] ${modelConfig.name} truncated on ${scenario.id} (finishReason: length)`);
            }

            const parsed = parseModelOutput(result.text);
            decision = parsed.decision ?? undefined;
            parseMethod = parsed.method;

            if (decision) {
                console.log(`[FIX] ${modelConfig.name} -> ${scenario.id}: ${parseMethod}`);
            }
        }
    }

    const duration = Date.now() - start;
    const needsRepair = parseMethod !== "structured";

    return {
        scenario_id: scenario.id,
        model: modelConfig.name,
        decision,
        duration_ms: duration,
        cost,
        tokens,
        timestamp: new Date().toISOString(),
        ...(needsRepair && { repaired: true, parseMethod, rawText }),
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
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn(`[ERR] ${job.model.name} -> ${job.scenario.id}: ERROR`);

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
