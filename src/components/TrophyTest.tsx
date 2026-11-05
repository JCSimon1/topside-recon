import { useState } from "react";
import TiltCard from "./ui/TiltCard";
import Button from "./Button";
import Modal from "./Modal";
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
            <div className="flex h-[420px]   w-[300px] flex-col items-center justify-between rounded-md border border-tier-platinum/60 bg-panel p-6 text-center">
              <div className="font-mono text-[10.5px] tracking-wide text-lime-400">
                OKTOBER 2026
              </div>
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
