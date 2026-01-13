import { type LanguageModel } from "ai";
import { type Decision } from "./schema";
import { type ParseMethod } from "./json-parser";

export type Scenario = {
    id: string;
    name: string;
    description: string;
    system_prompt: string;
    prompt: string;
    context?: string;
    stakes?: string;
    canonical?: { action: string };
};

export type TestResult = {
    scenario_id: string;
    model: string;
    decision?: Decision;
    duration_ms: number;
    cost: number;
    tokens: number;
    timestamp: string;
    error?: string;
    rawText?: string;      // original model output when fallback extraction was used
    repaired?: boolean;    // true if structured output failed and fallback was used
    parseMethod?: ParseMethod | "structured";  // which parsing strategy succeeded
};

export type ModelConfig = {
    name: string;
    llm: LanguageModel;      // model instance from openrouter()
    reasoning?: boolean;
};
