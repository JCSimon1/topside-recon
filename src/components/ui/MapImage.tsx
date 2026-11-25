import { useEffect, useState } from 'react'
import { slugify } from '../../lib/format'

interface MapImageProps {
  map?: string
  version?: string | null
  className?: string
}

const FALLBACK_IMG = '/images/misc/monthly_trophy_background_orig.webp'

function MapImage({ map, version, className = '' }: MapImageProps) {
  const fallback =
    FALLBACK_IMG + (version ? `?v=${encodeURIComponent(version)}` : '')

  const primary = map ? `/images/maps/${slugify(map)}.webp` : fallback

  const [src, setSrc] = useState(primary)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setSrc(primary)
    setHidden(false)
  }, [primary])

  if (hidden) return null

  return (
    <img
      src={src}
      alt=""
      className={className}
      onError={() => {
        if (src !== fallback) setSrc(fallback)
        else setHidden(true)
      }}
    />
  )
}

export default MapImage
