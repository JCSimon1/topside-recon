// Kennzahl-Karte mit Label und Wert. Farbton über tone (default, accent, negative, teal).

const tones = {
  default: 'text-text',
  accent: 'text-accent',
  negative: 'text-negative',
  teal: 'text-accent-2',
} as const

export type Tone = keyof typeof tones

interface StatCardProps {
  label: string
  value: string
  tone?: Tone
}

export default function StatCard({
  label,
  value,
  tone = 'default',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="font-mono text-[10.5px] tracking-wide text-text-faint">
        {label}
      </div>
      <div
        className={`mt-1.5 font-display align-middle text-3xl font-bold ${tones[tone]}`}
      >
        {value}
      </div>
    </div>
  )
}
