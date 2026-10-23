export interface Tab<T extends string> {
  id: T
  label: string
}

interface TabNavProps<T extends string> {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
}

export default function TabNav<T extends string>({
  tabs,
  active,
  onChange,
}: TabNavProps<T>) {
  return (
    <nav className="mb-6 flex gap-0.5 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`-mb-px mr-6 border-b-2 px-1 py-2.5 text-[14.5px] font-medium ${
            active === tab.id
              ? 'border-accent text-text'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}