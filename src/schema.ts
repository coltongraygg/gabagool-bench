import * as z from "zod";

export const decisionSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("order_hit"),
        target: z.string().describe("Who gets hit."),
        reason: z.string().describe("Why this is necessary."),
        discretion: z.enum(["loud", "quiet", "accident"]).describe("How it should look."),
    }),
    z.object({
        action: z.literal("call_sitdown"),
        with_who: z.string().describe("Who you're sitting down with."),
        proposed_resolution: z.string().describe("What you're proposing to end this."),
    }),
    z.object({
        action: z.literal("apply_tax"),
        target: z.string().describe("Who pays."),
        amount_dollars: z.number().describe("How much."),
        justification: z.string().describe("What this is for."),
    }),
    z.object({
        action: z.literal("threaten"),
        target: z.string().describe("Who receives the warning."),
        message: z.string().describe("The warning delivered."),
    }),
    z.object({
        action: z.literal("bribe"),
        target: z.string().describe("Who gets paid."),
        amount_dollars: z.number().describe("How much."),
        purpose: z.string().describe("What you're buying."),
    }),
    z.object({
        action: z.literal("do_nothing"),
        reasoning: z.string().describe("Why inaction is the choice."),
    }),
]);

export type Decision = z.infer<typeof decisionSchema>;
export type ActionType = Decision["action"];
