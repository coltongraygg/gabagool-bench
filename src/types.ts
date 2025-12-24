import { type LanguageModel } from "ai";

export type Scenario = {
    id: string;
    name: string;
    description: string;
    system_prompt: string;
    prompt: string;
    context?: string;  
};

export type ToolCall = {
    tool: string;
    args: Record<string, unknown>;
};

export type TestResult = {
    scenario_id: string;
    model: string;
    tool_calls: ToolCall[];
    reasoning?: string;      
    duration_ms: number;
    cost: number;
    tokens: number;
    timestamp: string;
};

export type ModelConfig = {
    name: string;            
    llm: LanguageModel;      // model instance from openrouter()
    reasoning?: boolean;     
};
