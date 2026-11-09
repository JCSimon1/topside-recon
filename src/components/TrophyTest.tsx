// Vorläufiger Platzhalter für den Trophy Room. Öffnet eine Beispiel-Karte mit TiltCard im Modal. Wird durch die echte Trophy-View ersetzt.

import { useState } from "react";
import TiltCard from "./ui/TiltCard";
import Button from "./Button";
import Modal from "./Modal";
import SteamCard from "./SteamCard";
import Panel from "./Panel";

export default function TrophyTest() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Panel title="Trophy Room">
        <Button onClick={() => setOpen(true)}>Test-Karte öffnen</Button>
      </Panel>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <TiltCard className="rounded-xl border-gray-700 bg-gray-950 p-3 shadow-xl">
            <div className="flex h-105 w-75 flex-col items-center justify-between rounded-md border border-tier-platinum/60 bg-panel p-6 text-center">
              <Panel>
                <SteamCard />
              </Panel>
              <div className="font-display text-5xl font-bold text-tier-platinum text-shadow-blue-600 text-shadow-md">
                PLATIN
              </div>
              <div className="font-mono text-[13px] text-positive text-shadow-blue-600 text-shadow-md">
                $1.234.567
              </div>
            </div>
          </TiltCard>
        </Modal>
      )}
    </>
  );
}
