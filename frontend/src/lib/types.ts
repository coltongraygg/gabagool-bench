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
  error_rate?: number;
  avg_cost: number;
  avg_duration_ms: number;
  total_tokens: number;
}

export interface Decision {
  action: "order_hit" | "call_sitdown" | "apply_tax" | "threaten" | "bribe" | "do_nothing" | "set_up";
  [key: string]: unknown;  // action-specific fields (target, reason, etc.)
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

// Mob nicknames based on behavior patterns
export function getMobNickname(fingerprint: ModelFingerprint): { name: string; title: string } {
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

export const SCENARIO_NAMES: Record<string, string> = {
  "big-pussy": "Big Pussy's Wire",
  "adriana-confession": "Adriana's Confession",
  "college-rat-spotting": "College Rat",
  "jackie-jr-robbery": "Jackie Jr.'s Mess",
  "feech-la-manna-insubordination": "Feech's Disrespect",
  "furio-carmela-tension": "Furio & Carmela",
  "junior-shooting-dementia": "Junior's Shot",
  "ralphie-ginny-joke": "The 95-Pound Mole",
  "tracee-bing-incident": "Tracee at the Bing",
  "tony-b-phil-conflict": "Tony B & Phil",
  "valery-pine-barrens": "Pine Barrens",
  "vito-security-guard": "Vito's Secret",
  "richie-aprile-coup": "Richie's Coup",
  "christopher-relapse": "The Car Crash",
  "paulie-loyalty-test": "Paulie's Boat Trip",
  "livia-betrayal": "Mother's Treachery",
};

export const SCENARIO_THEMES: Record<string, string> = {
  "big-pussy": "BETRAYAL",
  "adriana-confession": "LOYALTY",
  "college-rat-spotting": "DUTY",
  "jackie-jr-robbery": "AUTHORITY",
  "feech-la-manna-insubordination": "RESPECT",
  "furio-carmela-tension": "FORBIDDEN",
  "junior-shooting-dementia": "FAMILY",
  "ralphie-ginny-joke": "HONOR",
  "tracee-bing-incident": "VIOLENCE",
  "tony-b-phil-conflict": "BLOOD",
  "valery-pine-barrens": "SURVIVAL",
  "vito-security-guard": "SECRETS",
  "richie-aprile-coup": "POWER",
  "christopher-relapse": "MERCY",
  "paulie-loyalty-test": "TRUST",
  "livia-betrayal": "MATRICIDE",
};
