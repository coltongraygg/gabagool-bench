/**
 * JSON parsing for LLM outputs
 *
 * Parsing strategy:
 * 1. Direct JSON.parse
 * 2. Strip markdown + parse
 * 3. jsonrepair + parse
 */

import { jsonrepair } from "jsonrepair";
import { decisionSchema, type Decision } from "./schema";

export type ParseMethod = "direct" | "stripped" | "repaired" | "failed";

export interface ParseResult {
    decision: Decision | null;
    method: ParseMethod;
}

const VALID_ACTIONS: Decision["action"][] = [
    "order_hit",
    "call_sitdown",
    "apply_tax",
    "threaten",
    "bribe",
    "do_nothing",
    "set_up",
];

/** Maps common invalid action strings to valid actions */
const ACTION_ALIASES: Record<string, Decision["action"]> = {
    // Variations of order_hit
    orderhit: "order_hit",
    "order-hit": "order_hit",
    hit: "order_hit",
    kill: "order_hit",
    whack: "order_hit",
    eliminate: "order_hit",
    "let him die": "order_hit",
    "kill him": "order_hit",
    "take him out": "order_hit",

    // Variations of call_sitdown
    callsitdown: "call_sitdown",
    "call-sitdown": "call_sitdown",
    sitdown: "call_sitdown",
    sit_down: "call_sitdown",
    meeting: "call_sitdown",
    negotiate: "call_sitdown",
    talk: "call_sitdown",

    // Variations of apply_tax
    applytax: "apply_tax",
    "apply-tax": "apply_tax",
    tax: "apply_tax",
    tribute: "apply_tax",

    // Variations of threaten
    threat: "threaten",
    intimidate: "threaten",
    warn: "threaten",

    // Variations of bribe
    "pay off": "bribe",
    payoff: "bribe",

    // Variations of do_nothing
    donothing: "do_nothing",
    "do-nothing": "do_nothing",
    nothing: "do_nothing",
    wait: "do_nothing",
    ignore: "do_nothing",

    // Variations of set_up
    setup: "set_up",
    "set-up": "set_up",
    trap: "set_up",
};

/**
 * Normalizes an action string to a valid Decision action.
 * Returns null if the action cannot be normalized.
 */
function normalizeAction(action: unknown): Decision["action"] | null {
    if (typeof action !== "string") return null;

    const cleaned = action.toLowerCase().trim();

    // Direct match
    if (VALID_ACTIONS.includes(cleaned as Decision["action"])) {
        return cleaned as Decision["action"];
    }

    // Alias match
    if (cleaned in ACTION_ALIASES) {
        return ACTION_ALIASES[cleaned];
    }

    // Partial match (for phrases like "I would order_hit")
    for (const validAction of VALID_ACTIONS) {
        if (cleaned.includes(validAction)) {
            return validAction;
        }
    }

    return null;
}

/**
 * Extracts readable text from potentially nested reasoning objects.
 * Models sometimes output structured objects instead of strings.
 */
function flattenReasoning(value: unknown): string {
    if (typeof value === "string") {
        return value.trim();
    }

    if (value == null) {
        return "";
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => flattenReasoning(item))
            .filter(Boolean)
            .join(" ");
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;

        // Check common keys that contain the main reasoning
        const priorityKeys = [
            "text",
            "content",
            "reasoning",
            "explanation",
            "rationale",
            "conclusion",
            "summary",
            "analysis",
        ];

        for (const key of priorityKeys) {
            if (key in obj && typeof obj[key] === "string" && obj[key]) {
                return obj[key] as string;
            }
        }

        // Fall back to extracting all substantial text values
        const texts: string[] = [];
        const extract = (o: unknown): void => {
            if (typeof o === "string" && o.length > 20) {
                texts.push(o);
            } else if (Array.isArray(o)) {
                o.forEach(extract);
            } else if (typeof o === "object" && o !== null) {
                Object.values(o).forEach(extract);
            }
        };

        extract(obj);
        // Take first few chunks, limit total length
        return texts.slice(0, 5).join(" ").slice(0, 2000);
    }

    return String(value);
}

/** Strips markdown code blocks from text */
function stripMarkdown(text: string): string {
    return text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "");
}

/** Finds JSON object boundaries in text */
function extractJsonBounds(text: string): string | null {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
}

/** Validates and normalizes a parsed object into a Decision */
function validateDecision(parsed: unknown): Decision | null {
    if (typeof parsed !== "object" || parsed === null) return null;

    const obj = parsed as Record<string, unknown>;

    // Must have action
    if (!("action" in obj)) return null;

    const action = normalizeAction(obj.action);
    if (!action) return null;

    // Extract reasoning from various possible fields
    let reasoning = "";
    const reasoningFields = ["reasoning", "rationale", "explanation", "reason"];
    for (const field of reasoningFields) {
        if (field in obj && obj[field]) {
            reasoning = flattenReasoning(obj[field]);
            if (reasoning) break;
        }
    }

    // Validate with schema
    const result = decisionSchema.safeParse({
        action,
        reasoning: reasoning || "No reasoning provided.",
    });

    return result.success ? result.data : null;
}

export function parseModelOutput(text: string): ParseResult {
    try {
        const parsed = JSON.parse(text.trim());
        const decision = validateDecision(parsed);
        if (decision) {
            console.log(`[PARSE] direct - raw JSON parsed successfully`);
            return { decision, method: "direct" };
        }
    } catch {
        // Continue to next strategy
    }

    const stripped = stripMarkdown(text).trim();
    const jsonStr = extractJsonBounds(stripped);

    if (jsonStr) {
        try {
            const parsed = JSON.parse(jsonStr);
            const decision = validateDecision(parsed);
            if (decision) {
                console.log(`[PARSE] stripped - needed markdown stripping`);
                return { decision, method: "stripped" };
            }
        } catch {
            // Continue to next strategy
        }

        try {
            const repaired = jsonrepair(jsonStr);
            const parsed = JSON.parse(repaired);
            const decision = validateDecision(parsed);
            if (decision) {
                console.log(`[PARSE] repaired - needed jsonrepair library`);
                return { decision, method: "repaired" };
            }
        } catch {
            // Continue to next strategy
        }
    }

    console.log(`[PARSE] failed - could not parse: ${text.slice(0, 200)}...`);
    return { decision: null, method: "failed" };
}
