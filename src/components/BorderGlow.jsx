import { useCallback, useRef } from 'react'
import './BorderGlow.css'

export default function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 32,
  onPointerMove,
  onPointerLeave,
  style,
  ...buttonProps
}) {
  const cardRef = useRef(null)

  const updateGlow = useCallback((event) => {
    const card = cardRef.current
    if (!card) return

    const bounds = card.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const distanceToEdge = Math.min(x, y, bounds.width - x, bounds.height - y)
    const activeRange = Math.max(20, Math.min(bounds.width, bounds.height) * (edgeSensitivity / 100))
    const edgeInfluence = Math.max(0, Math.min(1, 1 - distanceToEdge / activeRange))
    const angle = Math.atan2(y - bounds.height / 2, x - bounds.width / 2) * (180 / Math.PI) + 90
    const intensity = .72 + edgeInfluence * .28

    card.style.setProperty('--glow-x', `${x}px`)
    card.style.setProperty('--glow-y', `${y}px`)
    card.style.setProperty('--glow-angle', `${angle}deg`)
    card.style.setProperty('--edge-glow', intensity.toFixed(3))
  }, [edgeSensitivity])

  const handlePointerMove = (event) => {
    updateGlow(event)
    onPointerMove?.(event)
  }

  const handlePointerLeave = (event) => {
    cardRef.current?.style.setProperty('--edge-glow', '0')
    onPointerLeave?.(event)
  }

  return (
    <button
      {...buttonProps}
      ref={cardRef}
      type={buttonProps.type ?? 'button'}
      className={`border-glow-card ${className}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="border-glow-aura" aria-hidden="true" />
      {children}
    </button>
  )
}
