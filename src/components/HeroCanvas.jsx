import { useEffect, useRef } from 'react'

// Fundo animado leve: linhas de velocidade e partículas amarelas a deslizar.
// Pausa quando sai do ecrã e respeita "reduzir movimento".
export default function HeroCanvas({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let running = true
    let items = []

    const rand = (a, b) => a + Math.random() * (b - a)
    const spawn = (fresh) => {
      const line = Math.random() < 0.7
      return {
        line,
        x: fresh ? w + rand(0, 200) : rand(0, w),
        y: rand(0, h),
        len: line ? rand(60, 260) : 0,
        r: line ? rand(0.6, 1.4) : rand(1, 2.4),
        v: line ? rand(1.2, 3.2) : rand(0.3, 0.9),
        a: line ? rand(0.05, 0.22) : rand(0.15, 0.5),
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(Math.min(90, Math.max(30, (w * h) / 14000)))
      items = Array.from({ length: n }, () => spawn(false))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of items) {
        ctx.beginPath()
        if (p.line) {
          const g = ctx.createLinearGradient(p.x, p.y, p.x + p.len, p.y)
          g.addColorStop(0, `rgba(255,210,0,${p.a})`)
          g.addColorStop(1, 'rgba(255,210,0,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = p.r
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.len, p.y)
          ctx.stroke()
        } else {
          ctx.fillStyle = `rgba(255,210,0,${p.a})`
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const step = () => {
      if (!running) return
      for (let i = 0; i < items.length; i++) {
        const p = items[i]
        p.x -= p.v
        if (p.x + p.len < -10) items[i] = spawn(true)
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    resize()
    if (reduce) {
      draw()
    } else {
      const io = new IntersectionObserver(([e]) => {
        running = e.isIntersecting
        if (running) raf = requestAnimationFrame(step)
        else cancelAnimationFrame(raf)
      })
      io.observe(canvas)
      window.addEventListener('resize', resize)
      return () => {
        running = false
        cancelAnimationFrame(raf)
        io.disconnect()
        window.removeEventListener('resize', resize)
      }
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}
