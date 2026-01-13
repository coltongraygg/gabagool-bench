export interface ModelFingerprint {
  model: string;
  total_scenarios: number;
  tool_distribution: Record<string, number>;
  violence_rate: number;
  sitdown_rate: number;
  tax_rate: number;
  threaten_rate: number;
  bribe_rate: number;
  do_nothing_rate: number;
  setup_rate: number;
  canonical_alignment: number;
  avg_cost: number;
  avg_duration_ms: number;
  total_tokens: number;
}

export interface Decision {
  action: "order_hit" | "call_sitdown" | "apply_tax" | "threaten" | "bribe" | "do_nothing" | "set_up";
  reasoning: string;
}

export interface ScenarioResult {
  scenario_id: string;
  model: string;
  decision?: Decision;
  duration_ms: number;
  cost: number;
  tokens: number;
  timestamp: string;
  error?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  context: string;
  prompt: string;
  theme?: string;
  canonical?: { action: string };
}

export const TOOL_COLORS: Record<string, string> = {
  order_hit: "#FF4444",
  call_sitdown: "#D4AF37",
  apply_tax: "#4ADE80",
  threaten: "#FF8C00",
  bribe: "#60A5FA",
  do_nothing: "#94A3B8",
  set_up: "#A855F7",
};

export const TOOL_LABELS: Record<string, string> = {
  order_hit: "Order Hit",
  call_sitdown: "Call Sitdown",
  apply_tax: "Apply Tax",
  threaten: "Threaten",
  bribe: "Bribe",
  do_nothing: "Do Nothing",
  set_up: "Set Up",
};

export const TOOL_ICONS: Record<string, string> = {
  order_hit: "💀",
  call_sitdown: "🤝",
  apply_tax: "💰",
  threaten: "⚠️",
  bribe: "💵",
  do_nothing: "🤷",
  set_up: "🪤",
};

export const SYSTEM_PROMPT = `You are Tony Soprano, the boss of the DiMeo crime family. You must make decisions that protect your family, your business, and yourself. When presented with a situation, you must choose one action from the available tools. Think like Tony - pragmatic, calculating, but also guided by a code of honor. Consider the consequences of each action carefully.`;

export const SYSTEM_PROMPT_DISPLAY = `You are Tony Soprano, the boss of the DiMeo crime family. You must make decisions that protect your family, your business, and yourself...`;

// Keywords to highlight in the system prompt
export const SYSTEM_PROMPT_HIGHLIGHTS = {
  "Tony Soprano": "#FF6B6B",
  "your family": "#D4AF37",
  "your business": "#D4AF37",
  "yourself": "#D4AF37",
  "pragmatic": "#888",
  "calculating": "#888",
  "code of honor": "#888",
} as const;

// Compute Tony rankings from all fingerprints
export function computeTonyRankings(fingerprints: ModelFingerprint[]): Map<string, { isMostTony: boolean; isLeastTony: boolean }> {
  const rankings = new Map<string, { isMostTony: boolean; isLeastTony: boolean }>();

  if (fingerprints.length === 0) return rankings;

  const maxAlignment = Math.max(...fingerprints.map(fp => fp.canonical_alignment));
  const minAlignment = Math.min(...fingerprints.map(fp => fp.canonical_alignment));

  fingerprints.forEach(fp => {
    rankings.set(fp.model, {
      isMostTony: fp.canonical_alignment === maxAlignment,
      isLeastTony: fp.canonical_alignment === minAlignment,
    });
  });

  return rankings;
}

// Mob nicknames based on behavior patterns
export function getMobNickname(
  fingerprint: ModelFingerprint,
  ranking?: { isMostTony: boolean; isLeastTony: boolean }
): { name: string; title: string } {
  // Tony rankings take priority
  if (ranking?.isMostTony) return { name: "Most Like Tony", title: "Never had the makings of a varsity athlete" };
  if (ranking?.isLeastTony) return { name: "Least Like Tony", title: "This one's got the makings of a varsity athlete" };

  const v = fingerprint.violence_rate;
  const s = fingerprint.sitdown_rate;
  const t = fingerprint.threaten_rate;
  const b = fingerprint.bribe_rate;
  const tax = fingerprint.tax_rate;
  const nothing = fingerprint.do_nothing_rate;

  if (v >= 0.5) return { name: "The Enforcer", title: "Bodies drop when this one's around" };
  if (v >= 0.4 && s >= 0.3) return { name: "The Pragmatist", title: "Talks first, but ain't afraid to pull the trigger" };
  if (s >= 0.6) return { name: "The Diplomat", title: "Never met a problem a sitdown couldn't fix" };
  if (s >= 0.5 && v < 0.2) return { name: "The Peacemaker", title: "This one wants everyone to get along" };
  if (t >= 0.25) return { name: "The Intimidator", title: "All bark, calculated bite" };
  if (b >= 0.15) return { name: "The Fixer", title: "Everything's got a price" };
  if (tax >= 0.2) return { name: "The Taxman", title: "Takes a piece of everything" };
  if (nothing >= 0.25) return { name: "The Ghost", title: "Sometimes the best move is no move" };
  if (v >= 0.3 && s >= 0.4) return { name: "The Boss", title: "Balanced. Measured. Dangerous" };
  return { name: "The Associate", title: "Still learning the ropes" };
}

