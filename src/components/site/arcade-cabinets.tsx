'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from '@/components/site/arcade-landing.module.css'
import { cn } from '@/lib/utils'

function CabinetShell({
  title,
  description,
  tint,
  hud,
  children,
  controls,
}: {
  title: string
  description: string
  tint: string
  hud?: React.ReactNode
  children: React.ReactNode
  controls: React.ReactNode
}) {
  return (
    <article className={styles.cabinet}>
      <div className={styles.marquee}>
        <span className={styles.marqueeLabel}>
          <span className={styles.pulse} aria-hidden />
          {title}
        </span>
        {hud ? <div className={styles.hud}>{hud}</div> : null}
      </div>
      <div className={styles.screen} style={{ ['--screen-tint' as string]: tint }}>
        {children}
      </div>
      <div className={styles.cabFoot}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className={styles.cabControls}>{controls}</div>
      </div>
    </article>
  )
}

/* ===================== SPIN WHEEL ===================== */

const WHEEL_PRIZES = [
  { label: '50 XP', weight: 18, color: '#e8c56a', text: '#12100c' },
  { label: 'TRY\nAGAIN', weight: 14, color: '#1c1914', text: '#f1e9db' },
  { label: '100 XP', weight: 12, color: '#d4af37', text: '#12100c' },
  { label: '10 XP', weight: 16, color: '#1c1914', text: '#f1e9db' },
  { label: 'BONUS\nSPIN', weight: 8, color: '#f1e9db', text: '#12100c' },
  { label: '25 XP', weight: 16, color: '#1c1914', text: '#f1e9db' },
  { label: '250 XP', weight: 6, color: '#d4af37', text: '#12100c' },
  { label: '5 XP', weight: 10, color: '#1c1914', text: '#f1e9db' },
] as const

function pickWeightedIndex() {
  const total = WHEEL_PRIZES.reduce((sum, p) => sum + p.weight, 0)
  let roll = Math.random() * total
  for (let i = 0; i < WHEEL_PRIZES.length; i++) {
    roll -= WHEEL_PRIZES[i].weight
    if (roll <= 0) return i
  }
  return WHEEL_PRIZES.length - 1
}

function SpinWheelCabinet() {
  const discRef = useRef<HTMLDivElement>(null)
  const [spinsLeft, setSpinsLeft] = useState(5)
  const [bank, setBank] = useState(0)
  const [result, setResult] = useState('Press spin to claim a reward')
  const [spinning, setSpinning] = useState(false)
  const [flash, setFlash] = useState(false)
  const rotationRef = useRef(0)
  const segAngle = 360 / WHEEL_PRIZES.length

  const conic = useMemo(
    () =>
      WHEEL_PRIZES.map((p, i) => {
        const start = i * segAngle
        const end = (i + 1) * segAngle
        return `${p.color} ${start}deg ${end}deg`
      }).join(', '),
    [segAngle],
  )

  function spin() {
    if (spinning || spinsLeft <= 0 || !discRef.current) return
    setSpinning(true)
    setFlash(false)
    setResult('Spinning…')
    setSpinsLeft((n) => n - 1)

    const targetIndex = pickWeightedIndex()
    const targetCenter = targetIndex * segAngle + segAngle / 2
    const currentMod = ((rotationRef.current % 360) + 360) % 360
    const offsetNeeded = (((360 - targetCenter) - currentMod) + 360 * 4) % 360
    rotationRef.current += 2160 + offsetNeeded
    discRef.current.style.transform = `rotate(${rotationRef.current}deg)`

    window.setTimeout(() => {
      const prize = WHEEL_PRIZES[targetIndex]
      const xpMatch = prize.label.match(/(\d+)\s*XP/)
      const bonusSpin = prize.label.includes('BONUS')
      const gained = xpMatch ? Number(xpMatch[1]) : 0
      if (gained) setBank((b) => b + gained)
      if (bonusSpin) setSpinsLeft((n) => n + 1)
      setFlash(true)
      setResult(
        bonusSpin
          ? 'Bonus spin unlocked'
          : gained
            ? `+${gained} XP added to bank`
            : 'No reward this spin',
      )
      setSpinning(false)
      window.setTimeout(() => setFlash(false), 700)
    }, 4300)
  }

  function resetSession() {
    if (spinning) return
    setSpinsLeft(5)
    setBank(0)
    setResult('Press spin to claim a reward')
    setFlash(false)
  }

  return (
    <CabinetShell
      title="Prize Wheel"
      description="Weighted server-style odds with a session bank — same pattern used for check-in and loyalty rewards."
      tint="rgba(212, 175, 55, 0.16)"
      hud={
        <>
          <span>
            Spins <strong>{spinsLeft}</strong>
          </span>
          <span>
            Bank <strong>{bank} XP</strong>
          </span>
        </>
      }
      controls={
        <>
          <button
            type="button"
            className={styles.playBtn}
            onClick={spin}
            disabled={spinning || spinsLeft <= 0}
          >
            {spinsLeft <= 0 ? 'Out of spins' : 'Spin'}
          </button>
          <button type="button" className={styles.playBtnGhost} onClick={resetSession}>
            Reset
          </button>
          <span className={cn(styles.resultLine, flash && styles.resultWin)}>{result}</span>
        </>
      }
    >
      <div className={cn(styles.wheelFlash, flash && styles.wheelFlashOn)} />
      <div className={styles.wheelStage} onClick={spin} role="presentation">
        <div className={styles.wheelPointer} />
        <div className={styles.wheelPlate}>
          <div
            className={styles.wheelDisc}
            ref={discRef}
            style={{ background: `conic-gradient(${conic})` }}
          >
            {WHEEL_PRIZES.map((prize, i) => {
              const center = i * segAngle + segAngle / 2
              return (
                <div
                  key={prize.label + i}
                  className={styles.wheelSegLabel}
                  style={{
                    transform: `rotate(${center}deg) translate(34px, -8px)`,
                    color: prize.text,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {prize.label}
                </div>
              )
            })}
          </div>
          <div className={styles.wheelHub}>SPIN</div>
        </div>
      </div>
    </CabinetShell>
  )
}

/* ===================== SLOTS ===================== */

const SLOT_SYMBOLS = ['7️⃣', '⭐', '💎', '🔔', '🍒', '🍋'] as const
const SYMBOL_H = 64
const STRIP_LOOPS = 8

function buildStrip() {
  const strip: string[] = []
  for (let i = 0; i < STRIP_LOOPS; i++) {
    for (const s of SLOT_SYMBOLS) strip.push(s)
  }
  return strip
}

function SlotCabinet() {
  const strips = useMemo(() => [buildStrip(), buildStrip(), buildStrip()], [])
  const [offsets, setOffsets] = useState([0, 0, 0])
  const [spinning, setSpinning] = useState(false)
  const [leverPulled, setLeverPulled] = useState(false)
  const [credits, setCredits] = useState(20)
  const [lastWin, setLastWin] = useState(0)
  const [result, setResult] = useState('1 credit per pull · match 2 or 3 on the payline')
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    return () => timersRef.current.forEach((id) => cancelAnimationFrame(id))
  }, [])

  function pull() {
    if (spinning || credits <= 0) return
    setSpinning(true)
    setCredits((c) => c - 1)
    setLastWin(0)
    setResult('Reels in motion…')
    setLeverPulled(false)
    requestAnimationFrame(() => setLeverPulled(true))

    const finals = [0, 1, 2].map(() => Math.floor(Math.random() * SLOT_SYMBOLS.length))
    let done = 0

    ;[0, 1, 2].forEach((reel) => {
      const duration = 1400 + reel * 550
      const start = performance.now()
      const startOffset = offsets[reel]
      const cycles = 10 + reel * 4
      const targetIndex = SLOT_SYMBOLS.length * 4 + finals[reel]
      const targetOffset = -(targetIndex * SYMBOL_H)

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        const travel = cycles * SLOT_SYMBOLS.length * SYMBOL_H * eased
        const next = startOffset - travel
        setOffsets((prev) => {
          const copy = [...prev]
          // Keep strip in range visually near end
          copy[reel] = t >= 1 ? targetOffset : next
          return copy
        })
        if (t < 1) {
          const id = requestAnimationFrame(tick)
          timersRef.current.push(id)
        } else {
          done += 1
          if (done === 3) {
            const [a, b, c] = finals.map((i) => SLOT_SYMBOLS[i])
            let win = 0
            if (a === b && b === c) win = a === '7️⃣' ? 25 : a === '💎' ? 15 : 8
            else if (a === b || b === c || a === c) win = 2
            if (win > 0) {
              setCredits((cr) => cr + win)
              setLastWin(win)
              setResult(`Payline hit · +${win} credits`)
            } else {
              setResult('No match — try again')
            }
            setSpinning(false)
          }
        }
      }
      const id = requestAnimationFrame(tick)
      timersRef.current.push(id)
    })
  }

  return (
    <CabinetShell
      title="Loyalty Reels"
      description="Three-reel payline with credit economy — built for daily streaks and check-in bonuses."
      tint="rgba(241, 233, 219, 0.08)"
      hud={
        <>
          <span>
            Credits <strong>{credits}</strong>
          </span>
          <span>
            Last win <strong>{lastWin || '—'}</strong>
          </span>
        </>
      }
      controls={
        <>
          <button
            type="button"
            className={styles.playBtn}
            onClick={pull}
            disabled={spinning || credits <= 0}
          >
            {credits <= 0 ? 'No credits' : 'Pull'}
          </button>
          <button
            type="button"
            className={styles.playBtnGhost}
            onClick={() => {
              if (spinning) return
              setCredits(20)
              setLastWin(0)
              setResult('1 credit per pull · match 2 or 3 on the payline')
            }}
          >
            Top up
          </button>
          <span className={cn(styles.resultLine, lastWin > 0 && styles.resultWin)}>{result}</span>
        </>
      }
    >
      <div
        className={cn(styles.slotLever, leverPulled && styles.slotLeverPulled)}
        onClick={pull}
        role="presentation"
      />
      <div className={styles.payline} />
      <div className={styles.slotChrome}>
        {strips.map((strip, reel) => (
          <div key={reel} className={styles.reel}>
            <div className={styles.reelWindow} />
            <div
              className={styles.reelStrip}
              style={{
                transform: `translateY(${offsets[reel] + 96}px)`,
                transition: spinning ? undefined : 'transform 0.2s ease',
              }}
            >
              {strip.map((symbol, i) => (
                <div key={`${reel}-${i}`} className={styles.reelSymbol}>
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CabinetShell>
  )
}

/* ===================== RACING ===================== */

function RaceCabinet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const [overlayTitle, setOverlayTitle] = useState('Neon Circuit')
  const [overlaySub, setOverlaySub] = useState('Dodge traffic. Survive as long as you can.')
  const [hudDistance, setHudDistance] = useState(0)
  const [hudBest, setHudBest] = useState(0)
  const apiRef = useRef<{ start: () => void; nudge: (d: number) => void } | null>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext('2d')
    if (!context) return
    const canvas = canvasEl
    const ctx = context

    let w = 0
    let h = 0
    const state = {
      lane: 1,
      running: false,
      obstacles: [] as { lane: number; y: number; color: string }[],
      distance: 0,
      speed: 2.6,
      frame: 0,
      dashOffset: 0,
      raf: 0,
      best: 0,
    }

    function sizeCanvas() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      drawScene()
    }

    function laneX(l: number) {
      return w * 0.5 + (l - 1) * (w * 0.2)
    }

    function drawCar(x: number, y: number, body: string, glass: string, player = false) {
      ctx.fillStyle = body
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath()
        ctx.roundRect(x - 14, y - 24, 28, 44, 7)
        ctx.fill()
      } else {
        ctx.fillRect(x - 14, y - 24, 28, 44)
      }
      ctx.fillStyle = glass
      ctx.fillRect(x - 9, y - 16, 18, 11)
      ctx.fillRect(x - 9, y + 2, 18, 9)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(x - 16, y - 14, 4, 9)
      ctx.fillRect(x + 12, y - 14, 4, 9)
      ctx.fillRect(x - 16, y + 8, 4, 9)
      ctx.fillRect(x + 12, y + 8, 4, 9)
      if (player) {
        ctx.fillStyle = 'rgba(241,233,219,0.9)'
        ctx.fillRect(x - 5, y + 16, 10, 3)
        ctx.fillStyle = 'rgba(212,175,55,0.35)'
        ctx.beginPath()
        ctx.ellipse(x, y + 28, 16, 5, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawScene() {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0a0908'
      ctx.fillRect(0, 0, w, h)

      const roadW = w * 0.56
      const roadX = (w - roadW) / 2

      // roadside marks
      ctx.fillStyle = '#14110c'
      ctx.fillRect(0, 0, roadX, h)
      ctx.fillRect(roadX + roadW, 0, w - roadX - roadW, h)
      for (let y = -40 + (state.dashOffset % 50); y < h; y += 50) {
        ctx.fillStyle = 'rgba(212,175,55,0.08)'
        ctx.fillRect(roadX - 14, y, 8, 22)
        ctx.fillRect(roadX + roadW + 6, y, 8, 22)
      }

      const grad = ctx.createLinearGradient(roadX, 0, roadX + roadW, 0)
      grad.addColorStop(0, '#17140f')
      grad.addColorStop(0.5, '#221d16')
      grad.addColorStop(1, '#17140f')
      ctx.fillStyle = grad
      ctx.fillRect(roadX, 0, roadW, h)

      ctx.strokeStyle = 'rgba(241,233,219,0.4)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(roadX + 5, 0)
      ctx.lineTo(roadX + 5, h)
      ctx.moveTo(roadX + roadW - 5, 0)
      ctx.lineTo(roadX + roadW - 5, h)
      ctx.stroke()

      state.dashOffset = (state.dashOffset + state.speed * 1.4) % 48
      ctx.strokeStyle = 'rgba(212,175,55,0.75)'
      ctx.lineWidth = 3
      ctx.setLineDash([16, 18])
      ctx.lineDashOffset = -state.dashOffset
      ;[1 / 3, 2 / 3].forEach((f) => {
        ctx.beginPath()
        ctx.moveTo(roadX + roadW * f, 0)
        ctx.lineTo(roadX + roadW * f, h)
        ctx.stroke()
      })
      ctx.setLineDash([])

      // HUD bar
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(0, 0, w, 28)
      ctx.fillStyle = '#d4af37'
      ctx.font = '600 11px ui-monospace, monospace'
      ctx.fillText(`DIST ${Math.floor(state.distance)}m`, 12, 18)
      ctx.fillText(`SPD ${(state.speed * 18).toFixed(0)}`, w / 2 - 20, 18)
      ctx.fillText(`BEST ${Math.floor(state.best)}m`, w - 88, 18)

      const enemyColors = ['#8a6f20', '#6b5520', '#a47e08']
      state.obstacles.forEach((o) => {
        drawCar(laneX(o.lane), o.y, o.color || enemyColors[0], '#3d3114')
      })
      drawCar(laneX(state.lane), h - 42, '#d4af37', '#f1e9db', true)
    }

    function gameOver() {
      state.running = false
      state.best = Math.max(state.best, state.distance)
      setHudBest(Math.floor(state.best))
      setHudDistance(Math.floor(state.distance))
      setOverlayTitle('Run over')
      setOverlaySub(`You covered ${Math.floor(state.distance)}m. Best: ${Math.floor(state.best)}m.`)
      setShowOverlay(true)
      drawScene()
    }

    function loop() {
      if (!state.running) return
      state.frame += 1
      state.distance += state.speed * 0.35
      setHudDistance(Math.floor(state.distance))

      const spawnChance = 0.018 + state.speed * 0.0025
      if (Math.random() < spawnChance) {
        const colors = ['#8a6f20', '#6b5520', '#a47e08']
        state.obstacles.push({
          lane: Math.floor(Math.random() * 3),
          y: -30,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      state.obstacles.forEach((o) => {
        o.y += state.speed * 2.1
      })
      const cy = h - 42
      for (const o of state.obstacles) {
        if (o.lane === state.lane && Math.abs(o.y - cy) < 36) {
          gameOver()
          return
        }
      }
      state.obstacles = state.obstacles.filter((o) => o.y < h + 40)
      if (state.frame % 180 === 0) state.speed = Math.min(state.speed + 0.28, 7.5)
      drawScene()
      state.raf = requestAnimationFrame(loop)
    }

    function start() {
      state.lane = 1
      state.obstacles = []
      state.distance = 0
      state.speed = 2.6
      state.frame = 0
      setHudDistance(0)
      setShowOverlay(false)
      state.running = true
      state.raf = requestAnimationFrame(loop)
    }

    function nudge(delta: number) {
      if (!state.running) return
      state.lane = Math.max(0, Math.min(2, state.lane + delta))
    }

    function onKey(e: KeyboardEvent) {
      if (!state.running) return
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault()
        state.lane = Math.max(0, state.lane - 1)
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault()
        state.lane = Math.min(2, state.lane + 1)
      }
    }

    apiRef.current = { start, nudge }
    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(state.raf)
      state.running = false
      apiRef.current = null
      window.removeEventListener('resize', sizeCanvas)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <CabinetShell
      title="Lane Runner"
      description="Endless dodge circuit with rising speed — keyboard or on-screen controls."
      tint="rgba(212, 175, 55, 0.12)"
      hud={
        <>
          <span>
            Dist <strong>{hudDistance}m</strong>
          </span>
          <span>
            Best <strong>{hudBest}m</strong>
          </span>
        </>
      }
      controls={
        <>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => apiRef.current?.start()}
          >
            {showOverlay ? 'Start run' : 'Restart'}
          </button>
          <span className={styles.resultLine}>← → or A / D to steer</span>
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.gameCanvas} />
      {showOverlay ? (
        <div className={styles.raceOverlay}>
          <p className={styles.overlayTitle}>{overlayTitle}</p>
          <p className={styles.overlaySub}>{overlaySub}</p>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => apiRef.current?.start()}
          >
            Start run
          </button>
        </div>
      ) : null}
      <div className={styles.raceTouch}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => apiRef.current?.nudge(-1)}
          aria-label="Steer left"
        >
          ◀
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => apiRef.current?.nudge(1)}
          aria-label="Steer right"
        >
          ▶
        </button>
      </div>
    </CabinetShell>
  )
}

/* ===================== ARCHERY ===================== */

function ArcheryCabinet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [arrows, setArrows] = useState(6)
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [result, setResult] = useState('Hold to draw · release to shoot')
  const [power, setPower] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true)
  const apiRef = useRef<{
    reset: () => void
    pointerDown: (x: number, y: number) => void
    pointerMove: (x: number, y: number) => void
    pointerUp: (x: number, y: number) => void
  } | null>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext('2d')
    if (!context) return
    const canvas = canvasEl
    const ctx = context

    let w = 0
    let h = 0
    let raf = 0
    const state = {
      arrowsLeft: 6,
      score: 0,
      shots: 0,
      hits: 0,
      targetY: 0,
      targetDir: 1,
      drawing: false,
      power: 0,
      aimX: 0,
      aimY: 0,
      shafts: [] as { x2: number; y2: number; life: number; hit: boolean }[],
      running: true,
    }

    function sizeCanvas() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      state.targetY = h * 0.5
    }

    function targetCenter() {
      return { x: w * 0.72, y: state.targetY, r: Math.min(52, w * 0.14) }
    }

    function drawTarget(cx: number, cy: number, r: number) {
      const rings = [
        ['#f1e9db', 1],
        ['#d4af37', 0.78],
        ['#f1e9db', 0.58],
        ['#8a6f20', 0.4],
        ['#f1e9db', 0.26],
        ['#d4af37', 0.14],
        ['#12100c', 0.06],
      ] as const
      rings.forEach(([color, scale]) => {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.arc(cx, cy, r * scale, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    function drawScene() {
      ctx.clearRect(0, 0, w, h)
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#14120e')
      bg.addColorStop(1, '#080807')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // range lane
      ctx.fillStyle = 'rgba(212,175,55,0.05)'
      ctx.fillRect(w * 0.08, 0, w * 0.2, h)

      const t = targetCenter()
      drawTarget(t.x, t.y, t.r)

      // bow
      const bowX = w * 0.14
      const bowY = h * 0.55
      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(bowX, bowY, 42, -Math.PI * 0.55, Math.PI * 0.55)
      ctx.stroke()
      ctx.strokeStyle = 'rgba(241,233,219,0.55)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(bowX + 4, bowY - 36)
      ctx.lineTo(bowX + 4, bowY + 36)
      ctx.stroke()

      // drawn string / aim
      if (state.drawing) {
        ctx.strokeStyle = 'rgba(241,233,219,0.35)'
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(bowX + 8, bowY)
        ctx.lineTo(state.aimX, state.aimY)
        ctx.stroke()
        ctx.setLineDash([])
      }

      state.shafts.forEach((s) => {
        ctx.strokeStyle = s.hit ? '#d4af37' : 'rgba(241,233,219,0.55)'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(bowX + 8, bowY)
        ctx.lineTo(s.x2, s.y2)
        ctx.stroke()
        ctx.fillStyle = s.hit ? '#f1e9db' : '#d4af37'
        ctx.beginPath()
        ctx.arc(s.x2, s.y2, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // crosshair when aiming
      if (state.drawing) {
        ctx.strokeStyle = '#d4af37'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(state.aimX, state.aimY, 10, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(state.aimX - 14, state.aimY)
        ctx.lineTo(state.aimX + 14, state.aimY)
        ctx.moveTo(state.aimX, state.aimY - 14)
        ctx.lineTo(state.aimX, state.aimY + 14)
        ctx.stroke()
      }
    }

    function loop() {
      if (!state.running) return
      // gentle bobbing target
      state.targetY += state.targetDir * 0.55
      if (state.targetY > h * 0.72 || state.targetY < h * 0.28) state.targetDir *= -1
      if (state.drawing) {
        state.power = Math.min(100, state.power + 1.8)
        setPower(Math.round(state.power))
      }
      state.shafts = state.shafts
        .map((s) => ({ ...s, life: s.life - 1 }))
        .filter((s) => s.life > 0)
      drawScene()
      raf = requestAnimationFrame(loop)
    }

    function localPoint(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect()
      return { x: clientX - rect.left, y: clientY - rect.top }
    }

    function pointerDown(clientX: number, clientY: number) {
      if (state.arrowsLeft <= 0) return
      const p = localPoint(clientX, clientY)
      state.drawing = true
      state.power = 10
      state.aimX = p.x
      state.aimY = p.y
      setPower(10)
      setShowOverlay(false)
    }

    function pointerMove(clientX: number, clientY: number) {
      if (!state.drawing) return
      const p = localPoint(clientX, clientY)
      state.aimX = p.x
      state.aimY = p.y
    }

    function pointerUp(clientX: number, clientY: number) {
      if (!state.drawing) return
      state.drawing = false
      const p = localPoint(clientX, clientY)
      const powerFactor = 0.55 + state.power / 200
      const bowX = w * 0.14
      const bowY = h * 0.55
      const dx = (p.x - bowX) * powerFactor
      const dy = (p.y - bowY) * powerFactor
      const landX = bowX + dx
      const landY = bowY + dy

      state.arrowsLeft -= 1
      state.shots += 1
      setArrows(state.arrowsLeft)
      setPower(0)

      const t = targetCenter()
      const dist = Math.hypot(landX - t.x, landY - t.y)
      let pts = 0
      if (dist < t.r * 0.12) pts = 50
      else if (dist < t.r * 0.28) pts = 30
      else if (dist < t.r * 0.48) pts = 20
      else if (dist < t.r * 0.72) pts = 10
      else if (dist < t.r) pts = 5

      const hit = pts > 0
      if (hit) {
        state.hits += 1
        state.score += pts
      }
      state.shafts.push({ x2: landX, y2: landY, life: 90, hit })

      setScore(state.score)
      const acc = state.shots ? Math.round((state.hits / state.shots) * 100) : 0
      setAccuracy(acc)
      setResult(
        hit
          ? `Hit · +${pts} pts · ${state.arrowsLeft} arrows left`
          : `Miss · ${state.arrowsLeft} arrows left`,
      )

      if (state.arrowsLeft <= 0) {
        setResult(`Round complete · ${state.score} pts · ${acc}% accuracy`)
        setShowOverlay(true)
      }
    }

    function reset() {
      state.arrowsLeft = 6
      state.score = 0
      state.shots = 0
      state.hits = 0
      state.shafts = []
      state.drawing = false
      state.power = 0
      setArrows(6)
      setScore(0)
      setAccuracy(0)
      setPower(0)
      setResult('Hold to draw · release to shoot')
      setShowOverlay(true)
    }

    apiRef.current = { reset, pointerDown, pointerMove, pointerUp }
    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)
    raf = requestAnimationFrame(loop)

    return () => {
      state.running = false
      cancelAnimationFrame(raf)
      apiRef.current = null
      window.removeEventListener('resize', sizeCanvas)
    }
  }, [])

  return (
    <CabinetShell
      title="Precision Range"
      description="Hold to draw power, release to shoot a moving target — scored by ring accuracy."
      tint="rgba(241, 233, 219, 0.07)"
      hud={
        <>
          <span>
            Arrows <strong>{arrows}</strong>
          </span>
          <span>
            Score <strong>{score}</strong>
          </span>
          <span>
            Acc <strong>{accuracy}%</strong>
          </span>
        </>
      }
      controls={
        <>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => apiRef.current?.reset()}
          >
            New round
          </button>
          <span className={cn(styles.resultLine, score > 0 && styles.resultWin)}>{result}</span>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        className={styles.gameCanvas}
        onPointerDown={(e) => {
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
          apiRef.current?.pointerDown(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => apiRef.current?.pointerMove(e.clientX, e.clientY)}
        onPointerUp={(e) => apiRef.current?.pointerUp(e.clientX, e.clientY)}
        onPointerCancel={(e) => apiRef.current?.pointerUp(e.clientX, e.clientY)}
      />
      <div className={styles.powerMeter} aria-hidden>
        <div className={styles.powerFill} style={{ height: `${power}%` }} />
      </div>
      {showOverlay ? (
        <div className={styles.archOverlay}>
          <p className={styles.overlayTitle}>
            {arrows <= 0 ? 'Round complete' : 'Precision Range'}
          </p>
          <p className={styles.overlaySub}>
            {arrows <= 0
              ? `${score} pts · ${accuracy}% accuracy. Start a new round to continue.`
              : 'Hold on the board to draw. Release to fire. The target keeps moving.'}
          </p>
          {arrows <= 0 ? (
            <button
              type="button"
              className={styles.playBtn}
              onClick={() => apiRef.current?.reset()}
            >
              New round
            </button>
          ) : null}
        </div>
      ) : null}
    </CabinetShell>
  )
}

export function ArcadeCabinets() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SpinWheelCabinet />
      <SlotCabinet />
      <RaceCabinet />
      <ArcheryCabinet />
    </div>
  )
}
