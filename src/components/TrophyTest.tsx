import { useState } from "react";
import Tilt from "react-parallax-tilt";
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
          <Tilt
            tiltMaxAngleX={25}
            tiltMaxAngleY={25}
            glareEnable
            glareMaxOpacity={0.7}
            glareColor="#8fd0d4"
            glareBorderRadius="6px"
            scale={2}
            transitionSpeed={600}
          >
            <div className="flex h-[420px] w-[300px] flex-col items-center justify-between rounded-md border border-tier-platinum/60 bg-panel p-6 text-center">
              <div className="font-mono text-[10.5px] tracking-wide text-text-faint">
                OKTOBER 2026
              </div>
              <div className="font-display text-5xl font-bold text-tier-platinum">
                PLATIN
              </div>
              <div className="font-mono text-[13px] text-positive">
                $1.234.567
              </div>
            </div>
          </Tilt>
        </Modal>
      )}
    </>
  );
}
