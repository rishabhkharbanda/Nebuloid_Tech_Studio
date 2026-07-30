'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '@/components/site/arcade-landing.module.css'
import { cn } from '@/lib/utils'

function CabinetShell({
  title,
  description,
  tint,
  children,
  controls,
}: {
  title: string
  description: string
  tint: string
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
        <span className={styles.badge}>Play</span>
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

function SpinWheelCabinet() {
  const discRef = useRef<HTMLDivElement>(null)
  const lightsRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState('')
  const [spinning, setSpinning] = useState(false)
  const rotationRef = useRef(0)
  const prizes = ['50', 'JACKPOT', '10', '25', '100', 'FREE', '20', '5']
  const segAngle = 360 / prizes.length

  useEffect(() => {
    const lightsEl = lightsRef.current
    if (!lightsEl) return
    const positions = [
      [8, 50],
      [20, 78],
      [50, 88],
      [80, 78],
      [92, 50],
      [80, 22],
      [50, 12],
      [20, 22],
    ]
    positions.forEach((pos, i) => {
      const s = document.createElement('span')
      s.style.top = `${pos[0]}%`
      s.style.left = `${pos[1]}%`
      s.style.animationDelay = `${i * 0.18}s`
      lightsEl.appendChild(s)
    })
    return () => {
      lightsEl.replaceChildren()
    }
  }, [])

  function spin() {
    if (spinning || !discRef.current) return
    setSpinning(true)
    setResult('Spinning…')
    const targetIndex = Math.floor(Math.random() * prizes.length)
    const targetCenter = targetIndex * segAngle + segAngle / 2
    const currentMod = ((rotationRef.current % 360) + 360) % 360
    const offsetNeeded = (((360 - targetCenter) - currentMod) + 360 * 3) % 360
    rotationRef.current += 1800 + offsetNeeded
    discRef.current.style.transform = `rotate(${rotationRef.current}deg)`
    window.setTimeout(() => {
      setResult(`You won: ${prizes[targetIndex]}`)
      setSpinning(false)
    }, 4100)
  }

  return (
    <CabinetShell
      title="Spin Wheel"
      description="Weighted-segment prize wheel. Odds configured server-side."
      tint="rgba(212, 175, 55, 0.16)"
      controls={
        <>
          <button type="button" className={styles.playBtn} onClick={spin} disabled={spinning}>
            Spin
          </button>
          <span className={styles.resultLine}>{result}</span>
        </>
      }
    >
      <div className={styles.wheelLights} ref={lightsRef} />
      <div className={styles.wheelStage} onClick={spin} role="presentation">
        <div className={styles.wheelPointer} />
        <div className={styles.wheelPlate}>
          <div className={styles.wheelDisc} ref={discRef}>
            {prizes.map((prize, i) => {
              const center = i * segAngle + segAngle / 2
              const onDark = i % 2 === 1
              return (
                <div
                  key={prize + i}
                  className={styles.wheelLabel}
                  style={{
                    transform: `rotate(${center}deg) translate(28px,-6px)`,
                    color: onDark ? '#f1e9db' : '#12100c',
                  }}
                >
                  {prize}
                </div>
              )
            })}
          </div>
          <div className={styles.wheelHub} />
        </div>
      </div>
    </CabinetShell>
  )
}

function SlotCabinet() {
  const symbols = ['🍒', '7️⃣', '🔔', '⭐', '💎', '🍋']
  const [reels, setReels] = useState(['❔', '❔', '❔'])
  const [spinningFlags, setSpinningFlags] = useState([false, false, false])
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const [leverPulled, setLeverPulled] = useState(false)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearInterval(id))
    }
  }, [])

  function pull() {
    if (busy) return
    setBusy(true)
    setResult('')
    setLeverPulled(false)
    requestAnimationFrame(() => setLeverPulled(true))

    const finalSymbols = [0, 1, 2].map(
      () => symbols[Math.floor(Math.random() * symbols.length)],
    )
    setSpinningFlags([true, true, true])
    let doneCount = 0

    ;[0, 1, 2].forEach((i) => {
      let ticks = 0
      const maxTicks = 12 + i * 8
      const interval = window.setInterval(() => {
        setReels((prev) => {
          const next = [...prev]
          next[i] = symbols[Math.floor(Math.random() * symbols.length)]
          return next
        })
        ticks += 1
        if (ticks >= maxTicks) {
          window.clearInterval(interval)
          setReels((prev) => {
            const next = [...prev]
            next[i] = finalSymbols[i]
            return next
          })
          setSpinningFlags((prev) => {
            const next = [...prev]
            next[i] = false
            return next
          })
          doneCount += 1
          if (doneCount === 3) {
            setBusy(false)
            if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
              setResult('Jackpot!')
            } else if (
              finalSymbols[0] === finalSymbols[1] ||
              finalSymbols[1] === finalSymbols[2] ||
              finalSymbols[0] === finalSymbols[2]
            ) {
              setResult('Pair match — nice!')
            } else {
              setResult('Try again')
            }
          }
        }
      }, 70)
      timersRef.current.push(interval)
    })
  }

  return (
    <CabinetShell
      title="Slot Machine"
      description="Three-reel loyalty reels for daily streak rewards."
      tint="rgba(241, 233, 219, 0.08)"
      controls={
        <>
          <button type="button" className={styles.playBtn} onClick={pull} disabled={busy}>
            Pull
          </button>
          <span className={styles.resultLine}>{result}</span>
        </>
      }
    >
      <div
        className={cn(styles.slotLever, leverPulled && styles.slotLeverPulled)}
        onClick={pull}
        role="presentation"
      />
      <div className={styles.slotFrame}>
        {reels.map((symbol, i) => (
          <div
            key={i}
            className={cn(styles.reelWindow, spinningFlags[i] && styles.reelSpinning)}
          >
            {symbol}
          </div>
        ))}
      </div>
    </CabinetShell>
  )
}

function RaceCabinet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scoreText, setScoreText] = useState('Score: 0')
  const [showOverlay, setShowOverlay] = useState(true)
  const [overlayLabel, setOverlayLabel] = useState('Start')
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
      obstacles: [] as { lane: number; y: number }[],
      score: 0,
      speed: 2.2,
      frame: 0,
      dashOffset: 0,
      raf: 0,
    }

    function sizeCanvas() {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w
      canvas.height = h
      drawScene()
    }

    function laneX(l: number) {
      return w * 0.5 + (l - 1) * (w * 0.22)
    }

    function drawCar(x: number, y: number, color: string, accent: string, player = false) {
      ctx.fillStyle = color
      if (typeof ctx.roundRect === 'function') {
        ctx.beginPath()
        ctx.roundRect(x - 15, y - 22, 30, 40, 6)
        ctx.fill()
      } else {
        ctx.fillRect(x - 15, y - 22, 30, 40)
      }
      ctx.fillStyle = accent
      ctx.fillRect(x - 10, y - 14, 20, 10)
      ctx.fillRect(x - 10, y + 4, 20, 8)
      ctx.fillStyle = 'rgba(0,0,0,0.45)'
      ctx.fillRect(x - 17, y - 16, 4, 10)
      ctx.fillRect(x + 13, y - 16, 4, 10)
      ctx.fillRect(x - 17, y + 8, 4, 10)
      ctx.fillRect(x + 13, y + 8, 4, 10)
      if (player) {
        ctx.fillStyle = 'rgba(241,233,219,0.85)'
        ctx.fillRect(x - 4, y + 14, 8, 3)
      }
    }

    function drawScene() {
      ctx.clearRect(0, 0, w, h)
      // roadside
      ctx.fillStyle = '#0a0908'
      ctx.fillRect(0, 0, w, h)
      const roadW = w * 0.58
      const roadX = (w - roadW) / 2

      // grass / gravel edges
      ctx.fillStyle = '#16130e'
      ctx.fillRect(0, 0, roadX, h)
      ctx.fillRect(roadX + roadW, 0, w - (roadX + roadW), h)

      // road
      const roadGrad = ctx.createLinearGradient(roadX, 0, roadX + roadW, 0)
      roadGrad.addColorStop(0, '#1a1712')
      roadGrad.addColorStop(0.5, '#221e17')
      roadGrad.addColorStop(1, '#1a1712')
      ctx.fillStyle = roadGrad
      ctx.fillRect(roadX, 0, roadW, h)

      // road shoulders
      ctx.strokeStyle = 'rgba(241,233,219,0.35)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(roadX + 4, 0)
      ctx.lineTo(roadX + 4, h)
      ctx.moveTo(roadX + roadW - 4, 0)
      ctx.lineTo(roadX + roadW - 4, h)
      ctx.stroke()

      state.dashOffset = (state.dashOffset + state.speed) % 44
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)'
      ctx.lineWidth = 3
      ctx.setLineDash([18, 16])
      ctx.lineDashOffset = -state.dashOffset
      ;[1 / 3, 2 / 3].forEach((f) => {
        ctx.beginPath()
        ctx.moveTo(roadX + roadW * f, 0)
        ctx.lineTo(roadX + roadW * f, h)
        ctx.stroke()
      })
      ctx.setLineDash([])

      state.obstacles.forEach((o) => {
        drawCar(laneX(o.lane), o.y, '#6b5520', '#3d3114')
      })

      const cx = laneX(state.lane)
      const cy = h - 38
      drawCar(cx, cy, '#d4af37', '#f1e9db', true)
    }

    function gameOver() {
      state.running = false
      drawScene()
      setScoreText(`Crashed — Score: ${state.score}`)
      setOverlayLabel('Restart')
      setShowOverlay(true)
    }

    function loop() {
      if (!state.running) return
      state.frame += 1
      if (Math.random() < 0.02 + state.speed * 0.002) {
        state.obstacles.push({ lane: Math.floor(Math.random() * 3), y: -20 })
      }
      state.obstacles.forEach((o) => {
        o.y += state.speed * 2
      })
      const cy = h - 38
      for (const o of state.obstacles) {
        if (o.lane === state.lane && Math.abs(o.y - cy) < 34) {
          gameOver()
          return
        }
      }
      state.obstacles = state.obstacles.filter((o) => o.y < h + 20)
      if (state.frame % 6 === 0) {
        state.score += 1
        setScoreText(`Score: ${state.score}`)
      }
      if (state.frame % 200 === 0) state.speed += 0.4
      drawScene()
      state.raf = requestAnimationFrame(loop)
    }

    function start() {
      state.lane = 1
      state.obstacles = []
      state.score = 0
      state.speed = 2.2
      state.frame = 0
      setScoreText('Score: 0')
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
      if (e.key === 'ArrowLeft') state.lane = Math.max(0, state.lane - 1)
      if (e.key === 'ArrowRight') state.lane = Math.min(2, state.lane + 1)
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
      title="Car Racing"
      description="Arrow keys or on-screen buttons to dodge traffic."
      tint="rgba(212, 175, 55, 0.14)"
      controls={
        <>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => apiRef.current?.start()}
            disabled={!showOverlay}
          >
            {overlayLabel}
          </button>
          <span className={styles.resultLine}>{scoreText}</span>
        </>
      }
    >
      <div className={styles.raceWrap}>
        <canvas ref={canvasRef} className={styles.raceCanvas} />
      </div>
      {showOverlay ? (
        <div className={styles.raceOverlay}>
          <button
            type="button"
            className={styles.playBtn}
            onClick={() => apiRef.current?.start()}
          >
            {overlayLabel}
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

function ArcheryCabinet() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const crosshairRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState('Arrows: 5 · Score: 0')
  const stateRef = useRef({ arrowsLeft: 5, score: 0 })

  function reset() {
    stateRef.current = { arrowsLeft: 5, score: 0 }
    setResult('Arrows: 5 · Score: 0')
    sceneRef.current?.querySelectorAll(`.${styles.shaft}`).forEach((el) => el.remove())
  }

  function onMove(e: React.MouseEvent) {
    const scene = sceneRef.current
    const crosshair = crosshairRef.current
    if (!scene || !crosshair) return
    const rect = scene.getBoundingClientRect()
    crosshair.style.display = 'block'
    crosshair.style.left = `${e.clientX - rect.left}px`
    crosshair.style.top = `${e.clientY - rect.top}px`
  }

  function shoot(clientX: number, clientY: number) {
    const scene = sceneRef.current
    const target = targetRef.current
    if (!scene || !target) return
    const s = stateRef.current
    if (s.arrowsLeft <= 0) return

    const rect = scene.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    s.arrowsLeft -= 1

    const startX = 24
    const startY = rect.height - 24
    const dx = x - startX
    const dy = y - startY
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    const dist = Math.sqrt(dx * dx + dy * dy)

    const shaft = document.createElement('div')
    shaft.className = styles.shaft
    shaft.style.left = `${startX}px`
    shaft.style.top = `${startY}px`
    shaft.style.width = '0px'
    shaft.style.transform = `rotate(${angle}deg)`
    shaft.style.transition = 'width .32s ease-out'
    scene.appendChild(shaft)
    requestAnimationFrame(() => {
      shaft.style.width = `${dist}px`
    })

    const targetRect = target.getBoundingClientRect()
    const tx = targetRect.left + targetRect.width / 2 - rect.left
    const ty = targetRect.top + targetRect.height / 2 - rect.top
    const d = Math.hypot(x - tx, y - ty)

    window.setTimeout(() => {
      let pts = 0
      if (d < 7) pts = 50
      else if (d < 17) pts = 25
      else if (d < 29) pts = 15
      else if (d < 44) pts = 10
      s.score += pts
      let text = `Arrows: ${s.arrowsLeft} · Score: ${s.score}`
      text += pts > 0 ? `  (+${pts})` : '  (miss)'
      if (s.arrowsLeft <= 0) text += ' — round over'
      setResult(text)
    }, 340)
  }

  return (
    <CabinetShell
      title="Archery"
      description="Click or tap the screen to shoot. Five arrows a round."
      tint="rgba(241, 233, 219, 0.07)"
      controls={
        <>
          <button type="button" className={styles.playBtn} onClick={reset}>
            New round
          </button>
          <span className={styles.resultLine}>{result}</span>
        </>
      }
    >
      <div
        className={styles.archScene}
        ref={sceneRef}
        onMouseMove={onMove}
        onMouseLeave={() => {
          if (crosshairRef.current) crosshairRef.current.style.display = 'none'
        }}
        onClick={(e) => shoot(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          const t = e.touches[0]
          shoot(t.clientX, t.clientY)
        }}
      >
        <div className={styles.bow} />
        <div className={styles.target} ref={targetRef} />
        <div className={styles.crosshair} ref={crosshairRef} />
      </div>
    </CabinetShell>
  )
}

export function ArcadeCabinets() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <SpinWheelCabinet />
      <SlotCabinet />
      <RaceCabinet />
      <ArcheryCabinet />
    </div>
  )
}
