// Generische Tab-Leiste (<T extends string>). Bekommt Tabs, aktiven Tab und onChange, hält selbst keinen State.
// Verwendet React-Komponente von Lucide für die Tab Icons

import type { IconName } from '../lib/icons'
import Icon from './ui/Icon'

export interface Tab<T extends string> {
  id: T
  label: string
  icon?: IconName
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
    <nav
      aria-label="Hauptnavigation"
      className="mb-6 flex gap-6 overflow-x-auto border-b border-border"
    >
      {tabs.map(({ id, label, icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`-mb-px flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-1 py-2.5 text-[14.5px] font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 ${
              isActive
                ? 'border-accent text-text'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {icon && <Icon name={icon} />}
            {label}
          </button>
        )
      })}
    </nav>
  )
}
