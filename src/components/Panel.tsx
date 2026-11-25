// Container mit Hintergrund, Rahmen, Padding und optionalem Titel. Nimmt beliebige children auf.

import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  children: ReactNode
}

export default function Panel({ title, children }: PanelProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-6">
      {title && (
        <h2 className="mb-4 font-display text-[19px] font-semibold tracking-[0.2px]">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
