import type { UiConfig } from "../api/types";

export const makeUi = (overrides: Partial<UiConfig> = {}): UiConfig => ({
  defaultLanguage: null,
  listPageSize: 20,
  recentRows: 6,
  highscoreTopN: 10,
  distributionTopN: 5,
  topRunFactor: 1.2,
  deathMoneyThreshold: 0,
  tickerSeconds: 40,
  ...overrides,
});
