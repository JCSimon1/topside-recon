import type { ReactNode } from "react";

interface PanelProps {
    title?: string
    children: ReactNode
}

export default function Panel({ title, children }: PanelProps) {
  return (
    <section className="rounded-sm border border-border bg-panel p-5.5">
      {title && (
        <h2 className="mb-4 font-display text-[19px] font-semibold tracking-[0.2px]">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}