// Types
export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";
export type BadgePeriod = "week" | "month";
export type MinRounds = number | Record<BadgePeriod, number>;
export type SteamProfile =
  | { configured: false }
  | {
      configured: true;
      name: string;
      avatar: string;
      profileUrl: string;
      status: SteamStatus;
      inGame: boolean;
    };

export type SteamStatus =
  | "offline"
  | "online"
  | "busy"
  | "away"
  | "snooze"
  | "looking_to_trade"
  | "looking_to_play";

export type TierThresholds = Record<BadgeTier, number>;

// Interfaces
export interface AppConfig {
  ui: UiConfig;
  maps: string[];
  companyLogos: string[];
  badges: BadgeRulesConfig;
  badgesRules: BadgeRulesConfig;
  charts: ChartsConfig;
  trophyRoom: TrophyRoomConfig;
  steamConfigured: boolean;
}

export interface BadgesConfig {
  money: TierThresholds;
  xp: TierThresholds;
  weeklyScale?: number;
}

export interface BadgesRuleBase {
  enabled?: boolean;
  periods?: BadgePeriod[];
}

export interface BadgeRulesConfig {
  record?: BadgesRuleBase;
  deathless?: BadgesRuleBase & { minRounds?: MinRounds };
  grinder?: BadgesRuleBase & { minRounds?: MinRounds };
  aboveAverage?: BadgesRuleBase & {
    minRounds?: MinRounds;
    metrics?: ("money" | "xp")[];
  };
  best?: BadgesRuleBase & { minPeriods?: number };
}

export interface ChartsConfig {
  pieColors: string[];
}

export interface LootItem {
  key: string;
  name: string;
  price: number;
  amount: number;
}

export interface RankOption {
  key: string;
  name: string;
}

export interface Round {
  id: number;
  number: number;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:MM'
  map: string;
  condition: string;
  money: number;
  xp: number;
}

// Expected values by the backend for the creation of a run / round
export interface RoundPayload {
  round_number: number;
  round_date: string;
  round_time: string;
  map: string;
  map_condition: string;
  money: number;
  xp: number;
}

export interface Settings {
  rank: string | null;
  ranks: RankOption[];
}

export interface TrophyRoomConfig {
  tiers: { money: TierThresholds; minRounds: number };
  titles: { luckyShare: number; grinderRounds: number; survivorRate: number };
  monthlyGoal: { money: number };
  imageVersion: string | null;
}

export interface UiConfig {
  defaultLanguage: "de" | "en" | null;
  listPageSize: number;
  recentRows: number;
  highscoreTopN: number;
  distributionTopN: number;
  topRunFactor: number;
  deathMoneyThreshold: number;
  tickerSeconds: number;
}
