import { openrouter } from "@openrouter/ai-sdk-provider";
import type { ModelConfig } from "./types";


// Include "usage" so we can log cost
const defaultProviderOptions = {
    usage: {
        include: true,
    },
};

export const models: ModelConfig[] = [


    {
        name: "kimi-k2-thinking",
        llm: openrouter("moonshotai/kimi-k2-thinking", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "kimi-k2",
        llm: openrouter("moonshotai/kimi-k2", defaultProviderOptions),
    },
    {
        name: "qwen-3-32b",
        llm: openrouter("qwen/qwen3-32b", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "glm-4.5",
        llm: openrouter("z-ai/glm-4.5", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "glm-4.5v",
        llm: openrouter("z-ai/glm-4.5v", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "qwen3-235b-a22b-thinking",
        llm: openrouter(
            "qwen/qwen3-235b-a22b-thinking-2507",
            defaultProviderOptions
        ),
        reasoning: true,
    },
    {
        name: "deepseek-r1-0528",
        llm: openrouter("deepseek/deepseek-r1-0528", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "deepseek-v3.1",
        llm: openrouter("deepseek/deepseek-chat-v3.1", defaultProviderOptions),
    },
    {
        name: "deepseek-v3.1-thinking",
        llm: openrouter("deepseek/deepseek-chat-v3.1", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "deepseek-v3.2",
        llm: openrouter("deepseek/deepseek-v3.2", defaultProviderOptions),
        reasoning: false,
    },
    {
        name: "deepseek-v3.2-thinking-high",
        llm: openrouter("deepseek/deepseek-v3.2", {
            ...defaultProviderOptions,
            reasoning: { effort: "high" },
        }),
        reasoning: true,
    },


    {
        name: "grok-4",
        llm: openrouter("x-ai/grok-4", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "grok-4.1-fast",
        llm: openrouter("x-ai/grok-4.1-fast", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "grok-3-mini",
        llm: openrouter("x-ai/grok-3-mini-beta", defaultProviderOptions),
        reasoning: true,
    },


    {
        name: "gemini-3-pro-preview",
        llm: openrouter("google/gemini-3-pro-preview", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gemini-2.5-pro",
        llm: openrouter("google/gemini-2.5-pro-preview", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gemini-2.5-flash",
        llm: openrouter("google/gemini-2.5-flash", defaultProviderOptions),
    },

    {
        name: "claude-4-sonnet",
        llm: openrouter("anthropic/claude-sonnet-4", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "claude-4-sonnet-non-thinking",
        llm: openrouter("anthropic/claude-sonnet-4", defaultProviderOptions),
        reasoning: false,
    },
    {
        name: "claude-4-opus",
        llm: openrouter("anthropic/claude-opus-4", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "claude-4.5-opus",
        llm: openrouter("anthropic/claude-opus-4.5", defaultProviderOptions),
    },
    {
        name: "claude-4.5-opus-thinking-high",
        llm: openrouter("anthropic/claude-opus-4.5", {
            ...defaultProviderOptions,
            reasoning: { effort: "high" },
        }),
        reasoning: true,
    },
    {
        name: "claude-4.5-sonnet",
        llm: openrouter("anthropic/claude-sonnet-4.5", defaultProviderOptions),
        reasoning: true,
    },


    {
        name: "o4-mini",
        llm: openrouter("openai/o4-mini", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "o3",
        llm: openrouter("openai/o3", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gpt-4.1",
        llm: openrouter("openai/gpt-4.1", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gpt-4o",
        llm: openrouter("openai/gpt-4o", defaultProviderOptions),
        reasoning: true,
    },

    {
        name: "gpt-5-minimal",
        llm: openrouter("openai/gpt-5", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "minimal" as any,
            },
        }),
        reasoning: true,
    },
    {
        name: "gpt-5-default",
        llm: openrouter("openai/gpt-5", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gpt-5-high",
        llm: openrouter("openai/gpt-5", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "high",
            },
        }),
        reasoning: true,
    },
    {
        name: "gpt-5-mini",
        llm: openrouter("openai/gpt-5-mini", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gpt-5-nano",
        llm: openrouter("openai/gpt-5-nano", defaultProviderOptions),
        reasoning: true,
    },

    {
        name: "gpt-5.1-low",
        llm: openrouter("openai/gpt-5.1", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "low",
            },
        }),
        reasoning: true,
    },
    {
        name: "gpt-5.1-default",
        llm: openrouter("openai/gpt-5.1", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "gpt-5.1-high",
        llm: openrouter("openai/gpt-5.1", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "high",
            },
        }),
        reasoning: true,
    },

    {
        name: "gpt-5.2-none",
        llm: openrouter("openai/gpt-5.2", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "none" as any,
            },
        }),
    },
    {
        name: "gpt-5.2-high",
        llm: openrouter("openai/gpt-5.2", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "high",
            },
        }),
        reasoning: true,
    },
    {
        name: "gpt-5.2-xhigh",
        llm: openrouter("openai/gpt-5.2", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "xhigh" as any,
            },
        }),
        reasoning: true,
    },
    {
        name: "gpt-5.2-pro",
        llm: openrouter("openai/gpt-5.2-pro", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "high",
            },
        }),
        reasoning: true,
    },
    {
        name: "gemini-3-flash-high",
        llm: openrouter("google/gemini-3-flash-preview", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "high",
            },
        }),
        reasoning: true,
    },
    {
        name: "gemini-3-flash-low",
        llm: openrouter("google/gemini-3-flash-preview", {
            ...defaultProviderOptions,
            reasoning: {
                effort: "low",
            },
        }),
        reasoning: true,
    },

    {
        name: "glm-4.6",
        llm: openrouter("z-ai/glm-4.6", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "grok-code-fast-1",
        llm: openrouter("x-ai/grok-code-fast-1", defaultProviderOptions),
    },
    {
        name: "llama-4-maverick",
        llm: openrouter("meta-llama/llama-4-maverick", defaultProviderOptions),
    },
    {
        name: "llama-4-scout",
        llm: openrouter("meta-llama/llama-4-scout", defaultProviderOptions),
    },

    {
        name: "seed-1.6-flash",
        llm: openrouter("bytedance-seed/seed-1.6-flash", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "glm-4.7",
        llm: openrouter("z-ai/glm-4.7", defaultProviderOptions),
        reasoning: true,
    },
    {
        name: "mistral-small-creative",
        llm: openrouter("mistralai/mistral-small-creative", defaultProviderOptions),
    },
    {
        name: "olmo-3.1-32b-think",
        llm: openrouter("allenai/olmo-3.1-32b-think:free", defaultProviderOptions),
        reasoning: true,
    },

]

