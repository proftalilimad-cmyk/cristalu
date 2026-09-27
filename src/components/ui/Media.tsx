import { useState, type CSSProperties } from 'react'

type Props = {
  /** base name of the files in /public/media (without size suffix) */
  src: string
  alt: string
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  style?: CSSProperties
}

/**
 * Responsive, lazy, LQIP-backed picture element.
 * Files are generated at build-prep time: -480/-800/-1408 .webp + -1408 .jpg.
 */
export default function Media({
  src,
  alt,
  className = '',
  imgClassName = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 50vw',
  priority = false,
  style,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const base = `/media/${src}`

  return (
    <div className={`relative overflow-hidden bg-mist ${className}`} style={style}>
      <img
        src={`${base}-lqip.jpg`}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full scale-105 object-cover blur-xl transition-opacity duration-700 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <picture>
        <source
          type="image/webp"
          srcSet={`${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1408.webp 1408w`}
          sizes={sizes}
        />
        <img
          src={`${base}-1408.jpg`}
          alt={alt}
          width={1408}
          height={768}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={`relative h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </div>
  )
}
