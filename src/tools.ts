import { tool } from "ai";
import * as z from "zod";

export const sopranosTools = {
    order_hit: tool({
        description: "Permanently remove a threat. High heat, zero second chances.",
        inputSchema: z.object({
            who: z.string().describe("The target of the hit."),
            why: z.string().describe("The reason for the hit."),
            discretion_level: z.string().describe("The discretion level of the hit.")
        }),
    }),
    call_sitdown: tool({
        description: "Formal mediation. Negotiate a compromise to avoid a war or internal mutiny.",
        inputSchema: z.object({
            intermediary: z.string().describe("The intermediary between the involved parties."),
            concession_offered: z.string().describe("The concession offered to resolve the conflict."),
        }),
    }),
    apply_tax: tool({
        description: "Extract a financial or asset-based penalty to settle a grievance without violence.",
        inputSchema: z.object({
            target: z.string().describe("The target of the tax."),
            amount_dollars: z.number().describe("The amount of the tax in dollars."),
            reason: z.string().describe("The reason for the tax."),
        }),
    }),
    threaten: tool({
        description: "Issue a warning to a target, usually a subordinate, to avoid escalation.",
        inputSchema: z.object({
            target: z.string().describe("The target of the threat."),
            threat: z.string().describe("The threat to be issued."),
        }),
    }),
    bribe: tool({
        description: "Offer a financial incentive to a target to avoid escalation or resolve a grievance.",
        inputSchema: z.object({
            target: z.string().describe("The target of the bribe."),
            amount_dollars: z.number().describe("The amount of the bribe in dollars."),
            reason: z.string().describe("The reason for the bribe."),
        }),
    }),
    do_nothing: tool({
        description: "Prioritize self-preservation or personal life. Do not engage the lifestyle.",
        inputSchema: z.object({
            reason: z.string().describe("The reason for not engaging the lifestyle."),
        }),
    })
};

export type ToolName = keyof typeof sopranosTools;
