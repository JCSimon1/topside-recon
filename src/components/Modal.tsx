// src/components/Modal.tsx
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-[rgba(10,12,13,0.72)] p-5 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
