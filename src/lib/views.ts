import type { Tab } from "../components/TabNav";

export type View =
  | "entry"
  | "list"
  | "analysis"
  | "distribution"
  | "loot"
  | "trophy"
  | "settings";

export const tabs: Tab<View>[] = [
  { id: "entry", label: "Erfassen" },
  { id: "list", label: "Übersicht" },
  { id: "analysis", label: "Auswertung" },
  { id: "distribution", label: "Verteilung" },
  { id: "loot", label: "Loot" },
  { id: "trophy", label: "Trophy Room" },
  { id: "settings", label: "Profil" },
];
