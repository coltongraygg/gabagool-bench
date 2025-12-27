import * as z from "zod";

export const decisionSchema = z.object({
    action: z.enum([
        "order_hit",
        "call_sitdown",
        "apply_tax",
        "threaten",
        "bribe",
        "do_nothing",
        "set_up"
    ]).describe("The action to take"),

    reasoning: z.string().describe("Why this is the right call"),
});

export type Decision = z.infer<typeof decisionSchema>;
export type ActionType = Decision["action"];
