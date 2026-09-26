'use client'

// Mounts the 3D canvas only when the visitor's device can handle it. Everyone
// else (phones, reduced motion, data saver, weak hardware, no WebGL) keeps the
// flat layout that the server already rendered, so no content is ever missing.

import { useEffect, useRef } from 'react'
import styles from './kanopus3d.module.css'
import { phases } from './timeline'
import type { SceneApi } from './scene'

function canRun3D(): boolean {
  const mq = (q: string) => window.matchMedia(q).matches
  if (mq('(prefers-reduced-motion: reduce)')) return false
  // Wide, landscape screens only. Phones and tall tablets get the flat layout.
  if (!mq('(min-width: 900px) and (min-aspect-ratio: 23/20)')) return false
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  if (nav.connection?.saveData) return false
  if ((nav.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 8) < 4) return false
  return true
}

export default function Stage() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const root = wrap?.closest<HTMLElement>('[data-story]')
    if (!wrap || !root || !canRun3D()) return

    // A fresh canvas per run: a WebGL context cannot be reused once released,
    // and React may run this effect twice in development.
    const canvas = document.createElement('canvas')
    canvas.className = styles.canvas
    wrap.appendChild(canvas)

    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'))
    let api: SceneApi | null = null
    let disposed = false
    let raf = 0
    let inView = false

    const draw = () => {
      raf = 0
      if (!api) return
      const s = -root.getBoundingClientRect().top
      const vh = window.innerHeight
      api.update(s, vh)
      chapters.forEach((el, i) => el.style.setProperty('--o', String(phases(s, vh, i).text)))
    }
    const request = () => {
      if (!raf && inView && api) raf = requestAnimationFrame(draw)
    }
    const onResize = () => {
      api?.resize()
      request()
    }

    // Only draw while the story is on (or just about to be on) screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) request()
      },
      { rootMargin: '50% 0px 50% 0px' },
    )

    import('./scene')
      .then(async ({ createScene }) => {
        const created = await createScene(canvas, wrap)
        if (disposed) {
          created.destroy()
          return
        }
        api = created
        root.setAttribute('data-mode', '3d')
        created.resize() // the canvas box only has a size once 3D mode is on
        io.observe(root)
        request()
      })
      .catch(() => {
        // WebGL unavailable or the scene failed: stay on the flat layout.
        root.removeAttribute('data-mode')
      })

    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      io.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', onResize)
      chapters.forEach((el) => el.style.removeProperty('--o'))
      root.removeAttribute('data-mode')
      api?.destroy()
      canvas.remove()
    }
  }, [])

  // The 3D layer is decorative; every word on the page is real HTML.
  return <div ref={wrapRef} className={styles.canvasWrap} aria-hidden="true" />
}
