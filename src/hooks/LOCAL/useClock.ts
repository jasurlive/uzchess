import { useEffect, useRef, useState } from 'react'
import { playGameEndSound, playHurrySound } from '../../lib/sound'

type Side = 'white' | 'black'

const HURRY_MS = 10_000

// two-sided chess clock in milliseconds; `base` 0 means no clock
// runs for `turn` while `running` is true, stops for good once a side hits 0
export function useClock(base: number, turn: Side, running: boolean) {
  const [times, setTimes] = useState({ white: base, black: base })
  const hurried = useRef({ white: false, black: false })

  const flagged: Side | null =
    base > 0 && times.white <= 0 ? 'white' : base > 0 && times.black <= 0 ? 'black' : null
  const ticking = base > 0 && running && !flagged

  useEffect(() => {
    if (!ticking) return
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const spent = now - last
      last = now
      setTimes((t) => ({ ...t, [turn]: Math.max(0, t[turn] - spent) }))
    }
    const id = setInterval(tick, 100)
    // charge the last fraction of a tick to the side that just moved
    return () => {
      clearInterval(id)
      tick()
    }
  }, [turn, ticking])

  // warning beep once per side when it drops under 10 seconds
  useEffect(() => {
    if (!ticking || base <= HURRY_MS) return
    if (times[turn] < HURRY_MS && !hurried.current[turn]) {
      hurried.current[turn] = true
      playHurrySound()
    }
  }, [times, turn, ticking, base])

  useEffect(() => {
    if (flagged) playGameEndSound()
  }, [flagged])

  return { times, flagged, ticking }
}

// 3:00, 0:42, then 0:19.7 under 20 seconds (like chess.com)
export function formatClock(ms: number) {
  if (ms < 20_000) {
    const tenths = Math.floor(ms / 100)
    return `0:${String(Math.floor(tenths / 10)).padStart(2, '0')}.${tenths % 10}`
  }
  const s = Math.ceil(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
