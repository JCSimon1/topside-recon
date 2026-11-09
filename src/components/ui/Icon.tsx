import type { LucideProps } from 'lucide-react'
import { icons, type IconName } from '../../lib/icons'

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
}

export default function Icon({
  name,
  size = 16,
  strokeWidth = 1.75,
  ...rest
}: IconProps) {
  const Component = icons[name]
  return <Component size={size} strokeWidth={strokeWidth} {...rest} />
}
