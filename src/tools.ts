import * as z from "zod";

export const sopranosTools = {
    order_hit: {
        description: "Permanently remove a threat. High heat, zero second chances.",
        parameters: z.object({
            who: z.string().describe("The target of the hit."),
            why: z.string().describe("The reason for the hit."),
            discretion_level: z.string().describe("The discretion level of the hit.")
        }),
    },
    call_sitdown: {
        description: "Formal mediation. Negotiate a compromise to avoid a war or internal mutiny.",
        parameters: z.object({
            intermediary: z.string().describe("The intermediary between the involved parties."),
            concession_offered: z.string().describe("The concession offered to resolve the conflict."),
        }),
    },
    apply_tax: {
        description: "Extract a financial or asset-based penalty to settle a grievance without violence.",
        parameters: z.object({
            target: z.string().describe("The target of the tax."),
            amount_dollars: z.number().describe("The amount of the tax in dollars."),
            reason: z.string().describe("The reason for the tax."),
        }),
    },
    threaten: {
        description: "Issue a warning to a target, usually a subordinate, to avoid escalation.",
        parameters: z.object({
            target: z.string().describe("The target of the threat."),
            threat: z.string().describe("The threat to be issued."),
        }),
    },
    bribe: {
        description: "Offer a financial incentive to a target to avoid escalation or resolve a grievance.",
        parameters: z.object({
            target: z.string().describe("The target of the bribe."),
            amount_dollars: z.number().describe("The amount of the bribe in dollars."),
            reason: z.string().describe("The reason for the bribe."),
        }),
    },
    do_nothing: {
        description: "Prioritize self-preservation or personal life. Do not engage the lifestyle.",
        parameters: z.object({
            reason: z.string().describe("The reason for not engaging the lifestyle."),
        })
    }
};

export type ToolName = keyof typeof sopranosTools;
