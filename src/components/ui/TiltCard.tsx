// Parallax-Karte mit Neigung, Glanz und Lichtreflex, die dem Mauszeiger folgt. Berücksichtigt prefers-reduced-motion. Basis für die Trophy-Karten.

import Tilt from "react-parallax-tilt";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);

  // Respect the operating system's reduced-motion preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      setMotionEnabled(!mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !motionEnabled) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const offsetX = ((x - 50) / 50) * -14;
    const offsetY = ((y - 50) / 50) * -10 + 14;

    cardRef.current.style.setProperty("--light-x", `${x}%`);
    cardRef.current.style.setProperty("--light-y", `${y}%`);
    cardRef.current.style.setProperty("--shadow-x", `${offsetX}px`);
    cardRef.current.style.setProperty("--shadow-y", `${offsetY}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.setProperty("--light-x", "50%");
    cardRef.current.style.setProperty("--light-y", "50%");
    cardRef.current.style.setProperty("--shadow-x", "25px");
    cardRef.current.style.setProperty("--shadow-y", "25px");
  };

  return (
    <Tilt
      tiltMaxAngleX={20}
      tiltMaxAngleY={20}
      perspective={750}
      scale={motionEnabled ? 1.02 : 1.75}
      transitionSpeed={500}
      glareEnable={motionEnabled}
      glareMaxOpacity={0.25}
      glarePosition="all"
      glareColor="#ffffff"
      glareBorderRadius="6px"
      className="h-full"
    >
      <div
        ref={cardRef}
        className={`tilt-card-shell h-full ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="tilt-card-content h-full animate-card-appear">
          {children}
        </div>
      </div>
    </Tilt>
  );
}
