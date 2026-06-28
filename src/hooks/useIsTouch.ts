import { useState, useEffect } from 'react'

// true on coarse-pointer devices (phone/tablet) -> tap-to-select instead of hover.
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)')
    const handler = () => setTouch(mq.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])
  return touch
}
