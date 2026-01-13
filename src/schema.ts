import * as z from "zod";

const actionSchema = z.enum([
    "order_hit",
    "call_sitdown",
    "apply_tax",
    "threaten",
    "bribe",
    "do_nothing",
    "set_up"
]);

// Schema for validating scenario JSON files
export const scenarioFileSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    prompt: z.string(),
    context: z.string().optional(),
    theme: z.string().optional(),
    stakes: z.string().optional(),
    canonical: z.object({
        action: actionSchema
    }).optional(),
});

export const decisionSchema = z.object({
    action: actionSchema.describe("The action to take"),
    reasoning: z.string().describe("Why this is the right call"),
});

export type Decision = z.infer<typeof decisionSchema>;
