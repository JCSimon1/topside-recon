import { useState } from "react";
import { tabs, type View } from "./lib/views";
import Button from "./components/Button";
import Header from "./components/Header";
import LootView from "./components/LootView";
import Panel from "./components/Panel";
import ProfileBar from "./components/ProfileBar";
import ProfileView from "./components/ProfileView";
import TabNav from "./components/TabNav";

export default function App() {
  const [view, setView] = useState<View>("entry");

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-7 pb-20">
      <Header />

      <ProfileBar />

      <TabNav tabs={tabs} active={view} onChange={setView} />

      <main>
        {view === "entry" && (
          <Panel title="Log Runs">
            <div className="flex gap-4">
              <Button onClick={() => alert("Klick")}>Speichern</Button>
              <Button variant="ghost">Abbrechen</Button>
              <Button disabled>Deaktiviert</Button>
            </div>
          </Panel>
        )}
        {view === "list" && (
          <Panel title="Übersicht">
            <p>Inhalt folgt</p>
          </Panel>
        )}
        {view === "analysis" && (
          <Panel title="Analyse">
            <p>Inhalt folgt</p>
          </Panel>
        )}
        {view === "distribution" && (
          <Panel title="Verteilung">
            <p>Inhalt folgt</p>
          </Panel>
        )}
        {view === "loot" && <LootView />}
        {view === "trophy" && (
          <Panel title="Trophy Room">
            <p>Inhalt folgt</p>
          </Panel>
        )}
        {view === "settings" && <ProfileView />}
      </main>
    </div>
  );
}
