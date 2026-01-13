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

function normalizeAction(action: unknown): Decision["action"] | null {
    if (typeof action !== "string") return null;
    const cleaned = action.toLowerCase().trim();
    return VALID_ACTIONS.includes(cleaned as Decision["action"])
        ? (cleaned as Decision["action"])
        : null;
}

/** Extracts text from nested reasoning objects (some models output complex structures) */
function flattenReasoning(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (value == null) return "";

    // Recursively extract all substantial text from nested structures
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

    extract(value);
    return texts.slice(0, 5).join(" ").slice(0, 2000);
}

function stripMarkdown(text: string): string {
    return text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "");
}

function extractJsonBounds(text: string): string | null {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
}

function validateDecision(parsed: unknown): Decision | null {
    if (typeof parsed !== "object" || parsed === null) return null;

    const obj = parsed as Record<string, unknown>;
    if (!("action" in obj)) return null;

    const action = normalizeAction(obj.action);
    if (!action) return null;

    const reasoning = obj.reasoning ? flattenReasoning(obj.reasoning) : "";

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
        if (decision) return { decision, method: "direct" };
    } catch {
        // Continue to next strategy
    }

    const stripped = stripMarkdown(text).trim();
    const jsonStr = extractJsonBounds(stripped);

    if (jsonStr) {
        try {
            const parsed = JSON.parse(jsonStr);
            const decision = validateDecision(parsed);
            if (decision) return { decision, method: "stripped" };
        } catch {
            // Continue to next strategy
        }

        try {
            const repaired = jsonrepair(jsonStr);
            const parsed = JSON.parse(repaired);
            const decision = validateDecision(parsed);
            if (decision) return { decision, method: "repaired" };
        } catch {
            // Continue to next strategy
        }
    }

    return { decision: null, method: "failed" };
}
