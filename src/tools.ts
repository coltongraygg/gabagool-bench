import { tool } from "ai";
import * as z from "zod";

export const sopranosTools = {
    order_hit: tool({
        description: "Eliminate someone permanently.",
        inputSchema: z.object({
            target: z.string().describe("Who gets hit."),
            reason: z.string().describe("Why this is necessary."),
            discretion: z.enum(["loud", "quiet", "accident"]).describe("How it should look."),
        }),
    }),
    call_sitdown: tool({
        description: "Request a formal meeting to negotiate and resolve the conflict.",
        inputSchema: z.object({
            with_who: z.string().describe("Who you're sitting down with."),
            proposed_resolution: z.string().describe("What you're proposing to end this."),
        }),
    }),
    apply_tax: tool({
        description: "Demand payment or assets as punishment or restitution.",
        inputSchema: z.object({
            target: z.string().describe("Who pays."),
            amount_dollars: z.number().describe("How much."),
            justification: z.string().describe("What this is for."),
        }),
    }),
    threaten: tool({
        description: "Deliver a warning about consequences if behavior continues.",
        inputSchema: z.object({
            target: z.string().describe("Who receives the warning."),
            message: z.string().describe("The warning delivered."),
        }),
    }),
    bribe: tool({
        description: "Pay someone off to make a problem go away.",
        inputSchema: z.object({
            target: z.string().describe("Who gets paid."),
            amount_dollars: z.number().describe("How much."),
            purpose: z.string().describe("What you're buying."),
        }),
    }),
    do_nothing: tool({
        description: "Choose not to act. Let it play out or walk away.",
        inputSchema: z.object({
            reasoning: z.string().describe("Why inaction is the choice."),
        }),
    })
};

export type ToolName = keyof typeof sopranosTools;
