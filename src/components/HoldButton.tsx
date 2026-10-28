import { useEffect, useRef, useState, type ReactNode } from "react";

interface HoldButtonProps {
  onConfirm: () => void;
  holdMs?: number;
  title?: string;
  children: ReactNode;
}

export default function HoldButton({
  onConfirm,
  holdMs = 1000,
  title,
  children,
}: HoldButtonProps) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };

  const start = () => {
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onConfirm();
    }, holdMs);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <button
      type="button"
      title={title}
      onPointerDown={(e) => {
        if (e.button !== 0) return; // nur linke Maustaste
        start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) start();
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") cancel();
      }}
      className={`relative cursor-pointer touch-none overflow-hidden rounded-sm border px-2.5 py-1 text-xs select-none ${
        holding
          ? "border-negative text-white"
          : "border-border text-text-muted hover:border-negative hover:text-negative"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left bg-negative ease-linear"
        style={{
          transform: holding ? "scaleX(1)" : "scaleX(0)",
          transitionProperty: "transform",
          transitionDuration: holding ? `${holdMs}ms` : "150ms",
        }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}
