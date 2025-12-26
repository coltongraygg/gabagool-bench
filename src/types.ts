import { type LanguageModel } from "ai";
import { type Decision } from "./schema";

export type Scenario = {
    id: string;
    name: string;
    description: string;
    system_prompt: string;
    prompt: string;
    context?: string;
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
};

export type ModelConfig = {
    name: string;
    llm: LanguageModel;      // model instance from openrouter()
    reasoning?: boolean;
};
