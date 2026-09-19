'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { preloadImages, HERO_PRELOAD_IMAGES, PROPERTY_PRELOAD_IMAGES, PARTNER_PRELOAD_IMAGES } from '@/lib/preloadImages'
import './IntroSection.css'

const IntroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [done, setDone] = useState(false) // intro finished + swiped away
  const [exiting, setExiting] = useState(false) // swipe-up transition running
  const [ready, setReady] = useState(false) // sessionStorage check completed
  const [loading, setLoading] = useState(true) // video buffering, not yet playing
  const [progress, setProgress] = useState(0) // 0-100, real buffered %
  const finishedRef = useRef(false)
  // Skip the intro entirely if it has already played once this session
  // (e.g. user navigated away and clicked the logo to come back to Home).
  // Read after mount (not during render) so server and client render the
  // same initial markup — sessionStorage isn't available during SSR.
  const alreadyPlayedRef = useRef(false)

  useEffect(() => {
    if (sessionStorage.getItem('introPlayed') === '1') {
      alreadyPlayedRef.current = true
      setDone(true)
    }
    setReady(true)
  }, [])

  // Wait for the video to actually have enough buffered to play smoothly
  // before starting it (instead of calling play() immediately on a cold
  // network, which is what caused the stutter/freeze). Once it's genuinely
  // playing, use its ~10s runway to warm the cache for the heavy images the
  // user hits right after (hero slider, property grid) so those don't
  // compete with the video for bandwidth and don't stutter in later.
  useEffect(() => {
    if (!ready) return
    if (alreadyPlayedRef.current) return

    const video = videoRef.current
    if (!video) return

    let safety: ReturnType<typeof setTimeout> | null = null
    let startedPreload = false

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      if (safety) clearTimeout(safety)
      sessionStorage.setItem('introPlayed', '1')
      // Start the hero slideshow behind the overlay so it's live on reveal.
      window.dispatchEvent(new Event('introComplete'))
      setTimeout(() => setExiting(true), 250)
    }

    const onMeta = () => {
      const ms = (Number.isFinite(video.duration) ? video.duration : 12) * 1000
      safety = setTimeout(finish, ms + 2000)
    }

    // Real buffered % against the video's total duration — drives the
    // logo progress fill. Falls back gracefully if duration isn't known yet.
    const onProgress = () => {
      const dur = video.duration
      if (!Number.isFinite(dur) || dur <= 0 || video.buffered.length === 0) return
      const bufferedEnd = video.buffered.end(video.buffered.length - 1)
      setProgress(Math.min(100, Math.round((bufferedEnd / dur) * 100)))
    }

    // Fires once the video has enough data to play through without
    // buffering (given current download rate) — the real "ready" signal,
    // unlike loadedmetadata which only knows duration/dimensions.
    const onCanPlayThrough = () => {
      setLoading(false)
      setProgress(100)
      video.play().catch(finish)

      // Spread the other pages' heavy images across the video's runtime
      // (roughly a beat after playback starts, so the video's own buffer
      // fill isn't interrupted right as it begins).
      if (!startedPreload) {
        startedPreload = true
        setTimeout(() => {
          preloadImages([...HERO_PRELOAD_IMAGES, ...PROPERTY_PRELOAD_IMAGES, ...PARTNER_PRELOAD_IMAGES])
        }, 800)
      }
    }

    video.addEventListener('ended', finish)
    video.addEventListener('error', finish)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('progress', onProgress)
    video.addEventListener('canplaythrough', onCanPlayThrough)

    video.currentTime = 0
    video.load()

    // Safety net: some browsers/connections never fire canplaythrough for a
    // streamed mp4. Don't let the loader hang forever — fall back to
    // starting playback after a few seconds even if the signal never comes.
    const loadingFallback = setTimeout(() => {
      if (!finishedRef.current) onCanPlayThrough()
    }, 4000)

    return () => {
      if (safety) clearTimeout(safety)
      clearTimeout(loadingFallback)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('progress', onProgress)
      video.removeEventListener('canplaythrough', onCanPlayThrough)
    }
  }, [ready])

  if (done) return <div className="intro-spacer" />

  // Nothing to show yet — avoids flashing the video for a frame on repeat
  // visits while we wait to learn (post-mount) whether it already played.
  if (!ready) return null

  return (
    <motion.section
      className={`intro-section${loading ? ' is-loading' : ''}`}
      initial={{ y: 0 }}
      animate={{ y: exiting ? '-100%' : 0 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (exiting) setDone(true)
      }}
    >
      <video
        ref={videoRef}
        className="intro-video"
        muted
        playsInline
        preload="auto"
      >
        <source src="/intro-video.mp4" type="video/mp4" />
      </video>

      {loading && (
        <div className="intro-loading" aria-live="polite" aria-label={`Loading ${progress}%`}>
          <div className="intro-loading__logo-wrap">
            {/* Grayed-out base — always fully visible */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/omshakthy-logo.webp"
              alt=""
              aria-hidden="true"
              className="intro-loading__logo intro-loading__logo--base"
            />
            {/* Colour layer — clipped in from the left as progress increases */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/omshakthy-logo.webp"
              alt="OmShakthy"
              className="intro-loading__logo intro-loading__logo--fill"
              style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
            />
          </div>
          <div className="intro-loading__bar">
            <span className="intro-loading__bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="intro-loading__label">
            Loading <b>{progress}%</b>
          </span>
        </div>
      )}
    </motion.section>
  )
}

export default IntroSection
